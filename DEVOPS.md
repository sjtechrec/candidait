# DevOps operating guide

This file owns the human-readable CI/CD swim lanes, responsibilities, and
operating policies, including PR lifecycle, merge gates, and deployment
boundaries. Executable behavior lives in `.github/workflows/` and associated
scripts; GitHub settings enforce repository rules. Keep those implementations
aligned with this guide. Start here when adding or changing
automation. [Contributing](CONTRIBUTING.md) describes the contributor workflow;
[PR conventions](docs/pull-request-conventions.md) define title/body syntax;
[SECURITY.md](SECURITY.md) owns security policy, including vulnerability reporting.

## Security policy authority

[SECURITY.md](SECURITY.md) is authoritative on security matters and takes
precedence over this guide if they conflict. Its scope may expand beyond
vulnerability reporting. This guide defines how CI/CD implements and verifies
security requirements; it does not independently set or override security policy.

Link to the applicable security policy rather than duplicating it here. Keep
workflow ownership, triggers, permissions, checks, and operational procedures in
this guide. When a proposed automation change would change security policy,
update and review `SECURITY.md` first or in the same PR, then align the
implementation and this guide. Resolve conflicts before deploying the change.

## Ownership and change rules

The repository maintainer, currently `@sjtechrec`, is accountable for changing
automation, accepting review findings, approving risk, and authorizing merges.
Tools produce evidence; they do not assume that accountability. Existing
[CODEOWNERS](.github/CODEOWNERS) routes changes for attention and is not a
claim that independent approval is currently enforced.

Every check must declare its input, owned decision, output, trigger, failure
behavior, and relationship to the merge gate. Add work to its existing owner
before adding another tool or workflow. Shared parsing or setup is acceptable;
rerunning the same analysis or reposting the same finding needs a stated reason.

**No duplicative CI/CD:** each automation must have a distinct owned decision.
Before adding a workflow, check, scanner, or reviewer, identify the gap it fills
and reuse the existing lane when possible. Do not run duplicate default/custom
scanner setups. Any intentional overlap must document its additional coverage,
cost, and authoritative result. Retire the replaced implementation when migrating
tools. Aggregating existing results is allowed; repeating their work is not a
new responsibility.

| Lane and owner | Input and owned decision | Evidence/output | Boundary and merge role |
| --- | --- | --- | --- |
| Repository policy — `CI / policy` | Repository files and PR metadata; enforce documented conventions and test the validation scripts | Test output and policy errors | Current: required through `verify`. Does not test website behavior or own application security analysis. |
| JavaScript correctness — `CI / javascript` | Tracked JS/MJS/CJS files and `.node-version`; validate syntax without executing those files | File count and parse failures | Current: required through `verify`. Does not run browser/behavior tests or CodeQL queries. |
| Functional merge gate — `CI / verify` | Explicit results from its declared dependencies | One stable pass/fail check | Current: rejects failed, canceled, or skipped policy/javascript jobs. Does not rerun them or aggregate independent CodeQL/AI workflows. |
| Workflow security — `CodeQL (actions)` | GitHub Actions definitions | Uploaded scan findings | Current: analyzes workflow security, not application JavaScript. Scan completion alone does not prove acceptable findings. |
| Application security — `CodeQL (javascript-typescript)` | JavaScript/TypeScript | Uploaded scan findings | Current: analyzes application security, not PR prose or workflow YAML. |
| Security result assessment — `Code scanning results / CodeQL` | Uploaded scan results and the PR diff | New-alert assessment | Current: consumes findings; does not run a third scan. Native findings-based merge protection is a planned change. |
| Contextual review — CodeRabbit | Changed code, related files, CI findings, and PR intent | Commit-linked review comments/status | Current: advisory. Owns contextual bugs, regressions, and missing-test observations; does not own deterministic metadata conventions or intentionally duplicate CI findings. |
| Website behavior — future `site` job | Served site, routes, assets, and user interactions | Browser smoke tests, local-link checks, focused accessibility results, failure traces/screenshots | Planned: no automated site job exists yet. Add to the functional gate only after reliable pass/fail canaries. |
| Delivery — GitHub Pages | Current: main/root. Target: validated artifact and source SHA | Deployment record; target includes live SHA smoke result | Current: independent branch publishing. Tested-artifact deployment and live revision verification are planned. PR checks never own production credentials. |
| Operational health — future scheduled audit | Desired/live settings, external links, background runs | Actionable drift/failure report | Planned: read-only scheduled checks, separate from PR validation. A local settings checker already exists. |

Adding actionlint/YAML contracts belongs in policy/tooling validation. Adding
site tests belongs in the website lane. Adding a second scanner or reviewer
requires a documented coverage gap, not merely a new badge. On activation of
new lanes, update this table, their failure behavior, and required-check rules
in the same rollout. Planned rows are not evidence that those protections exist.

## Draft and ready-for-review lifecycle

A Draft PR is also open. Use its Draft flag to distinguish development from
ready-for-review; `state: open` alone cannot make that distinction.

