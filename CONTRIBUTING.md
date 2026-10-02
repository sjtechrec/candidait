# Contributing to Candidait

Thank you for helping improve Candidait.

## Before you begin

- Read and follow the [Code of Conduct](CODE_OF_CONDUCT.md).
- Search existing issues and pull requests before starting duplicate work.
- For a substantial change, open an issue first so the approach can be discussed.
- Never commit credentials, personal data, or other secrets.

## Development workflow

1. Create a focused branch from the latest `main` branch.
2. Make the smallest coherent change that solves the problem.
3. Add or update tests and documentation where applicable.
4. Run the project's formatting, linting, and test commands.
5. Open a pull request using the repository template.

Setup and validation commands will be added after the application stack is established.

## Branch and commit conventions

Use a short branch name with a category prefix, such as:

- `feat/candidate-search`
- `fix/profile-validation`
- `docs/setup-guide`
- `chore/update-dependencies`

Write imperative, focused commit messages. Conventional Commit prefixes such as `feat:`, `fix:`, `docs:`, `test:`, and `chore:` are encouraged.

## Pull requests

A pull request should:

- Explain the problem and the chosen solution.
- Link related issues.
- Include tests or explain why none are needed.
- Note user-facing, security, migration, or operational effects.
- Keep unrelated changes out of scope.
- Update `CHANGELOG.md` when the change is notable to users.

At least one approving review is expected before merging. Resolve review conversations and ensure required checks pass.
