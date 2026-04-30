# syntax=docker/dockerfile:1.4
FROM --platform=$BUILDPLATFORM node:16.20.0-alpine3.17 AS development

RUN mkdir /project
WORKDIR /project

COPY . .

RUN npm config set registry https://registry.npmjs.org/ && npm install -g @vue/cli && rm -f package-lock.json && npm install --legacy-peer-deps --no-fund --no-audit
CMD ["npm", "run", "serve"]

FROM development as dev-envs
RUN <<EOF
apk update
apk add git
EOF

RUN <<EOF
addgroup -S docker
adduser -S --shell /bin/bash --ingroup docker vscode
EOF
# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /
CMD ["npm", "run", "serve"]
