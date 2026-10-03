# GitHub Project workflow

The [Candidait Project](https://github.com/users/sjtechrec/projects/2) is the single source of truth for active work and status. It is linked from the repository's [Projects page](https://github.com/sjtechrec/candidait/projects) and is private.

Durable decisions belong in the repository. Requirements and acceptance criteria belong in GitHub Issues. Pull requests implement those issues. The Project shows what is planned, active, blocked, and complete.

## Fields

### Status

- `Backlog`: captured and awaiting prioritization or readiness.
- `Ready`: defined well enough to begin.
- `In progress`: actively being worked.
- `Blocked`: cannot progress until a dependency or decision is resolved.
- `Done`: completed and closed or merged.

### Priority

- `P0`: urgent work that blocks safe operation or the critical path.
- `P1`: important work to schedule next.
- `P2`: normal planned work.
- `P3`: worthwhile work with no near-term commitment.

### Size

- `XS`: isolated and very small.
- `S`: small, with limited uncertainty.
- `M`: several coordinated changes or meaningful uncertainty.
- `L`: broad or uncertain enough to consider splitting before work begins.

Size is a relative planning aid, not a time estimate.

## Native automation

- Open issues and pull requests from `sjtechrec/candidait` are automatically added.
- An item added to the Project starts in `Backlog`.
- Closing an issue moves it to `Done`.
- Merging a pull request moves it to `Done`.
- Sub-issues of Project items are added automatically.
- Moving an issue to `Done` closes it automatically.

The last two are GitHub defaults enabled on this Project. Revisit them if issue hierarchies or closure semantics become more complex.

## Triage

1. Create an issue with an outcome and observable acceptance criteria.
2. Leave new work in `Backlog` until its priority and scope are understood.
3. Set `Priority` and `Size` before moving an item to `Ready`.
4. Keep only actively owned work in `In progress`.
5. When work cannot move, set `Blocked` and record the reason and dependency in the issue.
6. Close the issue or merge its pull request when complete; native automation sets `Done`.

Labels describe the kind of work or an exceptional condition. Do not recreate Status, Priority, or Size as labels.
