from board_api.config import (
    SERVICE_PORT,
    SERVICE_HOST,
    WORKERS,
    WORKER_TIMEOUT,
    DEBUG
)


bind = f"{SERVICE_HOST}:{SERVICE_PORT}"
workers = WORKERS
timeout = WORKER_TIMEOUT
worker_class = "uvicorn.workers.UvicornWorker"
logger_class = "gunicorn.glogging.Logger"
loglevel = "debug" if DEBUG else "error"
