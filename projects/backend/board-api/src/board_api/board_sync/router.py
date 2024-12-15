from http import HTTPStatus
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, BackgroundTasks

from onboarding_shared.schemas import protocol

from .deps import sync_service
from .service import BoardSyncService


board_sync_api = APIRouter()


@board_sync_api.post("/sync", status_code=HTTPStatus.OK)
async def sync(
        background_tasks: BackgroundTasks,
        update: Optional[protocol.BoardSyncRequest] = None,
        service: BoardSyncService = Depends(sync_service),
) -> protocol.BoardSync:
    return await service.sync(update, background_tasks)


@board_sync_api.post("/schema", status_code=HTTPStatus.OK)
async def schema(
        board_id: UUID,
        list_req: protocol.BaseListRequest,
        service: BoardSyncService = Depends(sync_service)
) -> protocol.BoardSyncSchema:
    return await service.schema(board_id)


@board_sync_api.post("/data", status_code=HTTPStatus.OK)
async def step_data(
        background_tasks: BackgroundTasks,
        update: Optional[protocol.BoardSyncRequest],
        is_include_blobs: bool = True,
        is_include_link: bool = True,
        service: BoardSyncService = Depends(sync_service)
) -> protocol.BoardSyncData:
    return await service.step_data(update, is_include_blobs, is_include_link, background_tasks)
