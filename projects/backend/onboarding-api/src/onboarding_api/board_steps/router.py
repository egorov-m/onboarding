from uuid import UUID
from http import HTTPStatus

from fastapi import APIRouter, Depends, BackgroundTasks
from pydantic import conint

from onboarding_shared.schemas import protocol
from .service import BoardStepsApiService
from ..iam import get_auth_user, AuthUserData


board_steps_api = APIRouter()


@board_steps_api.post("/list/{board_id}", status_code=HTTPStatus.OK)
async def get_steps(
        board_id: UUID,
        list_req: protocol.BaseListRequest,
        is_include_blobs: bool = False,
        is_include_link: bool = True,
        user: AuthUserData = Depends(get_auth_user()),
) -> protocol.BoardStepListResponse:
    return await BoardStepsApiService.get_steps(board_id, user.id, is_include_blobs, is_include_link)


@board_steps_api.get("/list/{board_id}/{index}", status_code=HTTPStatus.OK)
async def get_step_by_index(
        board_id: UUID,
        index: conint(ge=0, le=protocol.INDEX_BOARD_STEPS_LIMIT),
        is_include_blobs: bool = False,
        is_include_link: bool = True,
        user: AuthUserData = Depends(get_auth_user()),
) -> protocol.BoardStep:
    return await BoardStepsApiService.get_step_by_index(
        board_id,
        index,
        user.id,
        is_include_blobs,
        is_include_link
    )


@board_steps_api.patch("/list/{board_id}/{index}", status_code=HTTPStatus.OK)
async def move_step_by_index(
        board_id: UUID,
        index: int,
        new_index: conint(ge=0, le=protocol.INDEX_BOARD_STEPS_LIMIT),
        is_include_blobs: bool = False,
        is_include_link: bool = True,
        user: AuthUserData = Depends(get_auth_user()),
) -> protocol.BoardStep:
    return await BoardStepsApiService.move_step_by_index(
        board_id,
        index,
        new_index,
        user.id,
        is_include_blobs,
        is_include_link
    )


@board_steps_api.post("/", status_code=HTTPStatus.CREATED)
async def create_step(
        create_req: protocol.CreateBoardStepRequest,
        user: AuthUserData = Depends(get_auth_user()),
) -> protocol.BoardStep:
    return await BoardStepsApiService.create_board_step(create_req, user.id)


@board_steps_api.get("/{board_step_id}", status_code=HTTPStatus.OK)
async def get_step(
        board_step_id: UUID,
        is_include_blobs: bool = False,
        is_include_link: bool = True,
        user: AuthUserData = Depends(get_auth_user()),
) -> protocol.BoardStep:
    return await BoardStepsApiService.get_step_by_id(
        str(board_step_id),
        user.id,
        is_include_blobs,
        is_include_link
    )


@board_steps_api.patch("/{board_step_id}", status_code=HTTPStatus.OK)
async def update_step(
        board_step_id: UUID,
        update_req: protocol.UpdateBoardStepRequest,
        is_include_blobs: bool = False,
        is_include_link: bool = True,
        user: AuthUserData = Depends(get_auth_user()),
) -> protocol.BoardStep:
    return await BoardStepsApiService.update_step(
        str(board_step_id),
        update_req,
        user.id,
        is_include_blobs,
        is_include_link
    )


@board_steps_api.delete("/{board_step_id}", status_code=HTTPStatus.NO_CONTENT)
async def delete_step(
        board_step_id: UUID,
        background_tasks: BackgroundTasks,
        user: AuthUserData = Depends(get_auth_user()),
):
    await BoardStepsApiService.delete_step(str(board_step_id), user.id, background_tasks)


@board_steps_api.post("/{board_step_id}/blob", status_code=HTTPStatus.OK)
async def get_attach_blob_to_step(
        board_step_id: UUID,
        blob_type: protocol.BlobType,
        user: AuthUserData = Depends(get_auth_user()),
) -> protocol.ActionBlobToStepResponse:
    return await BoardStepsApiService.get_attach_blob_to_step(str(board_step_id), user.id, blob_type)


@board_steps_api.patch("/{board_step_id}/blob/{blob_id}", status_code=HTTPStatus.OK)
async def get_update_blob_to_step(
        board_step_id: UUID,
        blob_id: UUID,
        user: AuthUserData = Depends(get_auth_user()),
) -> protocol.ActionBlobToStepResponse:
    return await BoardStepsApiService.get_update_blob_to_step(str(board_step_id), user.id, str(blob_id))


@board_steps_api.post("/{board_step_id}/blob/list", status_code=HTTPStatus.OK)
async def get_blobs_step(
        board_step_id: UUID,
        list_req: protocol.BaseListRequest,
        is_include_link: bool = True,
        user: AuthUserData = Depends(get_auth_user()),
) -> protocol.BlobListResponse:
    return await BoardStepsApiService.get_blobs_step(str(board_step_id), user.id, is_include_link)


@board_steps_api.get("/{board_step_id}/blob/{blob_id}", status_code=HTTPStatus.OK)
async def get_blob_step(
        board_step_id: UUID,
        blob_id: UUID,
        is_include_link: bool = True,
        user: AuthUserData = Depends(get_auth_user()),
) -> protocol.Blob:
    return await BoardStepsApiService.get_blob_step(str(board_step_id), user.id, str(blob_id), is_include_link)


@board_steps_api.delete("/{board_step_id}/blob/{blob_id}", status_code=HTTPStatus.NO_CONTENT)
async def delete_blob_step(
        board_step_id: UUID,
        blob_id: UUID,
        background_tasks: BackgroundTasks,
        user: AuthUserData = Depends(get_auth_user()),
):
    await BoardStepsApiService.delete_blob_step(str(board_step_id), user.id, str(blob_id), background_tasks)
