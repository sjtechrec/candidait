# Help center

The public Help center is informational while Candidait remains coming soon. It contains a landing page, FAQ, Contact, Sitemap, Privacy Requests, Accommodations, Verification Support, and Appeals.

The original Help release introduced no intake or interaction scripts. The follow-up adds a local-only request draft builder; no intake endpoint, uploads, tracking, or browser storage is added. Public support contacts are not established. Before enabling services, replace planned-status wording with verified operational details and publish real support/privacy/accommodation routes and policies.

## Review

Compliance Research performed the requested adversarial source review on October 28, 2026. No P0/P1 findings. Addressed both P2 findings by labeling legal links as coming soon and clarifying that private workspaces do not exist yet. Also addressed both P3 suggestions: reader-facing verification wording and explicit accommodation contact availability.

This review is not a legal opinion or an accessibility certification.

## Validation

- Repository tests: 21 passed. The first attempt hit a temporary-directory permission issue; rerunning with TEMP/TMP pointed to the writable checkout passed.
- Repository policy and tracked JavaScript syntax checks passed.
- Site validation: 22 HTML pages and 377 local links/assets; anchors, IDs, and Pages configuration passed.
- All eight Help routes returned HTTP 200 in the isolated local preview.
- Browser checks: desktop landing page, FAQ navigation and expansion, 390px mobile verification-support layout without horizontal overflow.
- Original release checks confirmed one H1, planned-status notice, coming-soon legal labels, no forms/scripts, and no em/en dashes. The subsequent request preview uses a dedicated module without loading prototype authentication scripts.

The preview uses a separate checkout and port; it does not modify the shared preview or live main branch.

## Future-service content revision

Following the user’s clarification, all eight pages now provide substantive guidance for the future service under a single coming-soon preview notice. Added 15 FAQs, support-message and appeal examples, task triage, privacy request categories and preparation, accommodation examples, and verification troubleshooting. Unsettled contact and service details are not invented.

Compliance Research completed a second adversarial content review. No P0/P1 preview blockers. Addressed both P2 findings: clarified contingency periods concern qualifying departures, and allowed verified request routes alongside secure accounts. Also added the P3 URL-redaction precaution. No forms or submission endpoints added. This is a preview-content review, not legal clearance for operational launch.

## Support workflow follow-up

Adds three public guidance routes: request draft preview, request lifecycle, and account recovery. Request categories cover technical, privacy, accommodation, recovery, appeal, safety, and employer service issues. Topic links use a fixed allowlist; draft output uses textContent, not HTML. No submission, case generation, persistence, uploads, authentication, or network requests occur in the draft builder. Browser autofill/history behavior is outside this no-storage claim and is disclosed. Fictional examples only are requested.

Expanded candidate privacy questions, candidate appeal example, support follow-up, employer service scopes, pricing example, organization/team access, records preservation, and service-versus-platform disputes. New internal briefs record unresolved operational/commercial decisions and policy drafting scope. They are not operative legal notices.

Validation for this follow-up: 43 Node tests passed; repository policy passed; checked 25 HTML pages and 511 local links/assets. Browser exercised appeal category selection, empty-draft validation, and unsent-draft review. See the PR for subsequent review corrections and final checks.

Compliance Research reviewed the follow-up and found no P0/P1 preview blockers. Addressed both P2 findings (submission uncertainty and accessible safety/error associations), the P3 credit-use wording, and validation-message clearing. Future intake ownership, legal clocks, verified alternatives, data practices, and final commercial mechanics remain launch dependencies.
