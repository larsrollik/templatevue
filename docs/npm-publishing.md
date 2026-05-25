# npm publishing

The `release.yml` workflow publishes to npm automatically when a `v*` tag is pushed. It exits cleanly (green) if no token is configured.

## Setup

### 1. Create an npm account

Register at [npmjs.com](https://www.npmjs.com). Enable 2FA.

### 2. Generate an access token

- Go to **npm → Profile → Access Tokens → Generate New Token**
- Type: **Automation** (bypasses 2FA for CI use)
- Copy the token — shown once only

### 3. Add the token to GitHub

- **Repository → Settings → Secrets and variables → Actions → New repository secret**
- Name: `NPM_TOKEN`
- Value: paste the npm token

### 4. Configure package.json

Before first publish, verify:

```json
{
  "name": "my-package",
  "version": "0.0.0",
  "files": ["dist"],
  "main": "./dist/my-package.umd.cjs",
  "module": "./dist/my-package.js",
  "exports": { ... }
}
```

Run `pnpm build` locally to confirm the `dist/` output is correct before releasing.

### 5. Trigger a release

```sh
pnpm release
git push --follow-tags
```

`release.yml` will run `pnpm publish --no-git-checks` using the token.

## Scoped packages

To publish under an npm scope (e.g. `@myorg/my-package`):

1. Set `"name": "@myorg/my-package"` in `package.json`
2. For public scoped packages, add `--access public` to the publish command in `release.yml`

## Manual publish

```sh
pnpm build
NPM_TOKEN=<token> pnpm publish --no-git-checks
```

## Dry run

```sh
pnpm publish --dry-run
```

## Provenance (recommended)

npm supports [package provenance](https://docs.npmjs.com/generating-provenance-statements) via OIDC — links published packages to the GitHub Actions run that built them. To enable, add to `release.yml`:

```yaml
permissions:
  contents: write
  id-token: write   # required for provenance

- name: Publish to npm
  run: pnpm publish --no-git-checks --provenance
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

And in `package.json`:

```json
"publishConfig": {
  "provenance": true
}
```
