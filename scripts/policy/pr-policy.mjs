import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const ALLOWED_TYPES = new Set([
  'build',
  'chore',
  'ci',
  'docs',
  'feat',
  'fix',
  'perf',
  'refactor',
  'revert',
  'test',
]);

export function stripComments(value) {
  return value.replace(/<!--[\s\S]*?-->/g, '').trim();
}

export function getSection(body, heading) {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const expected = `## ${heading}`.toLowerCase();
  const start = lines.findIndex((line) => line.trim().toLowerCase() === expected);
  if (start < 0) return null;

  const content = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    if (/^##\s+/.test(lines[index])) break;
    content.push(lines[index]);
  }
  return stripComments(content.join('\n'));
}

export function validatePullRequest({ title, body, scopes }) {
  const errors = [];
  const normalizedTitle = title.trim();
  const normalizedBody = body.replace(/\r\n/g, '\n');

  if (normalizedTitle.length > 100) {
    errors.push('Title must be 100 characters or fewer.');
  }

  const match = /^(?<type>[a-z]+)\((?<scope>[a-z0-9]+(?:-[a-z0-9]+)*)\)(?<breaking>!)?: (?<summary>.+)$/.exec(normalizedTitle);
  if (!match?.groups) {
    errors.push('Title must match <type>(<scope>): <summary> or <type>(<scope>)!: <summary>.');
    return errors;
  }

  const { type, scope, breaking, summary } = match.groups;

  if (!ALLOWED_TYPES.has(type)) {
    errors.push(`Unsupported type: ${type}.`);
  }
  if (!scopes.includes(scope)) {
    errors.push(`Unsupported scope: ${scope}.`);
  }
  if (!/^[a-z0-9]/.test(summary)) {
    errors.push('Summary must begin with a lowercase letter or number.');
  }
  if (summary.endsWith('.')) {
    errors.push('Summary must not end with a period.');
  }

  const firstHeading = normalizedBody.match(/^#{1,6}\s+.+$/m)?.[0]?.trim();
  if (firstHeading !== '## Primary Scope') {
    errors.push('The first rendered heading must be ## Primary Scope.');
  }

  const primaryScope = getSection(normalizedBody, 'Primary Scope');
  if (!primaryScope) {
    errors.push('Primary Scope must contain non-comment text.');
  } else {
    const statedScope = /`([^`]+)`/.exec(primaryScope)?.[1];
    if (statedScope !== scope) {
      errors.push(`Primary Scope must name \`${scope}\`.`);
    }
    if (scope === 'various' && stripComments(primaryScope.replace(/`various`/, '')).length < 40) {
      errors.push('The various scope requires a substantive explanation of affected areas and why the PR cannot be split.');
    }
  }

  if (breaking) {
    const breakingSection = getSection(normalizedBody, 'Breaking Change');
    if (!breakingSection || /^not applicable\.?$/i.test(breakingSection)) {
      errors.push('A breaking title requires a completed Breaking Change section.');
    }
  }

  if (type === 'perf') {
    const performance = getSection(normalizedBody, 'Performance');
    for (const field of ['Method:', 'Before:', 'After:']) {
      if (!performance?.includes(field)) {
        errors.push(`A perf PR requires ${field} in a Performance section.`);
      }
    }
  }

  if (type === 'revert' && !/^Reverts:\s*(?:#[0-9]+|[0-9a-f]{7,40})\s*$/im.test(normalizedBody)) {
    errors.push('A revert PR requires a Reverts: #PR or Reverts: <commit> reference.');
  }

  return errors;
}

export function loadScopes(root = process.cwd()) {
  const file = path.join(root, '.github', 'pr-scopes.json');
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
  return parsed.scopes;
}

function main() {
  const errors = validatePullRequest({
    title: process.env.PR_TITLE ?? '',
    body: process.env.PR_BODY ?? '',
    scopes: loadScopes(),
  });

  if (errors.length > 0) {
    for (const error of errors) console.error(`::error title=Pull request policy::${error}`);
    process.exitCode = 1;
    return;
  }
  console.log('Pull request policy passed.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main();
}
