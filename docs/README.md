# Documentation

Keep this index short. Durable project knowledge belongs in the smallest appropriate document; active work belongs in GitHub Issues and status belongs in the Project.

## Which record to update

| Record and location | Purpose and when to update it |
| --- | --- |
| [DevOps policy](../DEVOPS.md), [contributing guide](../CONTRIBUTING.md), [PR template](../.github/pull_request_template.md), and [CODEOWNERS](../.github/CODEOWNERS) | Explain how work is reviewed and merged. Update when a delivery rule, verification step, or repository owner changes. |
| [Roadmap](../ROADMAP.md), [GitHub Issues](https://github.com/sjtechrec/candidait/issues), and [Project workflow](github-project.md) | Use the roadmap for direction and Issues and Projects for work and status. Link an existing issue when it covers the PR. Track merge, activation, and live verification separately when a feature needs rollout. [TODO](../TODO.md) points to the trackers. |
| [Changelog](../CHANGELOG.md) | Record versioned releases once release automation is in service. Today, put change and release-impact evidence in the PR. |
| Product notes and architecture decisions in this directory | Update the relevant behavior, contract, or decision when it changes. If a diagram export is maintained, update it with its source. |
| [DevOps operating procedures](../DEVOPS.md) and the [site overview](../README.md) | Explain preview, publishing, verification, and rollback. Update the affected instructions or website status when the PR changes what an operator or visitor can do. |
| [Security policy](../SECURITY.md) | Describe security controls and reporting. Update it when the procedure changes. Use restricted storage for incident evidence. |

## Governance

- [Repository setup plan](repository-setup-plan.md)
- [Pull request conventions](../DEVOPS.md#pull-request-naming-conventions)
- [DevOps operating guide](../DEVOPS.md) — check ownership, Draft/ready lifecycle, merge gates, and deployment boundaries; the canonical CI/CD operating policy.
- [GitHub Project workflow](github-project.md)
- [Contributing](../CONTRIBUTING.md)
- [Security policy](../SECURITY.md)

Desired live repository settings are recorded in [`.github/settings/repository.json`](../.github/settings/repository.json) and can be compared without mutation:

```powershell
node scripts/settings/settings-check.mjs --repo sjtechrec/candidait
```

## Product and architecture

- [Help center notes and activation requirements](help-center.md)
- [ADR 0001: Use Node.js for initial governance checks](architecture/0001-governance-runtime.md)
