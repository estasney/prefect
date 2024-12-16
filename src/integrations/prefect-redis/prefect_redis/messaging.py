import asyncio
import socket
import uuid
from contextlib import asynccontextmanager
from datetime import timedelta
from functools import partial
from typing import (
    Any,
    AsyncGenerator,
    Awaitable,
    Callable,
    TypeVar,
)

import orjson
from pydantic import Field
from redis.asyncio import Redis
from redis.exceptions import ResponseError
from typing_extensions import Self

from prefect.logging import get_logger
from prefect.server.utilities.messaging import Cache as _Cache
from prefect.server.utilities.messaging import Consumer as _Consumer
from prefect.server.utilities.messaging import Message, MessageHandler, StopConsumer
from prefect.server.utilities.messaging import Publisher as _Publisher
from prefect.settings.base import PrefectBaseSettings, _build_settings_config

logger = get_logger(__name__)


M = TypeVar("M", bound=Message)

MESSAGE_DEDUPLICATION_LOOKBACK = timedelta(minutes=5)


class RedisSettings(PrefectBaseSettings):
    model_config = _build_settings_config(("prefect", "redis"))

    redis_host: str = Field(default="localhost")
    redis_port: int = Field(default=6379)
    redis_db: int = Field(default=0)
    redis_username: str = Field(default="default")


def get_async_redis_client() -> Redis:
    settings = RedisSettings()
    return Redis(
        host=settings.redis_host,
        port=settings.redis_port,
        db=str(settings.redis_db),
        username=settings.redis_username,
        password="",
    )


class Cache(_Cache):
    def __init__(self, topic: str = "change-me"):
        super().__init__()
        self.topic = topic  # TODO - should this go on base class?

        self._client = get_async_redis_client()

    async def clear_recently_seen_messages(self) -> None:
        # TODO - do we need this?
        return

    async def without_duplicates(self, attribute: str, messages: list[M]) -> list[M]:
        messages_with_attribute = []
        messages_without_attribute = []
        async with self._client.pipeline() as p:
            for m in messages:
                if m.attributes is None or attribute not in m.attributes:
                    logger.warning(
                        "Message is missing deduplication attribute %r",
                        attribute,
                        extra={"event_message": m},
                    )
                    messages_without_attribute.append(m)
                    continue
                p.set(
                    f"message:{self.topic}:{m.attributes[attribute]}",
                    "1",
                    nx=True,
                    ex=MESSAGE_DEDUPLICATION_LOOKBACK,
                )
                messages_with_attribute.append(m)
            results: list[bool | None] = await p.execute()

        return [
            m for i, m in enumerate(messages_with_attribute) if results[i]
        ] + messages_without_attribute

    async def forget_duplicates(self, attribute: str, messages: list[M]) -> None:
        async with self._client.pipeline() as p:
            for m in messages:
                if m.attributes is None or attribute not in m.attributes:
                    logger.warning(
                        "Message is missing deduplication attribute %r",
                        attribute,
                        extra={"event_message": m},
                    )
                    continue
                p.delete(f"message:{self.topic}:{m.attributes[attribute]}")
            await p.execute()


class Message:
    """
    A message sent to a Redis stream.
    """

    def __init__(
        self,
        data: bytes | str,
        attributes: dict[str, Any],
        acker: Callable[[], Awaitable[None]] | None = None,
    ) -> None:
        self.data = data
        self.attributes = attributes
        self.acker = acker

    async def acknowledge(self) -> None:
        """
        Acknowledges the message.
        """
        assert self.acker is not None
        await self.acker()


class Publisher(_Publisher):
    """
    A publisher that sends events to Redis Streams

    Attributes:
        stream: the name of the stream to publish to
        deduplicate_by: the name of the attribute to use for deduplication
        batch_size: the maximum number of events to batch together
        publish_every: the maximum amount of time to wait before publishing a batch
    """

    def __init__(
        self,
        stream: str,
        cache: _Cache,
        deduplicate_by: str | None = None,
        batch_size: int = 5,
        publish_every: timedelta | None = None,
    ):
        self.stream = stream
        self.cache = cache
        self.deduplicate_by = deduplicate_by
        self.batch_size = batch_size
        self.publish_every = publish_every
        self._periodic_task: asyncio.Task | None = None

    async def __aenter__(self) -> Self:
        self._client = get_async_redis_client()

        self._batch: list[Message] = list()
        if self.publish_every is not None:
            interval = self.publish_every.total_seconds()

            async def _publish_periodically() -> None:
                while True:
                    await asyncio.sleep(interval)
                    await asyncio.shield(self._publish_current_batch())

            self._periodic_task = asyncio.create_task(_publish_periodically())

        return self

    async def __aexit__(self, exc_type, exc_value, traceback):
        if self._periodic_task:
            self._periodic_task.cancel()
        await asyncio.shield(self._publish_current_batch())

    async def publish_data(self, data: bytes, attributes: dict[str, str]):
        """
        Publishes the given data to Redis Streams

        Args:
            data: the data to publish
            attributes: the attributes to publish with the data
        """
        if not hasattr(self, "_batch"):
            raise RuntimeError("Use this publisher as an async context manager")

        self._batch.append(Message(data=data, attributes=attributes))
        if len(self._batch) > self.batch_size:
            await asyncio.shield(self._publish_current_batch())

    async def _publish_current_batch(self) -> None:
        if self.deduplicate_by:
            to_publish = await self.cache.without_duplicates(
                self.deduplicate_by, self._batch
            )
        else:
            to_publish = list(self._batch)
        self._batch.clear()

        try:
            for message in to_publish:
                await self._client.xadd(
                    self.stream,
                    {
                        "data": message.data,
                        "attributes": orjson.dumps(message.attributes),
                    },
                )
        except Exception:
            if self.deduplicate_by:
                await self.cache.forget_duplicates(self.deduplicate_by, to_publish)
            raise


