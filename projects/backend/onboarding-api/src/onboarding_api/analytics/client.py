from clickhouse_connect import get_client

from .. import config


client = get_client(
    host=config.BOARD_EVENTS_DB_HOST,
    port=config.BOARD_EVENTS_DB_PORT,
    secure=config.BOARD_EVENTS_DB_SECURE,
    username=config.BOARD_EVENTS_DB_USER,
    password=config.BOARD_EVENTS_DB_PASSWORD,
    database=config.BOARD_EVENTS_DB_NAME
)
