ARG BUILDER_BASE_IMAGE
ARG SERVER_BASE_IMAGE

FROM ${BUILDER_BASE_IMAGE} AS builder-base

COPY ./packages/onboarding /tmp/packages/onboarding
COPY ./packages/shared /tmp/packages/shared
COPY ./lerna.json /tmp/lerna.json
COPY ./package.json /tmp/package.json
COPY ./package-lock.json /tmp/package-lock.json
COPY ./tsconfig.json /tmp/tsconfig.json

WORKDIR /tmp/

FROM builder-base AS builder-prod

ARG ONBOARDING_WEB_APP_PATH_PREFIX

RUN npm install

WORKDIR /tmp/packages/onboarding

RUN npm run build:prod

FROM builder-base AS development

ENV ONBOARDING_WEB_APP_PATH_PREFIX="/app/onboarding"

RUN npm install

ENTRYPOINT ["npm", "run"]
CMD ["start-onboarding"]

FROM ${SERVER_BASE_IMAGE} AS production

LABEL maintainer="egor.rumyancev.9494@mail.ru"
LABEL org.opencontainers.image.title="Onboarding Web APP"
LABEL org.opencontainers.image.description="Statics service react web application"
LABEL org.opencontainers.image.url="https://github.com/egorov-m/onboarding"
LABEL org.opencontainers.image.source="https://github.com/egorov-m/onboarding"
LABEL org.opencontainers.image.documentation="https://github.com/egorov-m/onboarding"
LABEL org.opencontainers.image.vendor=""
LABEL org.opencontainers.image.authors="egor.rumyancev.9494@mail.ru"

COPY ./packages/onboarding/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder-prod /tmp/packages/onboarding/build /usr/share/nginx/html/

ARG SOURCE_COMMIT
ENV ONBOARDING_API_BUILD=${SOURCE_COMMIT:-unknown}
LABEL org.opencontainers.image.revision=$SOURCE_COMMIT
LABEL org.opencontainers.image.source="https://github.com/egorov-m/onboarding/tree/${SOURCE_COMMIT:-main}/"
LABEL org.opencontainers.image.licenses="https://github.com/egorov-m/onboarding/blob/${SOURCE_COMMIT:-main}/LICENSE"
