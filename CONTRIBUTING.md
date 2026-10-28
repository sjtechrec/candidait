# Contributing to Candidait

Thank you for helping improve Candidait.

## Before you begin

- Read and follow the [Code of Conduct](CODE_OF_CONDUCT.md).
- Search existing issues and pull requests before starting duplicate work.
- For a substantial change, open an issue before implementation so the outcome and risks can be discussed.
- Never commit credentials, personal data, or other secrets.
- Follow the [pull request conventions](docs/pull-request-conventions.md).
- Read the [CI operating guide](docs/security-and-pr-checks.md) for check ownership, Draft/ready expectations, and which gates are currently enforced.

## Development workflow

1. Create a focused branch from the latest `main` branch using `<type>/<short-kebab-description>`.
2. Make the smallest coherent change that solves the problem.
3. Add or update tests and documentation where applicable.
4. Run the [available validation commands](docs/security-and-pr-checks.md#automated-checks).
5. Open a Draft pull request using the repository template while the change is in progress. Use local previews for website review.
6. Mark it ready for review when the change and test/risk evidence are ready. Address CI and CodeRabbit findings on the latest revision before requesting a merge.

The operating guide distinguishes current checks from planned website tests and deployment safeguards. Do not substitute passing no-op scripts for missing checks or claim a planned control is active.

## Branch and commit conventions

Use a short branch name with an accepted pull request type, such as:

- `feat/candidate-search`
- `fix/profile-validation`
- `docs/setup-guide`
- `chore/update-dependencies`

Intermediate commits should be understandable but may be reorganized during development. The pull request title is authoritative because accepted pull requests will be squash merged.

## Pull requests

A pull request should:

- Explain the problem and the chosen solution.
- Link related issues.
- Include tests or explain why none are needed.
- Note user-facing, security, migration, or operational effects.
- Keep unrelated changes out of scope.
- Include a concrete rollback approach for material changes.

Resolve review conversations and ensure all available checks pass. The repository currently has one maintainer, so independent approval cannot yet be enforced. One approval and code-owner review will become required after a second trusted maintainer is added and the GitHub plan supports enforcement.
