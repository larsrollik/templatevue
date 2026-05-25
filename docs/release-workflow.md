# Release workflow

## Branch topology

```
prod  ←── squash merge on each release (automated by release.yml)
main  ←── PR merges from feature/bug/hotfix branches
feature/*, bug/*, hotfix/*  ←── created from main
```

## Step-by-step

```sh
# 1. Create a branch
git checkout main && git pull
git checkout -b feature/my-feature

# 2. Commit — message format enforced by commitlint hook
git commit -m "feat: add dashboard view"

# 3. Bump version locally
pnpm release        # release-it reads commits, determines bump, creates tag
                    # runs interactively — use --ci to skip prompts

# 4. Push branch + tag
git push --follow-tags

# 5. Open PR to main
gh pr create --base main --title "feat: add dashboard view"

# 6. CI runs lint + typecheck on push; tests on PR
# 7. Merge PR
gh pr merge --squash --delete-branch

# 8. Tag push triggers release.yml:
#    - builds Docker image
#    - pushes to GHCR (ghcr.io/<org>/<repo>:<version> and :latest)
#    - squash-merges main → prod
#    - generates release notes from git log
#    - creates GitHub release
```

## How release-it determines the version increment

`release-it` with `@release-it/conventional-changelog` reads commits since the last tag:

| Commits contain | Bump |
|---|---|
| only `fix:`, `docs:`, `chore:`, `refactor:`, `test:` | **patch** `0.0.x` |
| at least one `feat:` | **minor** `0.x.0` |
| `BREAKING CHANGE:` footer or `feat!:`/`fix!:` | **major** `x.0.0` |

Override manually:

```sh
pnpm release --increment patch
pnpm release --increment minor
pnpm release --increment major
pnpm release --ci
```

## Image tags produced

Each release pushes three tags to GHCR:

| Tag | Example | Use |
|---|---|---|
| Full semver | `v1.2.3` | Pin to exact release |
| Major.minor | `1.2` | Rolling minor updates |
| `latest` | `latest` | Always current |

## Conventional Commits format

`commitlint` (via the `commit-msg` husky hook) rejects non-conforming messages:

```
<type>[optional scope]: <short description>

[optional body]

[optional footer: BREAKING CHANGE: ...]
```

Common types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `build`, `style`.

## Pre-commit auto-fix

The `pre-commit` hook runs `lint-staged`:

1. `eslint --fix` on staged `.ts` and `.vue` files
2. `prettier --write` on all staged files
3. Re-stages auto-fixed files

## Common issues

**`pnpm release` fails with git error**

- Detached HEAD → `git checkout main` first
- Uncommitted changes → commit or stash
- Tag already exists → `git tag -d v1.2.3` to remove locally, `git push origin :refs/tags/v1.2.3` to remove remotely

**commitlint rejects message**

Common mistakes: missing space after colon (`feat:message`), uppercase type (`Feat:`), period at end of subject.
