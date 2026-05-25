# Contributing

Contributions are welcome — bug fixes, features, and documentation improvements.

## Getting started

1. Fork the repository and create a branch from `main`
2. `pnpm install` — installs deps and sets up husky hooks
3. Make your changes with tests
4. Commit using the Conventional Commits format (enforced by commitlint hook)
5. Open a pull request targeting `main`

## Commit format

```
feat: add new component
fix: correct prop type
docs: update README
chore: update dependencies
```

Breaking changes: add `!` after the type or include a `BREAKING CHANGE:` footer.

## Scripts

```sh
pnpm lint        # eslint --fix
pnpm format      # prettier --write
pnpm typecheck   # vue-tsc --noEmit
pnpm test:run    # vitest run
```

## Questions

Open an issue or email [[ author_email ]].
