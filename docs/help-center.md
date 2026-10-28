# Help center

The public Help center is informational while Candidait remains coming soon. It contains a landing page, FAQ, Contact, Sitemap, Privacy Requests, Accommodations, Verification Support, and Appeals.

No forms, intake endpoints, uploaded documents, tracking, or new JavaScript are introduced. Public support contacts are not established. Before enabling services, replace planned-status wording with verified operational details and publish real support/privacy/accommodation routes and policies.

## Review

Compliance Research performed the requested adversarial source review on October 28, 2026. No P0/P1 findings. Addressed both P2 findings by labeling legal links as coming soon and clarifying that private workspaces do not exist yet. Also addressed both P3 suggestions: reader-facing verification wording and explicit accommodation contact availability.

This review is not a legal opinion or an accessibility certification.

## Validation

- Repository tests: 21 passed. The first attempt hit a temporary-directory permission issue; rerunning with TEMP/TMP pointed to the writable checkout passed.
- Repository policy and tracked JavaScript syntax checks passed.
- Site validation: 22 HTML pages and 363 local links/assets; anchors, IDs, and Pages configuration passed.
- All eight Help routes returned HTTP 200 in the isolated local preview.
- Browser checks: desktop landing page, FAQ navigation and expansion, 390px mobile verification-support layout without horizontal overflow.
- Confirmed one H1, planned-status notice, coming-soon legal labels, no forms/scripts, and no em/en dashes in each Help page.

The preview uses a separate checkout and port; it does not modify the shared preview or live main branch.
