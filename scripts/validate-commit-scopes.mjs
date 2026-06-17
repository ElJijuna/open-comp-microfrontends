import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const [base = 'origin/main', head = 'HEAD'] = process.argv.slice(2);
const manifest = JSON.parse(
  fs.readFileSync(new URL('../release-packages.json', import.meta.url), 'utf8'),
);

const packageScopes = new Map(manifest.packages.map((pkg) => [pkg.scope, pkg]));
const repoScope = manifest.repoScope;
const allowedScopes = new Set([...packageScopes.keys(), repoScope.scope]);

const runGit = (args) =>
  execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();

const parseHeader = (subject) => {
  const match = subject.match(/^(\w+)(?:\(([^)]+)\))?!?: .+/);
  if (!match) {
    return null;
  }

  return {
    type: match[1],
    scope: match[2],
  };
};

const isRepoScopedFile = (file) =>
  repoScope.allowedPaths.some((allowedPath) =>
    allowedPath.endsWith('/') ? file.startsWith(allowedPath) : file === allowedPath,
  );

const isPackageScopedFile = (file, pkg) => file === pkg.path || file.startsWith(`${pkg.path}/`);

const commits = runGit(['rev-list', `${base}..${head}`])
  .split('\n')
  .filter(Boolean)
  .reverse();

const failures = [];

for (const commit of commits) {
  const subject = runGit(['show', '-s', '--format=%s', commit]);

  if (subject.includes('[skip scope-check]')) {
    continue;
  }

  const parsed = parseHeader(subject);
  const shortSha = commit.slice(0, 7);

  if (!parsed?.scope) {
    failures.push(`${shortSha} "${subject}" must use a Conventional Commit scope.`);
    continue;
  }

  if (!allowedScopes.has(parsed.scope)) {
    failures.push(
      `${shortSha} "${subject}" uses unknown scope "${parsed.scope}". Allowed scopes: ${[
        ...allowedScopes,
      ].join(', ')}.`,
    );
    continue;
  }

  const changedFiles = runGit(['diff-tree', '--no-commit-id', '--name-only', '-r', commit])
    .split('\n')
    .filter(Boolean);

  if (parsed.scope === repoScope.scope) {
    const invalidFiles = changedFiles.filter((file) => !isRepoScopedFile(file));
    if (invalidFiles.length > 0) {
      failures.push(
        `${shortSha} "${subject}" is scoped to "${repoScope.scope}" but changes package files: ${invalidFiles.join(
          ', ',
        )}.`,
      );
    }
    continue;
  }

  const pkg = packageScopes.get(parsed.scope);
  const invalidFiles = changedFiles.filter((file) => !isPackageScopedFile(file, pkg));
  if (invalidFiles.length > 0) {
    failures.push(
      `${shortSha} "${subject}" is scoped to "${parsed.scope}" but changes files outside ${pkg.path}: ${invalidFiles.join(
        ', ',
      )}.`,
    );
  }
}

if (failures.length > 0) {
  console.error('Commit scope validation failed:\n');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Commit scope validation passed for ${commits.length} commit(s).`);
