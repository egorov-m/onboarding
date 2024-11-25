ARG BASE_IMAGE

FROM ${BASE_IMAGE} AS python-base

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

FROM python-base AS poetry-base

RUN apt-get update \
    && apt-get install --no-install-recommends -y  \
    curl \
    build-essential

RUN curl -sSL https://install.python-poetry.org | python -

FROM poetry-base AS builder-base

WORKDIR $PYSETUP_PATH
COPY ./board-api/pyproject.toml ./board-api/poetry.lock ./
COPY ./onboarding-shared ../onboarding-shared

RUN poetry install --without dev

FROM builder-base AS builder-prod

WORKDIR /opt/onboarding/board-api
COPY ./board-api ./
RUN pip install --no-deps ./

FROM python-base AS development

ENV FASTAPI_ENV=development
WORKDIR $PYSETUP_PATH

COPY ./board-api ./
COPY ./onboarding-shared ../onboarding-shared
COPY --from=builder-base $POETRY_HOME $POETRY_HOME
COPY --from=builder-base $PYSETUP_PATH $PYSETUP_PATH

RUN poetry install

EXPOSE 80

ENTRYPOINT ["sh", "-c", "poetry run uvicorn \
                         --reload \
                         --host 0.0.0.0 \
                         --port 80 \
                         --log-level debug \
                         board_api.main:router"]

FROM python-base AS production

LABEL maintainer="mikhailegorov_dev@outlook.com"
LABEL org.opencontainers.image.title="Board API"
LABEL org.opencontainers.image.description="Board API service"
LABEL org.opencontainers.image.url="https://github.com/egorov-m/onboarding"
LABEL org.opencontainers.image.source="https://github.com/egorov-m/onboarding"
LABEL org.opencontainers.image.documentation="https://github.com/egorov-m/onboarding"
LABEL org.opencontainers.image.vendor=""
LABEL org.opencontainers.image.authors="mikhailegorov_dev@outlook.com"

ARG UID=1500
ARG GID=1500
ENV FASTAPI_ENV=production

RUN groupadd -g "${GID}" python  \
    && useradd --create-home --no-log-init -u "${UID}" -g "${GID}" board-api

USER board-api
WORKDIR /usr/onboarding/board-api

COPY --from=builder-prod $PYSETUP_PATH $PYSETUP_PATH
COPY ./board-api/bin/run.py ./bin/run.py
COPY ./board-api/docker/docker-entrypoint.sh ./docker/docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["sh", "/usr/onboarding/board-api/docker/docker-entrypoint.sh"]

ARG SOURCE_COMMIT
ENV ONBOARDING_API_BUILD=${SOURCE_COMMIT:-unknown}
LABEL org.opencontainers.image.revision=$SOURCE_COMMIT
LABEL org.opencontainers.image.source="https://github.com/egorov-m/onboarding/tree/${SOURCE_COMMIT:-main}/"
LABEL org.opencontainers.image.licenses="https://github.com/egorov-m/onboarding/blob/${SOURCE_COMMIT:-main}/LICENSE"
