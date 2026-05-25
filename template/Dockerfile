# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:[[ node_requires ]]-alpine AS build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ── Serve stage ───────────────────────────────────────────────────────────────
FROM nginx:alpine AS serve

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Runtime config injection hook — runs before nginx starts.
# Override in docker-compose by mounting a different script at this path.
COPY docker/40-runtime-config.sh /docker-entrypoint.d/40-runtime-config.sh
RUN chmod +x /docker-entrypoint.d/40-runtime-config.sh

COPY --from=build /app/dist /usr/share/nginx/html

# Default runtime config (public/config.json) — overwritten by entrypoint
# if a secrets file is mounted at SECRET_CONFIG_PATH.
COPY --from=build /app/dist/config.json /usr/share/nginx/html/config.json

EXPOSE 80
