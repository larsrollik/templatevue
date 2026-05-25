# Docker deployment

The app is served as a static SPA behind nginx in a multi-stage Docker image. Traefik handles TLS termination and routing in front.

## Image build

```sh
docker build -t myapp .
```

The Dockerfile has two stages:

| Stage | Base | What it does |
|---|---|---|
| `build` | `node:[[ node_requires ]]-alpine` | Installs deps, runs `pnpm build`, produces `dist/` |
| `serve` | `nginx:alpine` | Copies `dist/` and nginx config; runs the runtime config hook |

## Runtime config injection

At container startup, `/docker-entrypoint.d/40-runtime-config.sh` runs before nginx. If a secrets file is present at `SECRET_CONFIG_PATH`, it is copied to `/usr/share/nginx/html/config.json`, replacing the baked-in default.

The `SECRET_CONFIG_PATH` environment variable defaults to the value set during template generation. Override it in `docker-compose.yml` or pass it at `docker run` time.

```sh
# Mount a secrets file and start
docker run \
  -e SECRET_CONFIG_PATH=/run/secrets/myapp-config.json \
  -v /path/to/myapp-config.json:/run/secrets/myapp-config.json:ro \
  -p 80:80 \
  myapp
```

### Changing the injection logic

To replace the injection script without rebuilding the image, override it in `docker-compose.yml`:

```yaml
volumes:
  - ./my-inject.sh:/docker-entrypoint.d/40-runtime-config.sh:ro
```

Your script runs in place of the default one; call `/docker-entrypoint.sh` at the end if you want to chain into nginx's own init sequence.

## Config tiers

| Tier | Mechanism | Use for |
|---|---|---|
| Build-time | `VITE_*` in `.env` / CI env vars | Public config: API base URL, feature flags |
| Runtime | Mounted `config.json` via `SECRET_CONFIG_PATH` | Secrets: tokens, credentials, environment-specific endpoints |

The Vue app loads runtime config before mounting:

```ts
// src/config.ts
export function getConfig(): RuntimeConfig { ... }
```

Add your own keys to `RuntimeConfig` in `src/config.ts` and populate them in `public/config.json` (dev defaults) and your production secrets file.

## Traefik

`docker-compose.yml` attaches the container to an external `traefik` network and sets the routing labels. Assumes Traefik is already running in a separate stack with a `websecure` entrypoint and a configured cert resolver.

Required labels (pre-filled from copier answers):

```yaml
traefik.enable: "true"
traefik.http.routers.<slug>.rule: "Host(`<traefik_host>`)"
traefik.http.routers.<slug>.entrypoints: websecure
traefik.http.routers.<slug>.tls: "true"
traefik.http.services.<slug>.loadbalancer.server.port: "80"
```

## Local dev without Docker

```sh
cp .env.example .env      # edit VITE_* values as needed
pnpm dev                  # serves at http://localhost:5173
                          # public/config.json is served at /config.json
```