class Consumer(_Consumer):
    """
    Consumer implementation for Redis Streams.

    Attributes:
        name: the name of the consumer
        stream: the name of the stream to consume from
        group: the name of the consumer group to consume from
        message_batch_size: how many messages to pull from Redis at a time
        block: how long to block for new messages before returning
        min_idle_time: how long to wait before claiming pending messages.
        should_process_pending_messages: whether to claim and process pending
            messages before starting to consume new messages
        starting_message_id: the ID to use when creating the consumer group. If "$", the
            group will be created with the latest message ID. If "0", the group will be
            created with the earliest message ID.
    """

    def __init__(
        self,
        name: str,
        stream: str,
        group: str,
        block: timedelta = timedelta(seconds=1),
        min_idle_time: timedelta = timedelta(seconds=1),
        should_process_pending_messages: bool = False,
        starting_message_id: str = "0",
        automatically_acknowledge: bool = True,
    ):
        self.name = name
        self.stream = stream
        self.group = group
        self.block = block
        self.min_idle_time = min_idle_time
        self.should_process_pending_messages = should_process_pending_messages
        self.starting_message_id = starting_message_id
        self.automatically_acknowledge = automatically_acknowledge

    async def process_pending_messages(
        self,
        handler: MessageHandler,
        redis_client: Redis,
        message_batch_size: int,
        start_id: str = "0-0",
    ):
        """Claims and processes pending messages."""
        acker = partial(redis_client.xack, self.stream, self.group)

        while True:
            result = await redis_client.xautoclaim(
                name=self.stream,
                groupname=self.group,
                consumername=self.name,
                min_idle_time=int(self.min_idle_time.total_seconds() * 1000),
                start_id=start_id,
                count=message_batch_size,
            )
            next_start_id, claimed_messages = result[0], result[1]

            if not claimed_messages:
                break

            for message_id, message in claimed_messages:
                redis_stream_message = Message(
                    data=message["data"],
                    attributes=message.get("attributes", {}),
                    acker=partial(acker, message_id),
                )
                try:
                    await handler(redis_stream_message)
                    if self.automatically_acknowledge:
                        await redis_stream_message.acknowledge()
                except StopConsumer as e:
                    if e.ack:
                        await redis_stream_message.acknowledge()
                    raise

            start_id = next_start_id

    async def run(
        self,
        handler: MessageHandler,
        message_batch_size: int = 1,
    ) -> None:
        """
        Runs the consumer to receive messages from the Redis stream named `stream` in
        the consumer group named `group`, then calling `handler` for each message
        received.

        Args:
            handler: the function to call for each message
            message_batch_size: how many messages the handler will handle in batches; if
                the handler processes messages independently without batching, leave this
                at 1
        """
        redis_client: Redis = get_async_redis_client()

        try:
            # Ensure the consumer group exists
            await redis_client.xgroup_create(
                self.stream, self.group, id=self.starting_message_id, mkstream=True
            )
        except ResponseError as e:
            if "already exists" in str(e):
                logger.debug("Consumer group already exists: %s", e)
            else:
                raise

        acker = partial(redis_client.xack, self.stream, self.group)

        while True:
            if self.should_process_pending_messages:
                try:
                    await self.process_pending_messages(
                        handler, redis_client, message_batch_size
                    )
                except StopConsumer:
                    return

            stream_entries = await redis_client.xreadgroup(
                groupname=self.group,
                consumername=self.name,
                streams={self.stream: ">"},
                count=message_batch_size,
                block=int(self.block.total_seconds() * 1000),
            )
            for _, messages in stream_entries:
                for message_id, message in messages:
                    try:
                        redis_stream_message = Message(
                            data=message["data"],
                            attributes=orjson.loads(message["attributes"]),
                            acker=partial(acker, message_id),
                        )
                        await handler(redis_stream_message)
                        if self.automatically_acknowledge:
                            await redis_stream_message.acknowledge()
                    except StopConsumer as e:
                        if e.ack:
                            await redis_stream_message.acknowledge()
                        return
                    except Exception:
                        logger.exception("Error processing message %s", message_id)


@asynccontextmanager
async def ephemeral_subscription(
    app_name: str,
    source: str | None = None,
    group: str | None = None,
) -> AsyncGenerator[dict[str, Any], None]:
    """
    Creates an ephemeral subscription to the given source, removing it when the context exits.

    Will create a subscription for PubSub. If the process crashes, the subscription will expire in 1 day (the
    lowest value that Pub/Sub supports).

    Will create a consumer group for Redis Streams.
    """
    # consumer group creation will be handled by the consumer
    source = source or "change-me"
    group_name = group or f"ephemeral-{socket.gethostname()}-{uuid.uuid4().hex}"
    logger.info("Created ephemeral consumer group %s for stream %s", group_name, source)
    redis_client: Redis = get_async_redis_client()
    try:
        await redis_client.xgroup_create(source, group_name, mkstream=True)
        yield {"name": app_name, "source": source, "group": group_name}
    except Exception:
        logger.exception("Error in ephemeral subscription")
        raise
    finally:
        await redis_client.xgroup_destroy(source, group_name)
        logger.info(
            "Deleted ephemeral consumer group %s for stream %s", group_name, source
        )


@asynccontextmanager
async def break_topic():
    from unittest import mock

    publishing_mock = mock.AsyncMock(side_effect=ValueError("oops"))

    with mock.patch(
        "prefect.server.utilities.messaging.memory.Topic.publish",
        publishing_mock,
    ):
        yield
