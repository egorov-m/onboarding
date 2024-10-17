from os import environ
from json import loads
from urllib.parse import quote

PROJECT_NAME = environ.get("PROJECT_NAME", "Onboarding API")
PROJECT_DESCRIPTION = environ.get("PROJECT_DESCRIPTION", "External API of onboarding service.")
APP_NAME = environ.get("APP_NAME", "onboarding-api")
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

AUTH_USER_EMAIL_HEADER_NAME = environ.get("AUTH_USER_EMAIL_HEADER_NAME", "X-Auth-Request-Email")

DB_HOST = environ.get("DB_HOST", "localhost")
DB_PORT = int(environ.get("DB_PORT", "5432"))
DB_NAME = environ.get("DB_NAME", "project.onboarding")
DB_USER = environ.get("DB_USER", "user.onboarding")
DB_PASSWORD = environ.get("DB_PASSWORD", "password")
DB_SSL = loads(environ.get("DB_SSL", "False").lower())
DB_MIN_CONNECTION = int(environ.get("DB_MIN_CONNECTION", "5"))
DB_MAX_CONNECTION = int(environ.get("DB_MAX_CONNECTION", "20"))
DB_CONNECTION_TIMEOUT = float(environ.get("DB_TIMEOUT", "60"))
DB_URL = (f"postgresql+asyncpg://{DB_USER}:{quote(DB_PASSWORD)}@{DB_HOST}:{DB_PORT}/{DB_NAME}?"
          f"ssl={DB_SSL}&"
          f"min_size={DB_MIN_CONNECTION}&"
          f"max_size={DB_MAX_CONNECTION}&"
          f"timeout={DB_CONNECTION_TIMEOUT}")
