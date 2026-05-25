# [[ project_name ]]

[[ project_description ]]

## Development

```sh
git clone https://github.com/[[ github_username ]]/[[ github_repo ]].git
cd [[ github_repo ]]
pnpm install
cp .env.example .env
pnpm dev        # http://localhost:5173
```

## Config

| Tier | Mechanism | Use for |
|---|---|---|
| Build-time | `VITE_*` in `.env` | Public config — API URLs, feature flags |
| Runtime | JSON mounted at `SECRET_CONFIG_PATH` | Secrets — tokens, credentials |

Edit `public/config.json` for local dev defaults. Add keys to `RuntimeConfig` in `src/config.ts`.

## Docker

```sh
docker build -t [[ project_slug ]] .
docker-compose up
```

The container reads the file at `SECRET_CONFIG_PATH` at startup and serves it as `/config.json`.

## Release

```sh
pnpm release             # bump version, create tag
git push --follow-tags   # triggers release.yml → builds image, pushes to GHCR
```

## License

See [LICENSE](LICENSE).
