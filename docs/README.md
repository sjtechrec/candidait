# Documentation

Keep this index short. Durable project knowledge belongs in the smallest appropriate document; active work belongs in GitHub Issues and status belongs in the Project.

## Governance

- [Repository setup plan](repository-setup-plan.md)
- [Pull request conventions](pull-request-conventions.md)
- [Security and PR checks](security-and-pr-checks.md)
- [GitHub Project workflow](github-project.md)
- [Contributing](../CONTRIBUTING.md)
- [Security policy](../SECURITY.md)

Desired live repository settings are recorded in [`.github/settings/repository.json`](../.github/settings/repository.json) and can be compared without mutation:

```powershell
node scripts/settings/settings-check.mjs --repo sjtechrec/candidait
```

## Product and architecture

Product requirements will be added after the product purpose is selected.

- [ADR 0001: Use Node.js for initial governance checks](architecture/0001-governance-runtime.md)