The following is the agreed target policy. The current implementation is
listed separately below so pending workflow changes cannot be mistaken for
active controls.

| Activity | Draft PR | Ready-for-review PR |
| --- | --- | --- |
| Policy/tooling tests and JavaScript syntax | Run on code updates | Run on code updates |
| CodeQL | Run on code updates for early security feedback | Ensure current analysis/results are available before merge; native enforcement is pending |
| Small site smoke/accessibility checks | Run when implemented | Run when implemented |
| CodeRabbit | Manual early review if requested; automatic Draft review off | Automatic review and incremental review of code pushes |
| PR metadata | Basic title/scope feedback; prose can evolve | Completed test/risk evidence appropriate to the change; expanded enforcement is pending |
| Expensive browser/visual coverage | Manual opt-in where useful, once implemented | Relevant coverage once implemented |
| Production deployment | Never | Never from the PR branch; deploy validated main after merge |

Current implementation: CI runs for Draft and non-draft PRs on `opened`,
`synchronize`, `reopened`, `edited`, `labeled`, `unlabeled`, and
`ready_for_review`. CodeQL uses the default PR events `opened`, `synchronize`,
and `reopened` for PRs into main. CodeRabbit has `drafts: false`. CI currently
reruns code work on metadata/label events; separating those consumers is planned.

Implement lifecycle automation with these boundaries:

- Code pushes run applicable code checks in both states. Preserve inexpensive
  deterministic feedback rather than switching off Draft CI wholesale.
- `ready_for_review` must initiate complete ready-stage validation even when no
  new commit was pushed. Test the bot transition too; a manual review is a
  fallback, not proof of automatic readiness handling.
- `converted_to_draft` should update lifecycle reporting and cancel obsolete
  expensive work where supported. Actions concurrency does not cancel an
  independent vendor review by itself.
- Title/body edits run metadata validation. A changed target branch requires
  appropriate integration validation. Labels trigger only their actual consumers.
- Keep production deployment on main and scheduled health work out of the PR
  critical path. No skip label exempts code from required safety checks.

## Required-check contract

Current enforcement: only `verify`, from the GitHub Actions app, is required
by the main ruleset. It covers `policy` and `javascript`. CodeQL and CodeRabbit
run independently and are not required merge gates today. Required findings
protection, website tests, and AI review completion enforcement need separate
implementation and validation before this document can call them active.

`verify` must report an explicit decision even when a dependency fails. Never
replace its enforcement with an unconditional success message. Treat unexpected
skips, cancellation, missing results, and tool failure as incomplete required
work. A valid not-applicable decision needs an explicit tested rule.

GitHub can treat a conditionally skipped job as successful, while a workflow
that never starts can leave a required check pending. Avoid workflow-level path
exclusions for required reporting and do not rely on `if: !draft` as a complete
merge-safety design. A green Draft result for a commit must not substitute for
ready-only mandatory work on that same commit. Keep the existing core verify
dependencies running in both states until that transition contract is tested.

Before changing lifecycle or required gates, demonstrate: Draft creation/push;
ready without a new commit; ready pushes; Draft/ready toggles during a run;
metadata-only changes; failed/canceled/missing/skipped dependencies; bot-authored
PRs; scanner alerts; and reviewer outage/rate limits. Before enabling a merge
queue, validate `merge_group` coverage for every required check.

## Workflows

Maintain the workflow inventory here rather than in a separate competing guide.
Update it together with trigger, ownership, or deployment changes.

| Implementation | Owner/purpose | Current triggers |
| --- | --- | --- |
| [ci.yml](.github/workflows/ci.yml) | Policy, JavaScript validation, and the functional `verify` gate | PR events listed in the lifecycle section; main push; merge group; manual |
| [codeql.yml](.github/workflows/codeql.yml) | Workflow and application security analysis | PR opened/updated/reopened into main; main push; Monday schedule; manual |
| GitHub Pages generated workflow | Production publishing from main/root | Publishing-source updates; independent of CI today |
| [.coderabbit.yaml](.coderabbit.yaml) and GitHub App | Contextual PR review; external integration, not another Actions workflow | Eligible non-draft PRs and code pushes; manual review |

### Automated checks

The `CI` workflow runs on pull requests, pushes to `main`, merge groups, and
manual requests. `policy` tests repository guards and validates repository and
PR conventions. `javascript` checks every tracked JavaScript file for syntax
errors without executing it. The stable `verify` check fails if either job
fails or is skipped. These checks do not replace browser or behavior tests.

Run the same checks locally with Node.js from `.node-version`:

```powershell
node --test scripts/policy/*.test.mjs scripts/settings/*.test.mjs scripts/checks/*.test.mjs
node scripts/policy/repository-policy.mjs
node scripts/checks/javascript.mjs
```

