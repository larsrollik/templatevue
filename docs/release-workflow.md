# Release workflow

Releases are automated in CI on merge to `main` — there is **no `prod` branch** and no
manual release step. `versioning.yml` bumps + tags; `release.yml` builds the image and
cuts the GitHub release.

## Branch topology

```
main  ←── PR merges from feature/bug/hotfix branches
feature/*, bug/*, hotfix/*  ←── created from main
```

## Step-by-step

```sh
# 1. Create a branch
git checkout main && git pull
git checkout -b feature/my-feature

# 2. Commit — message format enforced by the commitlint hook
git commit -m "feat: add dashboard view"

# 3. Push + open PR to main
git push -u origin HEAD
gh pr create --base main --title "feat: add dashboard view"

# 4. CI runs lint + typecheck on push; tests on PR — merge is blocked until green
# 5. Merge PR
gh pr merge --squash --delete-branch

# 6. versioning.yml fires on push to main:
#    - release-it reads commits since the last tag, determines the increment,
#      commits "chore: release vX.Y.Z", tags it, and pushes
#    - dispatches release.yml

# 7. release.yml (on the tag / dispatch):
#    - builds + pushes the Docker image to GHCR (only if enable_docker_publishing)
#      (ghcr.io/<org>/<repo>:<version>, :<major.minor>, :latest)
#    - creates a GitHub release with auto-generated notes
```

## How the version increment is determined

`release-it` with `@release-it/conventional-changelog` reads commits since the last tag:

| Commits contain | Bump |
|---|---|
| only `fix:`, `docs:`, `chore:`, `refactor:`, `test:` | **patch** `0.0.x` |
| at least one `feat:` | **minor** `0.x.0` |
| `BREAKING CHANGE:` footer or `feat!:`/`fix!:` | **major** `x.0.0` |

If there are no bumpable commits since the last tag, `versioning.yml` makes no change
and nothing is released. To cut a release manually (or override the increment), run
locally and push the tag — a hand-pushed tag triggers `release.yml` directly:

```sh
pnpm release --ci                     # bump from commits, tag, push
pnpm release --ci --increment minor   # force a specific increment
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

**`versioning.yml` didn't release after a merge**

- No bumpable commits since the last tag → nothing to release (expected).
- Can't push to a protected `main` → install the release-bot App so the bump is
  pushed by a ruleset bypass actor (see [Branch protection](branch-protection.md)
  and the generated `docs/repository-setup.md`).

**commitlint rejects a message**

Common mistakes: missing space after the colon (`feat:message`), uppercase type
(`Feat:`), trailing period on the subject.
