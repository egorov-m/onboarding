from minio import Minio
from minio.error import S3Error

from ..config import (
    S3_URL,
    S3_ACCESS_KEY,
    S3_SECRET_KEY,
    S3_SECURE,
    S3_CERT_CHECK,
    S3_BUCKETS,
    S3_CLIENT_DISABLE_INITIALIZATION
)


class S3Client:
    _s3_client = None

    def __new__(cls):
        if not hasattr(cls, "_instance"):
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if not self._s3_client:
            self._s3_client = Minio(
                S3_URL,
                access_key=S3_ACCESS_KEY,
                secret_key=S3_SECRET_KEY,
                secure=S3_SECURE,
                cert_check=S3_CERT_CHECK,
            )

            for bucket_name in S3_BUCKETS:
                if not self._s3_client.bucket_exists(bucket_name):
                    try:
                        self._s3_client.make_bucket(bucket_name)
                    except S3Error as ex:
                        if ex.code != "BucketAlreadyOwnedByYou":
                            raise ex

    @property
    def client(self) -> Minio:
        if self._s3_client is None:
            raise RuntimeError("S3 client is not instantiated")
        return self._s3_client


if S3_CLIENT_DISABLE_INITIALIZATION:
    s3_client = None
else:
    s3_client = S3Client().client