`CodeQL` scans workflow definitions and JavaScript on PRs into `main`, pushes
to `main`, every Monday, and manual requests. Findings appear under GitHub
Security > Code scanning. A successful scan means analysis completed; it does
not mean there are no vulnerabilities. Code scanning merge protection is a
separate repository rule and is not implied by requiring `verify`.

Both workflows use GitHub-hosted runners, full-SHA action references,
timeouts, and read-only contents access. Only CodeQL's analysis job receives
`security-events: write`. PR checks receive no deployment credentials and do
not use `pull_request_target`. Dependabot maintains action pins weekly.

### AI review

`.coderabbit.yaml` configures CodeRabbit to automatically review non-draft PRs
and new pushes. Reviews focus on defects, security, privacy, regressions, and
tests for changed behavior. AI feedback is advisory; maintainers decide how
to resolve it. AI reviews are not configured to approve or merge changes.

CodeRabbit's title and description pre-merge checks are disabled because
`policy` owns the repository's PR metadata conventions. The bot may still assess
whether a change actually fulfills its description or linked issue.

### Analysis boundaries

Audited on 2026-10-28 against live configuration, workflow job steps, validation
scripts, and the CodeRabbit review on PR #17.

`policy` tests the syntax checker against small fixtures; `javascript` applies
that checker to the repository. Testing a guard and using it are different
responsibilities. Parsing a file as part of a test or security analysis is an
implementation prerequisite, not another full syntax-validation job.

The two CodeQL matrix jobs target distinct languages. GitHub's results check
consumes their uploaded findings; it is not a third scanner. GitHub's default
CodeQL setup is disabled: only `.github/workflows/codeql.yml` owns CodeQL scans.
Do not enable default setup alongside it.

CodeRabbit also has built-in analysis tools. Their enabled defaults are not
evidence that every tool ran on a given PR. Different lint or security engines
can have overlapping findings without identical coverage; retain complementary
coverage and have the bot avoid duplicate feedback rather than claiming zero
overlap or disabling tools merely because they share a language.

PR scans assess the proposed merge; push scans maintain the actual `main`
baseline, and scheduled scans apply updated security queries even when source
has not changed. These triggers serve different lifecycle purposes. They are
not two scanners running on the same PR event.

References: [CodeRabbit configuration](https://docs.coderabbit.ai/reference/configuration)
and [GitHub code scanning results](https://docs.github.com/en/code-security/how-tos/manage-security-alerts/manage-code-scanning-alerts/triage-alerts-in-pull-requests).

### AI review activation and recovery

CodeRabbit was verified reviewing PRs in this repository. The YAML file alone
does not install the service. If reinstalling, scope the
[CodeRabbit GitHub App](https://github.com/apps/coderabbitai) to the intended
personal repositories and inspect installation and OAuth permissions separately.
Do not expand organization access as an incidental sign-in step.

Verify activation by opening a small PR and pushing a follow-up commit.
Confirm the bot reviewed the latest revision. Do not make its check required
until normal, skipped, and failed reviews have been observed. Keep automatic
code changes and auto-merge disabled during this initial rollout.

## Repository controls

Secret scanning, secret push protection, Dependabot alerts, and Dependabot
security updates are enabled in repository security settings. Push protection
blocks supported secret patterns; it cannot detect every credential.

The default branch ruleset requires `verify` from the GitHub Actions app and
up-to-date branches, PRs, conversation resolution, and squash merges. It blocks
deletion and force pushes and has no bypass actors. Preserve those controls.
With one maintainer, do not require
an approval the author cannot provide. Add independent approval and code-owner
review when a second trusted maintainer joins.

The older repository setup plan records historical private-repository limits.
The repository was public when these changes were prepared on 2026-10-27;
check live settings rather than treating that historical plan as current state.

## Rollback

Revert the workflow/configuration PR to remove these file changes. To stop AI
reviews immediately, disable CodeRabbit for this repository in its dashboard.
If a new required check prevents recovery, edit the ruleset to remove only
that check, repair CI through a PR, and restore the check after verification.
Keep secret protection enabled unless a concrete operational issue requires
a separately reviewed change.

## Failure handling and future rollout

Each lane reports actionable failure evidence and the affected revision. Prefer
job summaries over a new bot comment on every push. Website failures should
eventually attach traces/screenshots with bounded retention and no candidate
data. Distinguish flakes recovered by retry from first-attempt passes; do not
use blanket retries to conceal deterministic failures.

The maintainer triages security findings using their actual source/sink and
impact, and records fixes or justified dismissals. An AI check's completion
does not mean all findings were fixed, and a skipped review is not evidence
that analysis ran. Re-check the latest revision after follow-up commits.

Roll out separately: stronger policy/guard tests and native CodeQL merge
protection; website smoke/accessibility tests; tested-artifact Pages deployment
and live SHA verification; then scheduled read-only settings/health checks.
Keep the local preview as design feedback, not proof of CI or deployment success.

References: [GitHub PR events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request),
[required-check behavior](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks),
[CodeRabbit review controls](https://docs.coderabbit.ai/configuration/auto-review),
and [custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
