#!/bin/sh

set -e

cat << EOF > /etc/dex/config.yml

issuer: ${DEX_ISSUER}

storage:
  type: postgres
  config:
    host: ${DEX_DB_HOST}
    port: ${DEX_DB_PORT}
    database: ${DEX_DB_NAME}
    user: ${DEX_DB_USER}
    password: ${DEX_DB_PASSWORD}
    ssl:
      mode: disable

web:
  http: 0.0.0.0:${DEX_PORT}

# Dex UI configuration
frontend:
  issuer: ${DEX_PROVIDER_DISPLAY_NAME}
  theme: light

expiry:
  deviceRequests: "5m"
  signingKeys: "6h"
  idTokens: "24h"
  refreshTokens:
  disableRotation: false
  reuseInterval: "3s"
  validIfNotUsedFor: "2160h"  # 90 days
  absoluteLifetime: "3960h"  # 165 days

# OAuth2 configuration
oauth2:
  responseTypes: [ "code" ]  # "code", "token", "id_token"
  skipApprovalScreen: true
  alwaysShowLoginScreen: false

staticClients:
  - id: ${DEX_CLIENT_ID}
    redirectURIs:
      - ${DEX_CLIENT_REDIRECT_URI}
    name: ${DEX_CLIENT_NAME}
    secret: ${DEX_CLIENT_SECRET}

connectors:
- type: github
  id: github
  name: GitHub
  config:
    clientID: ${GITHUB_CLIENT_ID}
    clientSecret: ${GITHUB_CLIENT_SECRET}
    redirectURI: ${DEX_ISSUER}/callback
    teamNameField: slug
    useLoginAsID: false

- type: google
  id: google
  name: Google
  config:
    clientID: ${GOOGLE_CLIENT_ID}
    clientSecret: ${GOOGLE_CLIENT_SECRET}
    redirectURI: ${DEX_ISSUER}/callback
EOF

dex serve /etc/dex/config.yml
