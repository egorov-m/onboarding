from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import uuid4


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


def get_current_datetime() -> datetime:
    return datetime.utcnow()
