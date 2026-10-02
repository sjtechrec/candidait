# Pull request conventions

Candidait uses squash merging. The pull request title becomes the default commit subject on `main`, so titles follow a constrained form of Conventional Commits.

## Title

```text
<type>(<scope>): <imperative summary>
<type>(<scope>)!: <imperative summary>
```

Examples:

```text
feat(search): rank candidates by relevant experience
fix(auth): preserve the destination after sign-in
perf(search): reduce candidate result latency
docs(repo): establish repository standards
ci(actions): add the aggregate verification gate
feat(api)!: replace the candidate scoring response
```

Rules:

- Type and scope are lowercase.
- Scope is required by this project and must appear in `.github/pr-scopes.json`.
- A scope is one word or one hyphenated phrase. Use `various` only for an inseparable multi-area change.
- Put `!` immediately before the colon for a breaking change.
- Use a concise imperative summary without a trailing period.
- Keep the complete title at or below 100 characters.
- Do not place issue numbers, roadmap identifiers, labels, or policy opt-outs in the title.
- Product codenames, customer names, usernames, and ticket IDs are not scopes.

Imperative wording is a review expectation, not an automated language judgment.

## Types

| Type | Use | Intended release effect |
| --- | --- | --- |
| `feat` | New user- or operator-visible capability | Minor; Added |
| `fix` | Incorrect behavior | Patch; Fixed |
| `perf` | Measurably faster or cheaper correct behavior | Patch; Changed |
| `revert` | Reversal of an earlier merged change | Tool-dependent |
| `docs` | Documentation and decision records only | None by default |
| `refactor` | Internal restructuring without intended behavior change | None by default |
| `test` | Test-only changes | None by default |
| `build` | Build, packaging, or runtime assembly | None by default |
| `ci` | Continuous integration and repository enforcement | None by default |
| `chore` | Maintenance not covered by another type | None by default |

Release effects are policy targets until fixture tests prove the selected release tool implements them.

## Primary scope

The first rendered PR section must be a non-empty `## Primary Scope`. Its backticked scope must match the title. A `various` scope must list the affected areas and explain why the PR cannot be split.

## Breaking changes

Any accepted type may use `!`. The PR body must identify the affected contract, explain what breaks, provide migration steps, and provide a rollback.

## Type-specific evidence

- `perf` requires the measurement method and before-and-after results.
- `revert` requires a `Reverts:` reference to a commit or pull request.
- A roadmap-delivery label requires a linked roadmap issue.

## Related work

Use GitHub-native issue links in the body:

```text
Closes #123
Related to #456
Depends on #120
```

Custom roadmap identifiers, if introduced, belong in the body or a Project field rather than the title.

## Branches

```text
<type>/<short-kebab-description>
```

Examples include `docs/repository-standards`, `ci/aggregate-verification`, and `fix/sign-in-redirect-loop`. An issue number may be included when helpful, such as `feat/123-candidate-search`.

## Policy exceptions

Do not hide policy exceptions in titles or commit messages. A future exception must use a visible label, include a rationale in the PR body, and be explicitly supported by the policy checker. Tests, security checks, and the aggregate verification gate cannot be skipped.
