#!/usr/bin/env bash

container_id=$(docker ps -a -q -f name=^prefect-postgres$)
if [ -n "$container_id" ]; then
    echo "PostgreSQL container exists..."
    docker start prefect-postgres || true
else
    echo "Creating new PostgreSQL container..."
    docker run -d --name prefect-postgres \
        -v prefectdb:/var/lib/postgresql/data \
        -p 5432:5432 \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=prefect_password \
        -e POSTGRES_DB=prefect \
        postgres:latest
fi

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until docker exec prefect-postgres pg_isready -U postgres; do
    echo "PostgreSQL is unavailable - sleeping"
    sleep 1
done
echo "PostgreSQL is ready!"

# Configure Prefect to use PostgreSQL
prefect config set PREFECT_API_DATABASE_CONNECTION_URL="postgresql+asyncpg://postgres:prefect_password@localhost:5432/prefect"

# Clear any existing OTEL environment variables and set new ones
unset $(env | grep OTEL_ | cut -d= -f1)
export OTEL_SERVICE_NAME=prefect-server
export OTEL_TRACES_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
export OTEL_EXPORTER_OTLP_PROTOCOL=grpc
export OTEL_LOG_LEVEL=debug
export PYTHONPATH=/Users/nate/github.com/prefecthq/prefect/src

# Start the server in the background
echo "Starting Prefect server..."
opentelemetry-instrument \
  uvicorn \
  --app-dir /Users/nate/github.com/prefecthq/prefect/src \
  --factory prefect.server.api.server:create_app \
  --host 127.0.0.1 \
  --port 4200 \
  --timeout-keep-alive 5 &

# Wait for server to be ready
echo "Waiting for server to start..."
until curl -s http://127.0.0.1:4200/api/health > /dev/null; do
    sleep 1
done
echo "Server is ready!"

# Create work pool and deployments
prefect --no-prompt work-pool create local --type process --overwrite
prefect --no-prompt deploy --all --prefect-file load_testing/prefect.yaml

# Start the worker in the background
echo "Starting Prefect worker..."
prefect worker start -p local &

echo "Setup complete! Server and worker are running in the background."
echo "To stop everything, you can use: pkill -f 'prefect|uvicorn'"
