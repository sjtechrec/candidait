import assert from 'node:assert/strict';
import test from 'node:test';
import { compareSettings, selectKeys } from './settings-check.mjs';

test('reports no drift when desired and live settings agree', () => {
  const settings = { repository: { allow_squash_merge: true }, actions: { enabled: true } };
  assert.deepEqual(compareSettings(settings, structuredClone(settings)), []);
});

test('reports exact drift paths and values', () => {
  const differences = compareSettings(
    { repository: { allow_squash_merge: true, delete_branch_on_merge: true } },
    { repository: { allow_squash_merge: true, delete_branch_on_merge: false } },
  );
  assert.deepEqual(differences, [
    { path: 'repository.delete_branch_on_merge', expected: true, actual: false },
  ]);
});

test('selects only desired keys from a larger API response', () => {
  assert.deepEqual(
    selectKeys(
      { enabled: true, allowed_actions: 'all', unrelated: 'ignored' },
      { enabled: true, allowed_actions: 'selected' },
    ),
    { enabled: true, allowed_actions: 'all' },
  );
});

test('reports missing live keys as drift', () => {
  assert.deepEqual(compareSettings({ repository: { allow_auto_merge: false } }, { repository: {} }), [
    { path: 'repository.allow_auto_merge', expected: false, actual: undefined },
  ]);
});
