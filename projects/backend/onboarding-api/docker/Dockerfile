ARG BASE_IMAGE

FROM ${BASE_IMAGE} as python-base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_VERSION=1.8.3 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    POETRY_NO_INTERACTION=1 \
    PYSETUP_PATH="/opt/pysetup" \
    VENV_PATH="/opt/pysetup/.venv"

ENV PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$PATH"

FROM python-base as poetry-base

RUN apt-get update \
    && apt-get install --no-install-recommends -y  \
    curl \
    build-essential

RUN curl -sSL https://install.python-poetry.org | python -


FROM poetry-base as builder-base

WORKDIR $PYSETUP_PATH
COPY ./onboarding-api/pyproject.toml ./onboarding-api/poetry.lock ./
COPY ./onboarding-shared ../onboarding-shared

RUN poetry install --without dev

FROM builder-base as builder-prod

WORKDIR /opt/onboarding/onboarding-api
COPY ./onboarding-api ./
RUN pip install --no-deps ./

FROM python-base as development

ENV FASTAPI_ENV=development
WORKDIR $PYSETUP_PATH

COPY ./onboarding-api ./
COPY ./onboarding-shared ../onboarding-shared
COPY --from=builder-base $POETRY_HOME $POETRY_HOME
COPY --from=builder-base $PYSETUP_PATH $PYSETUP_PATH

RUN poetry install

EXPOSE 80

ENTRYPOINT ["sh", "-c", "poetry run alembic \
                         -c /opt/pysetup/alembic.ini upgrade head &&\
                         poetry run uvicorn \
                         --reload \
                         --host 0.0.0.0 \
                         --port 80 \
                         --log-level debug \
                         onboarding_api.main:router"]

FROM python-base as production

LABEL maintainer="mikhailegorov_dev@outlook.com"
LABEL org.opencontainers.image.title="Onboarding API"
LABEL org.opencontainers.image.description="Onboarding API service"
LABEL org.opencontainers.image.url="https://github.com/egorov-m/onboarding"
LABEL org.opencontainers.image.source="https://github.com/egorov-m/onboarding"
LABEL org.opencontainers.image.documentation="https://github.com/egorov-m/onboarding"
LABEL org.opencontainers.image.vendor=""
LABEL org.opencontainers.image.authors="mikhailegorov_dev@outlook.com"

ARG UID=1500
ARG GID=1500
ENV FASTAPI_ENV=production

RUN groupadd -g "${GID}" python  \
    && useradd --create-home --no-log-init -u "${UID}" -g "${GID}" onboarding-api

USER onboarding-api
WORKDIR /usr/onboarding/onboarding-api

COPY --from=builder-prod $PYSETUP_PATH $PYSETUP_PATH
COPY ./onboarding-api/bin/run.py ./bin/run.py
COPY ./onboarding-api/alembic ./alembic
COPY ./onboarding-api/alembic.ini ./alembic.ini
COPY ./onboarding-api/docker/docker-entrypoint.sh ./docker/docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["sh", "/usr/onboarding/onboarding-api/docker/docker-entrypoint.sh"]

ARG SOURCE_COMMIT
ENV ONBOARDING_API_BUILD=${SOURCE_COMMIT:-unknown}
LABEL org.opencontainers.image.revision=$SOURCE_COMMIT
LABEL org.opencontainers.image.source="https://github.com/egorov-m/onboarding/tree/${SOURCE_COMMIT:-main}/"
LABEL org.opencontainers.image.licenses="https://github.com/egorov-m/onboarding/blob/${SOURCE_COMMIT:-main}/LICENSE"
