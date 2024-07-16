from typing import List, Optional
from uuid import UUID

from pydantic import Field

from prefect._internal.schemas.bases import PrefectBaseModel


class BlockSchemaFilterBlockTypeId(PrefectBaseModel):
    """Filter by `BlockSchema.block_type_id`."""

    any_: Optional[List[UUID]] = Field(
        default=None, description="A list of block type ids to include"
    )