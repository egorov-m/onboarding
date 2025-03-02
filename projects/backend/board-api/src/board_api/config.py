from collections import namedtuple
from os import environ
from json import loads
from urllib.parse import quote

from onboarding_shared import utils


PROJECT_NAME = environ.get("PROJECT_NAME", "Board API")
PROJECT_DESCRIPTION = environ.get("PROJECT_DESCRIPTION", "External API service for passing onboarding.")
APP_NAME = environ.get("APP_NAME", "board-api")
APP_VERSION = environ.get("APP_VERSION", "0.0.1")

SERVER_DOMAIN_NAME = environ.get("SERVER_DOMAIN_NAME", "localhost")
SERVER_PORT = int(environ.get("SERVER_PORT")) if environ.get("SERVER_PORT") is not None else None
SERVER_PROTOCOL = environ.get("SERVER_PROTOCOL", "http")
SERVER_PATH_PREFIX = environ.get("SERVER_PATH_PREFIX", "/")

SERVICE_NAME = f"backend-{APP_NAME}"
SERVICE_VERSION = APP_VERSION
DEBUG = loads(environ.get("DEBUG", "False").lower())

SERVICE_PORT = int(environ.get("SERVICE_PORT", "80"))
SERVICE_HOST = environ.get("SERVICE_HOST", "0.0.0.0")
WORKERS = int(environ.get("WORKERS", "1"))
WORKER_TIMEOUT = int(environ.get("WORKER_TIMEOUT", "20"))

BOARD_SYNC_ISSUER = environ.get("BOARD_SYNC_ISSUER", f"{SERVER_PROTOCOL}://{SERVER_DOMAIN_NAME}{SERVER_PATH_PREFIX}")
BOARD_SYNC_AUDIENCE = environ.get("BOARD_SYNC_AUDIENCE", APP_NAME)
BOARD_SYNC_TOKEN_COOKIE_NAME = environ.get("BOARD_SYNC_TOKEN_COOKIE_NAME", "__board-sync")
BOARD_SYNC_TOKEN_COOKIE_SECURE = loads(environ.get("BOARD_SYNC_TOKEN_COOKIE_SECURE", "True").lower())
BOARD_SYNC_TOKEN_COOKIE_HTTPONLY = loads(environ.get("BOARD_SYNC_TOKEN_COOKIE_HTTPONLY", "True").lower())
BOARD_SYNC_TOKEN_COOKIE_SAMESITE = environ.get("BOARD_SYNC_TOKEN_COOKIE_SAMESITE", "none")
BOARD_SYNC_TOKEN_SECRET = environ.get("BOARD_SYNC_TOKEN_SECRET", "secret")
BOARD_SYNC_TOKEN_ALGORITHM = environ.get("BOARD_SYNC_TOKEN_ALGORITHM", "HS512")
BOARD_SYNC_TOKEN_EXPIRATION_DAYS = int(environ.get("BOARD_SYNC_TOKEN_EXPIRATION_DAYS", "30"))

BOARD_EVENTS_DB_HOST = environ.get("BOARD_EVENTS_DB_HOST", "localhost")
BOARD_EVENTS_DB_PORT = int(environ.get("BOARD_EVENTS_DB_PORT", "8123"))
BOARD_EVENTS_DB_SECURE = loads(environ.get("BOARD_EVENTS_DB_SECURE", "False").lower())
BOARD_EVENTS_DB_NAME = environ.get("BOARD_EVENTS_DB_NAME", "project_board_events")
BOARD_EVENTS_DB_USER = environ.get("BOARD_EVENTS_DB_USER", "user_board_events")
BOARD_EVENTS_DB_PASSWORD = environ.get("BOARD_EVENTS_DB_PASSWORD", "password")

ONBOARDING_DB_HOST = environ.get("ONBOARDING_DB_HOST", "localhost")
ONBOARDING_DB_PORT = int(environ.get("ONBOARDING_DB_PORT", "5432"))
ONBOARDING_DB_NAME = environ.get("ONBOARDING_DB_NAME", "project.onboarding")
ONBOARDING_DB_USER = environ.get("ONBOARDING_DB_USER", "user.onboarding")
ONBOARDING_DB_PASSWORD = environ.get("ONBOARDING_DB_PASSWORD", "password")
ONBOARDING_DB_SSL = loads(environ.get("ONBOARDING_DB_SSL", "False").lower())
ONBOARDING_DB_MIN_CONNECTION = int(environ.get("ONBOARDING_DB_MIN_CONNECTION", "5"))
ONBOARDING_DB_MAX_CONNECTION = int(environ.get("ONBOARDING_DB_MAX_CONNECTION", "20"))
ONBOARDING_DB_CONNECTION_TIMEOUT = float(environ.get("ONBOARDING_DB_TIMEOUT", "60"))
ONBOARDING_DB_URL = (
    f"postgresql+asyncpg://{ONBOARDING_DB_USER}:{quote(ONBOARDING_DB_PASSWORD)}@"
    f"{ONBOARDING_DB_HOST}:{ONBOARDING_DB_PORT}/{ONBOARDING_DB_NAME}?"
    f"ssl={ONBOARDING_DB_SSL}&"
    f"min_size={ONBOARDING_DB_MIN_CONNECTION}&"
    f"max_size={ONBOARDING_DB_MAX_CONNECTION}&"
    f"timeout={ONBOARDING_DB_CONNECTION_TIMEOUT}"
)

ONBOARDING_S3_HOST = environ.get("ONBOARDING_S3_HOST", "localhost")
ONBOARDING_S3_PORT = int(environ.get("ONBOARDING_S3_PORT", "9000"))
ONBOARDING_S3_ENDPOINT_PATH_PREFIX = environ.get("ONBOARDING_S3_ENDPOINT_PATH_PREFIX", None)
ONBOARDING_S3_URL = f"{ONBOARDING_S3_HOST}:{ONBOARDING_S3_PORT}"
ONBOARDING_S3_SECURE = loads(environ.get("ONBOARDING_S3_SECURE", "True").lower())
ONBOARDING_S3_CERT_CHECK = loads(environ.get("ONBOARDING_S3_CERT_CHECK", "True").lower())
ONBOARDING_S3_ACCESS_KEY = environ.get("ONBOARDING_S3_ACCESS_KEY", "user.onboarding")
ONBOARDING_S3_SECRET_KEY = environ.get("ONBOARDING_S3_SECRET_KEY", "secret")

ONBOARDING_S3_BUCKETS_PREFIX = environ.get("ONBOARDING_S3_BUCKETS_PREFIX", None)
S3Buckets = namedtuple("S3Buckets", ("board_images",))

_ONBOARDING_S3_BOARD_IMAGES_BUCKET = environ.get("ONBOARDING_S3_BOARD_IMAGES_BUCKET", "images")
ONBOARDING_S3_BUCKETS = S3Buckets(
    utils.canonical_s3_bucket_name(_ONBOARDING_S3_BOARD_IMAGES_BUCKET, ONBOARDING_S3_BUCKETS_PREFIX)
)
ONBOARDING_S3_CLIENT_DISABLE_INITIALIZATION = loads(environ.get(
    "ONBOARDING_S3_CLIENT_DISABLE_INITIALIZATION",
    "False"
).lower())

ONBOARDING_S3_PRESIGNED_GET_OBJECT_EXPIRES_MINUTES = int(environ.get("S3_PRESIGNED_GET_OBJECT_EXPIRES_MINUTES", "1440"))
