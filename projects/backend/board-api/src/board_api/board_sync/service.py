from http import HTTPStatus
from typing import Optional, List

from starlette.responses import Response

from onboarding_shared import utils
from onboarding_shared.exceptions import ApiException, ApiErrorCode
from onboarding_shared.schemas import protocol

from .repository import BoardSyncRepository
from .utils import get_token_payload, update_payload_token, create_payload_token, create_token_by_payload
from .. import storage
from ..config import (
    BOARD_SYNC_TOKEN_COOKIE_NAME,
    SERVER_DOMAIN_NAME,
    BOARD_SYNC_TOKEN_COOKIE_SECURE,
    BOARD_SYNC_TOKEN_COOKIE_HTTPONLY,
    BOARD_SYNC_TOKEN_COOKIE_SAMESITE,
    BOARD_SYNC_TOKEN_EXPIRATION_DAYS,
    SERVER_PATH_PREFIX
)


class BoardSyncService:

    _board_sync_repo = BoardSyncRepository

    def __init__(self, response: Response, sync_token: Optional[str]):
        _payload = get_token_payload(sync_token) if sync_token is not None else None
        self._is_new = not _payload
        self._input_payload = _payload or create_payload_token(utils.generate_id(), [])
        self._response = response

    @classmethod
    async def _get_update_payload_board(cls, update, is_new):
        step_id = update.board_step_id
        board = None
        step_record = None
        if step_id:
            step_id = str(step_id)
            step_record = await cls._board_sync_repo.get_step_by_id(step_id)
            if step_record is not None:
                board_id = str(step_record["board_id"])
                if is_new:
                    step_record = await cls._board_sync_repo.get_step_by_index(board_id, 0)
                    if step_record:
                        step_id = str(step_record["id"])
                        board = {
                            "id": board_id,
                            "sync_step": step_id,
                            "rating": None,
                            "finalized": False
                        }
                else:
                    board = {
                        "id": board_id,
                        "sync_step": step_id,
                        "rating": update.rating,
                        "finalized": update.finalized
                    }
        else:
            # need to be able to get a token knowing only the board_id, without a specific step
            board_id = update.board_id
            if board_id:
                board_id = str(board_id)
                step_record = await cls._board_sync_repo.get_step_by_index(board_id, 0)
                if step_record:
                    step_id = str(step_record["id"])
                    board = {
                        "id": board_id,
                        "sync_step": step_id,
                        "rating": None,
                        "finalized": False
                    }

        return board, step_record

    @classmethod
    def _get_output_by_payload_board(cls, board):
        if board:
            return protocol.BoardSync(
                board_id=board["id"],
                board_step_id=board["sync_step"],
                rating=board["rating"],
                finalized=board["finalized"] if board["finalized"] is not None else False
            )

        return None

    def _update_payload_by_board(self, board):
        payload = self._input_payload
        if board:
            payload = update_payload_token(self._input_payload, board)

        return payload

    def _sync(self, board):
        payload = self._update_payload_by_board(board)
        token = create_token_by_payload(payload)
        exp = BOARD_SYNC_TOKEN_EXPIRATION_DAYS * 86400  # 24 * 60 * 60
        self._response.set_cookie(
            key=BOARD_SYNC_TOKEN_COOKIE_NAME,
            value=token,
            max_age=exp,
            expires=exp,
            path=SERVER_PATH_PREFIX,
            domain=SERVER_DOMAIN_NAME,
            secure=BOARD_SYNC_TOKEN_COOKIE_SECURE,
            httponly=BOARD_SYNC_TOKEN_COOKIE_HTTPONLY,
            samesite=BOARD_SYNC_TOKEN_COOKIE_SAMESITE
        )
        if board is None:
            raise ApiException("Board not found.", ApiErrorCode.BOARD_NOT_FOUND, HTTPStatus.NOT_FOUND)

        output = self._get_output_by_payload_board(board)

        return output

    async def sync(self, update: Optional[protocol.BoardSyncRequest]):
        board, _ = await self._get_update_payload_board(update or protocol.BoardSyncRequest(), self._is_new)
        return self._sync(board)

    @classmethod
    def _schema_item_record_to_schema(cls, record, index, is_passed=False) -> protocol.BoardSyncSchemaItem:
        return protocol.BoardSyncSchemaItem(
            board_step_id=record["id"],
            type=utils.enum_from_int(protocol.BoardStepType, record["type"]),
            is_passed_board_step=is_passed,
            index=index,
        )

    async def schema(self, board_id) -> protocol.BoardSyncSchema:
        index = -1
        board_id = str(board_id)
        board = self._input_payload["boards"].get(board_id)

        if board:
            step_id = board["sync_step"]
            step = await self._board_sync_repo.get_step_by_id(step_id)
            if step:
                index = step["index"]

        schema_list = []
        schema_records_iterator = await self._board_sync_repo.get_list_board_steps(board_id)
        async for item in schema_records_iterator:
            i = item["index"]
            schema_list.append(self._schema_item_record_to_schema(item, i, index > i))

        if not schema_list:
            raise ApiException("Board not found.", ApiErrorCode.BOARD_NOT_FOUND, HTTPStatus.NOT_FOUND)

        return protocol.BoardSyncSchema(items=schema_list, next_cursor=None, has_more=False)

    @classmethod
    def _blob_record_to_schema(cls, record, link=None) -> protocol.BoardSyncDataBlob:
        return protocol.BoardSyncDataBlob(
            id=record["id"],
            type=utils.enum_from_int(protocol.BlobType, record["type"]),
            link=link,
        )

    @classmethod
    async def _get_blobs_schema(cls, is_include_link: bool, step_id) -> List[protocol.BoardSyncDataBlob]:
        blob_records_iterator = await cls._board_sync_repo.get_blobs(step_id)
        blob_list = []
        async for record in blob_records_iterator:
            link = None
            if is_include_link:
                blob_type = utils.enum_from_int(protocol.BlobType, record["type"])
                link = storage.presigned_get_object(step_id, record["id"], blob_type)
            blob_list.append(cls._blob_record_to_schema(record, link))

        return blob_list

    @classmethod
    async def _step_record_to_schema(cls, record, is_include_blobs, is_include_link) -> protocol.BoardSyncData:
        blobs_schema = None
        if is_include_blobs:
            blobs_schema = await cls._get_blobs_schema(is_include_link, record["id"])

        return protocol.BoardSyncData(
            id=record["id"],
            type=utils.enum_from_int(protocol.BoardStepType, record["type"]),
            title=record["title"],
            text=record["text"],
            index=record["index"],
            blobs=blobs_schema,
        )

    async def step_data(
            self,
            update: Optional[protocol.BoardSyncRequest],
            is_include_blobs: bool,
            is_include_link: bool,
    ) -> protocol.BoardSyncData:
        board, step_record = await self._get_update_payload_board(update or protocol.BoardSyncRequest(), self._is_new)
        self._sync(board)
        step = await self._step_record_to_schema(step_record, is_include_blobs, is_include_link)

        return step
