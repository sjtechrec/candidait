# Contributing to Candidait

Thank you for helping improve Candidait.

## Before you begin

- Read and follow the [Code of Conduct](CODE_OF_CONDUCT.md).
- Search existing issues and pull requests before starting duplicate work.
- For a substantial change, open an issue before implementation so the outcome and risks can be discussed.
- Never commit credentials, personal data, or other secrets.
- Follow the [pull request conventions](docs/pull-request-conventions.md).

## Development workflow

1. Create a focused branch from the latest `main` branch using `<type>/<short-kebab-description>`.
2. Make the smallest coherent change that solves the problem.
3. Add or update tests and documentation where applicable.
4. Run the project's formatting, linting, and test commands.
5. Open a pull request using the repository template.

Setup and application validation commands will be added after the application stack is established. Do not substitute passing no-op scripts for missing checks.

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
