#!/bin/bash

set -e

CLICKHOUSE_DB="${CLICKHOUSE_DB:-board}";

clickhouse-client --query "CREATE DATABASE IF NOT EXISTS ${CLICKHOUSE_DB};"


echo "
CREATE TABLE IF NOT EXISTS ${CLICKHOUSE_DB}.events
(
    \`scope\` String NOT NULL,
    \`session_id\` UUID NOT NULL,
    \`board_id\` UUID NOT NULL,
    \`board_owner_id\` UUID NOT NULL,
    \`board_name\` String NOT NULL,
    \`sync_step_id\` UUID NOT NULL,
    \`sync_step_index\` UInt8 NOT NULL,
    \`sync_step_title\` String NOT NULL,
    \`sync_at\` DateTime64(3, 'Etc/UTC') NOT NULL,
    \`rating\` UInt16 NULL,
    \`finalized\` Bool NULL
)
ENGINE = MergeTree
PARTITION BY toYYYYMM(sync_at)
ORDER BY (sync_at)
SETTINGS index_granularity = 8192
;" | clickhouse-client
