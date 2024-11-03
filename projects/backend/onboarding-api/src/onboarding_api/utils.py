from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import uuid4

from onboarding_shared.schemas import protocol


def generate_id() -> str:
    return str(uuid4())


def enum_from_int(enum_cls: Enum, value: int) -> Enum:
    value_map = {index: member for index, member in enumerate(enum_cls)}

    try:
        return value_map[value]
    except KeyError:
        raise ValueError(f"Invalid value for {enum_cls.__name__}: {value}")


def int_from_enum(value: Enum) -> int:
    for index, member in enumerate(value.__class__):
        if member == value:
            return index
    raise ValueError(f"{value} is not a valid member of {value.__class__.__name__}")


def canonical_s3_bucket_name(name: str, prefix: Optional[str] = None) -> str:
    if prefix:
        return f"{prefix}.{name}"

    return name


def canonical_object_name(
        step_id: str,
        blob_id: str,
        type: Optional[protocol.BlobType] = None,
) -> str:
    # TODO: needs refactoring
    ext = ".bin"
    if type == protocol.BlobType.image:
        ext = ".png"

    return f"{step_id}/{blob_id}{ext}"


def canonical_s3_link(
        bucket_name: str,
        step_id: str,
        blob_id: str,
        type: Optional[protocol.BlobType] = None,
) -> str:

    return f"{bucket_name}/{canonical_object_name(step_id, blob_id, type)}"


def get_bucket_name(type, s3_buckets) -> str:
    if type == protocol.BlobType.image:
        return s3_buckets.board_images

    raise NotImplementedError("The blob type doesn't have an assigned bucket.")


def get_current_datetime() -> datetime:
    return datetime.utcnow()
