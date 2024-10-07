from fastapi import FastAPI

from . import config
from .routers import boards_api, board_steps_api

router = FastAPI(
    root_path=config.SERVER_PATH_PREFIX,
    title=config.PROJECT_NAME,
    version=config.APP_VERSION,
)
router.include_router(boards_api, prefix="/boards", tags=["Boards"])
router.include_router(board_steps_api, prefix="/board_steps", tags=["BoardSteps"])
