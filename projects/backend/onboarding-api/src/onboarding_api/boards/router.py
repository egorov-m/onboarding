from uuid import UUID
from http import HTTPStatus

from fastapi import APIRouter, Depends

from onboarding_shared.schemas import protocol

from .service import BoardsApiService
from ..iam import get_auth_user, AuthUserData


boards_api = APIRouter()


@boards_api.post("/list", status_code=HTTPStatus.OK)
async def get_boards_info(
        list_req: protocol.ListRequest,
        user: AuthUserData = Depends(get_auth_user()),
) -> protocol.BoardInfoListResponse:
    # TODO: implement getting via the cursor
    return await BoardsApiService.get_boards_info(user.id)


@boards_api.post("/", status_code=HTTPStatus.CREATED)
async def create_board(
        create_req: protocol.CreateBoardRequest,
        user: AuthUserData = Depends(get_auth_user()),
) -> protocol.BoardInfo:
    return await BoardsApiService.create_board(create_req, user.id)


@boards_api.get("/{board_id}", status_code=HTTPStatus.OK)
async def get_board_info(board_id: UUID, user: AuthUserData = Depends(get_auth_user())) -> protocol.BoardInfo:
    return await BoardsApiService.get_board_info(str(board_id), user.id)


@boards_api.patch("/{board_id}", status_code=HTTPStatus.OK)
async def update_board_info(
        board_id: UUID,
        update_req: protocol.UpdateBoardInfoRequest,
        user: AuthUserData = Depends(get_auth_user()),
) -> protocol.BoardInfo:
    return await BoardsApiService.update_board_info(str(board_id), user.id, update_req)


@boards_api.delete("/{board_id}", status_code=HTTPStatus.NO_CONTENT)
async def delete_board(board_id: UUID, user: AuthUserData = Depends(get_auth_user())):
    await BoardsApiService.delete_board(str(board_id), user.id)
