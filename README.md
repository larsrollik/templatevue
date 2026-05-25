# templatevue

Copier template for Vue 3 + TypeScript apps deployed with Docker.

**[→ Full documentation](https://YOUR_ORG.github.io/templatevue)**

## Stack

| Tool | Role |
|---|---|
| pnpm | package manager |
| vite | build tool and dev server |
| vue-tsc | TypeScript type checking for Vue SFCs |
| ESLint flat config | linting |
| Prettier | formatting (SFCs, TS, JSON, Markdown) |
| vitest | testing |
| husky + lint-staged | local pre-commit hooks (auto-fix + commitlint) |
| release-it | conventional-commit-driven version bumping and tagging |
| nginx | static file serving in production |
| Docker + Compose | containerised deployment |
| VitePress | documentation |

## Quickstart

```sh
uv tool install copier          # or: pip install copier
copier copy gh:larsrollik/templatevue my-new-project
cd my-new-project
git init && git add -A && git commit -m "chore: initial commit from templatevue"
pnpm install                    # also runs husky prepare
cp .env.example .env
pnpm dev                        # http://localhost:5173
```

## Update existing project

```sh
cd my-existing-project && copier update
```

## Release flow

```
feature branch  →  git commit  →  pnpm release  →  git push --follow-tags
              (commitlint)    (release-it bump + tag)
                                         ↓
                              PR to main  →  lint + tests  →  merge
                                         ↓
                              tag triggers release.yml
                              → build Docker image
                              → push to GHCR (ghcr.io/<org>/<repo>)
                              → squash main → prod
                              → GitHub release
```

## Config: build-time vs runtime

| Tier | Mechanism | Use for |
|---|---|---|
| Build-time | `VITE_*` vars in `.env` | Public config — API URLs, feature flags |
| Runtime | Mounted JSON at `SECRET_CONFIG_PATH` | Secrets — tokens, credentials |

At container startup, `docker/40-runtime-config.sh` copies the mounted secrets file to `/config.json` before nginx starts. The app fetches `/config.json` before mounting. See [Docker deployment](https://YOUR_ORG.github.io/templatevue/docker-deployment/) for details.

## Required secrets

| Secret | Purpose |
|---|---|
| _(none required)_ | GHCR push uses `GITHUB_TOKEN` (automatic) |
