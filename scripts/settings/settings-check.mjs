import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export function compareSettings(expected, actual, prefix = '') {
  const differences = [];
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual) || JSON.stringify(expected) !== JSON.stringify(actual)) {
      differences.push({ path: prefix, expected, actual });
    }
    return differences;
  }
  if (expected && typeof expected === 'object') {
    for (const [key, value] of Object.entries(expected)) {
      const nextPrefix = prefix ? `${prefix}.${key}` : key;
      differences.push(...compareSettings(value, actual?.[key], nextPrefix));
    }
    return differences;
  }
  if (expected !== actual) differences.push({ path: prefix, expected, actual });
  return differences;
}

export function selectKeys(source, shape) {
  if (Array.isArray(shape)) return source;
  if (!shape || typeof shape !== 'object') return source;
  return Object.fromEntries(Object.entries(shape).map(([key, value]) => [key, selectKeys(source?.[key], value)]));
}

function ghJson(endpoint) {
  const result = spawnSync('gh', ['api', endpoint], {
    encoding: 'utf8',
    shell: false,
    windowsHide: true,
  });
  if (result.status !== 0) {
    throw new Error(`gh api ${endpoint} failed: ${result.stderr.trim()}`);
  }
  return JSON.parse(result.stdout);
}

export function readLiveSettings(repository, desired) {
  const repositorySettings = ghJson(`repos/${repository}`);
  const actionsPermissions = ghJson(`repos/${repository}/actions/permissions`);
  const workflowPermissions = ghJson(`repos/${repository}/actions/permissions/workflow`);
  const selectedActions = actionsPermissions.allowed_actions === 'selected'
    ? ghJson(`repos/${repository}/actions/permissions/selected-actions`)
    : {};

  return {
    repository: selectKeys(repositorySettings, desired.repository),
    actions_permissions: selectKeys(actionsPermissions, desired.actions_permissions),
    selected_actions: selectKeys(selectedActions, desired.selected_actions),
    workflow_permissions: selectKeys(workflowPermissions, desired.workflow_permissions),
  };
}

function parseRepositoryArgument(argumentsList) {
  const index = argumentsList.indexOf('--repo');
  if (index < 0 || !argumentsList[index + 1]) {
    throw new Error('Usage: node scripts/settings/settings-check.mjs --repo OWNER/REPO');
  }
  return argumentsList[index + 1];
}

function main() {
  const repository = parseRepositoryArgument(process.argv.slice(2));
  const desiredPath = path.join(process.cwd(), '.github', 'settings', 'repository.json');
  const desired = JSON.parse(fs.readFileSync(desiredPath, 'utf8'));
  const actual = readLiveSettings(repository, desired);
  const differences = compareSettings(desired, actual);

  if (differences.length > 0) {
    console.error(`Repository settings drift detected for ${repository}:`);
    for (const difference of differences) {
      console.error(`- ${difference.path}: expected ${JSON.stringify(difference.expected)}, actual ${JSON.stringify(difference.actual)}`);
    }
    process.exitCode = 1;
    return;
  }
  console.log(`Repository settings match desired state for ${repository}.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
