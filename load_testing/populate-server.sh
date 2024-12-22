#!/usr/bin/env bash

# Start PostgreSQL container
# docker run -d --name prefect-postgres \
#     -v prefectdb:/var/lib/postgresql/data \
#     -p 5432:5432 \
#     -e POSTGRES_USER=postgres \
#     -e POSTGRES_PASSWORD=prefect_password \
#     -e POSTGRES_DB=prefect \
#     postgres:latest

# Configure Prefect to use PostgreSQL
# prefect config set PREFECT_API_DATABASE_CONNECTION_URL="postgresql+asyncpg://postgres:prefect_password@localhost:5432/prefect"

# Create work pool and deployments
prefect --no-prompt work-pool create local --type process --overwrite

prefect --no-prompt deploy --all --prefect-file load_testing/prefect.yaml
