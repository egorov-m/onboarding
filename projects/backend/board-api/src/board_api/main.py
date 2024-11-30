from contextlib import asynccontextmanager
from http import HTTPStatus
from logging import getLogger

from fastapi import FastAPI
from starlette.requests import Request
from starlette.responses import Response, JSONResponse

from onboarding_shared.exceptions import ApiException, ApiErrorCode
from onboarding_shared.schemas.protocol import ErrorResponse

from . import config
from .api import root_api
from .database import onboarding_database


logger = getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await onboarding_database.connect()
    yield
    await onboarding_database.disconnect()


router = FastAPI(
    root_path=config.SERVER_PATH_PREFIX,
    title=config.PROJECT_NAME,
    version=config.APP_VERSION,
    lifespan=lifespan,
)
router.include_router(root_api)


@router.exception_handler(Exception)
async def api_exception_handler(request: Request, exc: Exception):
    error_code = exc.error_code if isinstance(exc, ApiException) else ApiErrorCode.GENERIC_ERROR
    logger.info(msg=exc)
    return JSONResponse(
        status_code=HTTPStatus.OK,
        content=ErrorResponse(errors=[error_code]).model_dump()
    )
