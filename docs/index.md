# templatevue

Copier template for Vue 3 + TypeScript apps deployed with Docker.

## Stack

| Tool | Role |
|---|---|
| **pnpm** | Fast, disk-efficient package manager |
| **vite** | Build tool and dev server |
| **vue-tsc** | Type checking for Vue SFCs (`.vue` files) |
| **ESLint flat config** | Linting (`@eslint/js`, `typescript-eslint`, `eslint-plugin-vue`) |
| **Prettier** | Formatting (TS, Vue, JSON, Markdown, YAML) |
| **vitest** | Unit testing |
| **husky + lint-staged** | Git hooks: auto-fix staged files, validate commit message |
| **commitlint** | Enforces Conventional Commits message format |
| **release-it** | Local version bump + tag from commit history |
| **nginx** | Static file serving in production |
| **Docker + Compose** | Containerised deployment |
| **VitePress** | Project documentation |

## Requirements

- Node.js — generated projects default to **24** (`node_requires`: choices 20 / 22 / 24)
- pnpm ≥ 9 (`npm install -g pnpm`)
- [copier](https://copier.readthedocs.io/) ≥ 9.0 (`uv tool install copier`)
- Docker (for container builds)

## Create a new project

```sh
copier copy gh:larsrollik/templatevue my-new-project
cd my-new-project
git init && git add -A && git commit -m "chore: initial commit from templatevue"
pnpm install    # installs deps and sets up husky hooks via prepare script
cp .env.example .env
pnpm dev        # http://localhost:5173
```

## Template questions

| Question | Choices / default | Notes |
|---|---|---|
| `project_name` | free text | Display name |
| `project_slug` | free text | Package/directory name (kebab-case) |
| `project_pascal` | free text | PascalCase name |
| `project_description` | free text | One line |
| `author_name` | free text | |
| `author_email` | free text | |
| `github_username` | free text | GitHub org or account |
| `github_repo` | free text | Repository name |
| `node_requires` | `20` / `22` / `24`, default `24` | Node.js version the generated project targets |
| `traefik_host` | free text | Traefik router host for deployment |
| `secret_config_path` | path | Runtime `config.json` secret mount path |
| `year` | free text | Copyright year |
| `license_type` | `noncommercial` (default) / `bsd3` | Licence for the generated project |

## Apply template updates to an existing project

```sh
cd my-existing-project
copier update
```

## Day-to-day commands

```sh
pnpm dev            # vite dev server (serves public/config.json at /config.json)
pnpm build          # typecheck + vite build → dist/
pnpm test           # vitest in watch mode
pnpm test:run       # single run with coverage
pnpm lint           # eslint --fix
pnpm format         # prettier --write .
pnpm typecheck      # vue-tsc --build --force
pnpm docs:dev       # vitepress dev server
pnpm release        # release-it: bump version, create tag
git push --follow-tags  # push commits + tag → triggers release workflow
```

## Generated project structure

```
my-project/
├── src/
│   ├── main.ts          # createApp + loadConfig before mount
│   ├── App.vue          # root component
│   └── config.ts        # runtime config loader (fetches /config.json)
├── tests/
│   └── App.test.ts
├── public/
│   └── config.json      # dev defaults — served at /config.json by vite dev server
├── docker/
│   ├── nginx.conf        # SPA fallback + cache headers
│   └── 40-runtime-config.sh  # copies mounted secrets to config.json at startup
├── docs/
│   ├── .vitepress/
│   │   └── config.ts
│   ├── index.md
│   └── guide.md
├── .github/workflows/
│   ├── ci.yml           # lint+typecheck on push; tests on PR
│   ├── release.yml      # on v* tag: build image, push GHCR, GitHub release
│   ├── docs.yml         # deploy VitePress to GitHub Pages
│   └── pr-review.yml    # optional LLM review (commented out)
├── index.html           # Vite app entry
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env.example
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── eslint.config.js
├── .prettierrc.json
├── commitlint.config.js
└── .release-it.json
```
