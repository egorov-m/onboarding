from enum import Enum
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
