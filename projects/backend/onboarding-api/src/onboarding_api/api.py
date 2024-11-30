from fastapi import APIRouter
from fastapi.responses import JSONResponse

from .board_steps import board_steps_api
from .boards import boards_api


root_api = APIRouter(
    default_response_class=JSONResponse,
)
root_api.include_router(boards_api, prefix="/boards", tags=["Boards"])
root_api.include_router(board_steps_api, prefix="/board_steps", tags=["BoardSteps"])
