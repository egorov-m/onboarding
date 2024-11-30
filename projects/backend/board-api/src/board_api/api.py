from fastapi import APIRouter
from fastapi.responses import JSONResponse

from .board_sync import board_sync_api


root_api = APIRouter(
    default_response_class=JSONResponse,
)
root_api.include_router(board_sync_api, prefix="", tags=["BoardSync"])
