from typing import List, Literal, Optional, Union, Any
from datetime import datetime
from uuid import UUID
from enum import Enum

from pydantic import (
    BaseModel,
    conint,
    HttpUrl,
    constr,
    Extra,
)

from ..exceptions import ApiErrorCode


INDEX_BOARD_STEPS_LIMIT = 99


class BaseSchema(BaseModel):
    ...


class ErrorResponse(BaseSchema):
    errors: List[ApiErrorCode]


class SortObject(BaseSchema):
    order: Literal["asc", "desc"] = "asc"
    sort_keys: List


class FilterType(str, Enum):
    search = "search"
    check_box = "check_box"
    range = "range"


class CheckBoxFilter(BaseSchema):
    key: str
    values: List


class RangeFilter(BaseSchema):
    start: Any
    end: Any


class FilterObject(BaseSchema):
    type: FilterType
    filter: Union[str, CheckBoxFilter, RangeFilter]


class BaseListRequest(BaseSchema):
    start_cursor: Optional[UUID] = None
    page_size: conint(ge=5, le=100) = 100


class ListRequest(BaseListRequest):
    sort: Optional[SortObject] = None
    filters: Optional[FilterObject] = None


class _ListResponse(BaseSchema):
    items: List
    next_cursor: Optional[UUID]
    has_more: bool


class BoardStatus(str, Enum):
    published = "published"
    unpublished = "unpublished"


class BoardInfo(BaseSchema):
    id: UUID
    name: str
    created_at: datetime
    updated_at: datetime
    average_rating: float
    status: BoardStatus


class CreateBoardRequest(BaseSchema):
    name: constr(min_length=0, max_length=256)


class UpdateBoardInfoRequest(BaseSchema):
    name: Optional[constr(min_length=0, max_length=256)] = None
    status: Optional[BoardStatus] = None


class BoardInfoListResponse(_ListResponse):
    items: List[BoardInfo]


class BoardStepType(str, Enum):
    basic = "basic"
    rating = "rating"


class BlobType(str, Enum):
    image = "image"


class Blob(BaseSchema):
    id: UUID
    type: BlobType
    link: Optional[HttpUrl] = None
    created_at: datetime
    updated_at: datetime


class BlobListResponse(_ListResponse):
    items: List[Blob]


class ActionBlobType(str, Enum):
    attach = "attach"
    update = "update"


class ActionBlobToStepResponse(BaseSchema):
    blob_id: UUID
    blob_type: BlobType
    action_link: HttpUrl
    action_type: ActionBlobType


class BoardStep(BaseSchema):
    id: UUID
    type: BoardStepType
    title: str
    text: str
    index: int
    blobs: Optional[List[Blob]]
    created_at: datetime
    updated_at: datetime


class CreateBoardStepRequest(BaseSchema):
    board_id: UUID
    type: BoardStepType
    title: constr(min_length=0, max_length=256)
    text: Optional[constr(min_length=0, max_length=4096)] = None
    index: conint(ge=0, le=INDEX_BOARD_STEPS_LIMIT)


class UpdateBoardStepRequest(BaseSchema):
    title: Optional[constr(min_length=0, max_length=256)] = None
    text: Optional[constr(min_length=0, max_length=4096)] = None


class BoardStepListResponse(_ListResponse):
    items: List[BoardStep]


class BoardSync(BaseSchema):
    board_id: UUID
    board_step_id: UUID
    rating: Optional[int] = None
    finalized: bool = False


class BoardSyncSchemaItem(BaseSchema):
    board_step_id: UUID
    type: BoardStepType
    is_passed_board_step: bool
    index: int


class BoardSyncSchema(_ListResponse):
    items: List[BoardSyncSchemaItem]


class BoardSyncRequest(BaseSchema, extra=Extra.ignore):
    board_id: Optional[UUID] = None
    board_step_id: Optional[UUID] = None
    rating: Optional[conint(ge=0, le=5)] = None
    finalized: Optional[bool] = None


class BoardSyncDataBlob(BaseSchema):
    id: UUID
    type: BlobType
    link: Optional[HttpUrl] = None


class BoardSyncData(BaseSchema):
    id: UUID
    type: BoardStepType
    title: str
    text: str
    index: int
    blobs: Optional[List[BoardSyncDataBlob]]
