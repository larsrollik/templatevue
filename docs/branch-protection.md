# Branch protection

Configure branch protection rules on GitHub to enforce the gitflow.

## Recommended rules for `main`

**Repository → Settings → Branches → Add rule**, branch name pattern: `main`

| Setting | Value | Reason |
|---|---|---|
| Require a pull request before merging | ✓ | No direct pushes to main |
| Required approvals | 1+ | At least one review |
| Dismiss stale reviews on new commits | ✓ | Re-review after force-push |
| Require status checks to pass | ✓ | Blocks merge on CI failure |
| Required status checks | `CI` | The aggregate job in `ci.yml` |
| Require branches to be up to date | ✓ | No stale merges |
| Restrict who can push | maintainers only | Prevents accidental direct pushes |

## Allow `versioning.yml` to push back to `main`

There is no `prod` branch. On merge, `versioning.yml` commits the version bump and
pushes the tag back to `main`. GitHub's default branch protection blocks this.

!!! note
    If you require pull requests on `main`, add a bypass rule for the
    `github-actions[bot]` actor (GitHub's branch protection UI supports this), or the
    bump push will fail with a 403.

## Required status check name

The aggregate job in `ci.yml` is named `CI`. This is what to enter in the required status checks field. It only passes when both `lint` and `test` succeed, and only runs when both have completed.

## Rulesets (modern alternative)

GitHub now offers **Rulesets** (Repository → Settings → Rules → Rulesets) as a more flexible replacement for classic branch protection. Rulesets support bypass lists, actor-based rules, and can be applied to tag patterns too (useful for protecting `v*` tags from deletion).
