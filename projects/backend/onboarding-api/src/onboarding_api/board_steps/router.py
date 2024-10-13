from typing import Optional
from uuid import UUID
from http import HTTPStatus

from fastapi import APIRouter

from onboarding_shared.schemas import protocol


board_steps_api = APIRouter()


@board_steps_api.post("/list/{board_id}", status_code=HTTPStatus.OK)
async def get_steps(
        board_id: UUID,
        list_req: protocol.BaseListRequest,
        is_include_blobs: bool = False
) -> protocol.BoardStepListResponse:
    return protocol.BoardStepListResponse()


@board_steps_api.post("/", status_code=HTTPStatus.CREATED)
async def create_step(create_req: protocol.CreateBoardStepRequest) -> protocol.BoardStep:
    return protocol.BoardStep()


@board_steps_api.get("/{board_step_id}", status_code=HTTPStatus.OK)
async def get_step(board_step_id: UUID, is_include_blobs: bool = False) -> protocol.BoardStep:
    return protocol.BoardStep()


@board_steps_api.patch("/{board_step_id}", status_code=HTTPStatus.OK)
async def update_step(board_step_id: UUID, update_req: protocol.UpdateBoardStepRequest) -> protocol.BoardStep:
    return protocol.BoardStep()


@board_steps_api.delete("/{board_step_id}", status_code=HTTPStatus.NO_CONTENT)
async def delete_step(board_step_id: UUID):
    ...


@board_steps_api.post("/{board_step_id}/blob", status_code=HTTPStatus.OK)
async def get_attach_blob_to_step(
        board_step_id: UUID,
        blob_type: protocol.BlobType
) -> protocol.ActionBlobToStepResponse:
    return protocol.ActionBlobToStepResponse()


@board_steps_api.patch("/{board_step_id}/blob/{blob_id}", status_code=HTTPStatus.OK)
async def get_update_blob_to_step(
        board_step_id: UUID,
        blob_id: UUID,
        update_blob_type: Optional[protocol.BlobType] = None
) -> protocol.ActionBlobToStepResponse:
    return protocol.ActionBlobToStepResponse()


@board_steps_api.post("/{board_step_id}/blob/list", status_code=HTTPStatus.OK)
async def get_blobs_step(board_step_id: UUID, list_req: protocol.BaseListRequest) -> protocol.BlobListResponse:
    return protocol.BlobListResponse()


@board_steps_api.get("/{board_step_id}/blob/{blob_id}", status_code=HTTPStatus.OK)
async def get_blob_step(board_step_id: UUID, blob_id: UUID) -> protocol.Blob:
    return protocol.Blob()


@board_steps_api.delete("/{board_step_id}/blob/{blob_id}", status_code=HTTPStatus.NO_CONTENT)
async def delete_blob_step(board_step_id: UUID, blob_id: UUID):
    ...
