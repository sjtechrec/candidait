import assert from 'node:assert/strict';
import test from 'node:test';
import { validatePullRequest } from './pr-policy.mjs';

const scopes = ['api', 'repo', 'search', 'various'];

function body(scope = 'repo', extra = '') {
  return `## Primary Scope\n\n\`${scope}\` — a clear primary boundary for this change.\n\n## Summary\n\nTest summary.\n\n## Breaking Change\n\nNot applicable.\n\n${extra}`;
}

test('accepts a conventional title and matching primary scope', () => {
  assert.deepEqual(validatePullRequest({ title: 'docs(repo): document repository policy', body: body(), scopes }), []);
});

test('rejects the wrong breaking marker position', () => {
  const errors = validatePullRequest({ title: 'feat!(api): replace response', body: body('api'), scopes });
  assert.ok(errors.some((error) => error.includes('must match')));
});

test('rejects an unknown scope', () => {
  const errors = validatePullRequest({ title: 'docs(other): document policy', body: body('other'), scopes });
  assert.ok(errors.some((error) => error.includes('Unsupported scope')));
});

test('rejects a missing primary scope value', () => {
  const errors = validatePullRequest({
    title: 'docs(repo): document policy',
    body: '## Primary Scope\n\n<!-- empty -->\n\n## Summary\n\nText',
    scopes,
  });
  assert.ok(errors.some((error) => error.includes('non-comment text')));
});

test('rejects a primary scope that differs from the title', () => {
  const errors = validatePullRequest({ title: 'docs(repo): document policy', body: body('api'), scopes });
  assert.ok(errors.some((error) => error.includes('must name')));
});

test('requires breaking details for a breaking title', () => {
  const errors = validatePullRequest({ title: 'feat(api)!: replace response', body: body('api'), scopes });
  assert.ok(errors.some((error) => error.includes('Breaking Change')));
});

test('accepts documented breaking details', () => {
  const breakingBody = body('api').replace(
    'Not applicable.',
    'Affected contract: response schema.\n\nWhat breaks: legacy clients.\n\nMigration: use v2.\n\nRollback: restore v1.',
  );
  assert.deepEqual(validatePullRequest({ title: 'feat(api)!: replace response', body: breakingBody, scopes }), []);
});

test('requires measured evidence for performance changes', () => {
  const errors = validatePullRequest({ title: 'perf(search): reduce response time', body: body('search'), scopes });
  assert.equal(errors.filter((error) => error.includes('Performance section')).length, 3);
});

test('accepts measured performance evidence', () => {
  const performance = '## Performance\n\nMethod: fixed benchmark\n\nBefore: 500 ms\n\nAfter: 250 ms';
  assert.deepEqual(
    validatePullRequest({ title: 'perf(search): reduce response time', body: body('search', performance), scopes }),
    [],
  );
});

test('requires a revert reference', () => {
  const errors = validatePullRequest({ title: 'revert(repo): restore prior policy', body: body(), scopes });
  assert.ok(errors.some((error) => error.includes('Reverts:')));
});

test('requires a substantive explanation for various', () => {
  const minimalBody = '## Primary Scope\n\n`various` — mixed.\n\n## Summary\n\nText.';
  const errors = validatePullRequest({ title: 'chore(various): update files', body: minimalBody, scopes });
  assert.ok(errors.some((error) => error.includes('substantive explanation')));
});
