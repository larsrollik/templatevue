# Getting Started

## Local development

```sh
git clone https://github.com/[[ github_username ]]/[[ github_repo ]].git
cd [[ github_repo ]]
pnpm install
cp .env.example .env
pnpm dev        # http://localhost:5173
```

## Commands

```sh
pnpm dev          # vite dev server
pnpm build        # typecheck + vite build → dist/
pnpm test         # vitest watch mode
pnpm test:run     # single run with coverage
pnpm lint         # eslint --fix
pnpm format       # prettier --write .
pnpm typecheck    # vue-tsc --build --force
```

## Config tiers

| Tier | Mechanism | Use for |
|---|---|---|
| Build-time | `VITE_*` in `.env` | Public config — API base URL, feature flags |
| Runtime | JSON mounted at `SECRET_CONFIG_PATH` | Secrets — tokens, credentials |

`public/config.json` holds dev defaults and is served at `/config.json` by the dev server. Add your keys to `RuntimeConfig` in `src/config.ts`, then call `getConfig()` wherever you need them.

## Docker

```sh
docker build -t [[ project_slug ]] .
docker-compose up
```

Mount your secrets file at `SECRET_CONFIG_PATH` (default: `[[ secret_config_path ]]`). The entrypoint script copies it to `/config.json` before nginx starts.

To override the injection logic, mount a replacement script:

```yaml
volumes:
  - ./my-inject.sh:/docker-entrypoint.d/40-runtime-config.sh:ro
```
