from datetime import timedelta

from minio.deleteobjects import DeleteObject

from onboarding_shared.schemas import protocol
from onboarding_shared import utils

from .s3_client import s3_client
from ..config import (
    S3_BUCKETS,
    S3_PRESIGNED_PUT_OBJECT_EXPIRES_MINUTES,
    S3_PRESIGNED_GET_OBJECT_EXPIRES_MINUTES,
)


def presigned_put_object(step_id: str, blob_id: str, blob_type: protocol.BlobType) -> str:
    return s3_client.presigned_put_object(
        bucket_name=utils.get_bucket_name(blob_type, S3_BUCKETS),
        object_name=utils.canonical_object_name(step_id, blob_id, blob_type),
        expires=timedelta(minutes=S3_PRESIGNED_PUT_OBJECT_EXPIRES_MINUTES)
    )


def presigned_get_object(step_id: str, blob_id: str, blob_type: protocol.BlobType) -> str:
    return s3_client.presigned_get_object(
        bucket_name=utils.get_bucket_name(blob_type, S3_BUCKETS),
        object_name=utils.canonical_object_name(step_id, blob_id, blob_type),
        expires=timedelta(minutes=S3_PRESIGNED_GET_OBJECT_EXPIRES_MINUTES)
    )


def remove_object(step_id: str, blob_id: str, blob_type: protocol.BlobType):
    return s3_client.remove_object(
        bucket_name=utils.get_bucket_name(blob_type, S3_BUCKETS),
        object_name=utils.canonical_object_name(step_id, blob_id, blob_type),
    )


def remove_objects_by_prefix(step_id: str, blob_type: protocol.BlobType):
    bucket_name = utils.get_bucket_name(blob_type, S3_BUCKETS)

    iterator = s3_client.remove_objects(
        bucket_name=bucket_name,
        delete_object_list=list(
            map(
                lambda x: DeleteObject(x.object_name),
                s3_client.list_objects(
                    bucket_name,
                    f"{step_id}/",
                    recursive=True,
                ),
            )
        ),
    )
    for item in iterator:
        ...


__all__ = (s3_client, presigned_put_object, presigned_get_object, remove_object, remove_objects_by_prefix,)
