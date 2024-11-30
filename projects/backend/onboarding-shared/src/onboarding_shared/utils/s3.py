from typing import Optional

from ..schemas import protocol


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
