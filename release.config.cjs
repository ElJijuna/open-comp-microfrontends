const fs = require('node:fs');
const path = require('node:path');

const releasePackages = require('./release-packages.json');

const releaseScope = process.env.RELEASE_PACKAGE_SCOPE;
const releasePackage = releasePackages.packages.find((pkg) => pkg.scope === releaseScope);

if (!releasePackage) {
  throw new Error(
    `Unknown RELEASE_PACKAGE_SCOPE "${releaseScope}". Add it to release-packages.json before releasing.`,
  );
}

const packageJsonPath = path.join(__dirname, releasePackage.path, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const releaseTypes = new Set(['feat', 'fix', 'perf', 'revert']);
const typeSections = {
  feat: 'Features',
  fix: 'Bug Fixes',
  perf: 'Performance Improvements',
  revert: 'Reverts',
};

const scopedReleaseRules = [
  { breaking: true, scope: releasePackage.scope, release: 'major' },
  { type: 'feat', scope: releasePackage.scope, release: 'minor' },
  { type: 'fix', scope: releasePackage.scope, release: 'patch' },
  { type: 'perf', scope: releasePackage.scope, release: 'patch' },
  { type: 'revert', scope: releasePackage.scope, release: 'patch' },
];

const suppressDefaultRules = [
  { breaking: true, release: false },
  { type: 'feat', release: false },
  { type: 'fix', release: false },
  { type: 'perf', release: false },
  { type: 'revert', release: false },
];

module.exports = {
  branches: ['main'],
  tagFormat: releasePackage.tagFormat,
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        releaseRules: [...scopedReleaseRules, ...suppressDefaultRules],
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        writerOpts: {
          transform: (commit) => {
            if (commit.scope !== releasePackage.scope) {
              return false;
            }

            const hasBreakingNotes = commit.notes && commit.notes.length > 0;
            if (!releaseTypes.has(commit.type) && !hasBreakingNotes) {
              return false;
            }

            return {
              ...commit,
              type: typeSections[commit.type] || commit.type,
              scope: packageJson.name,
            };
          },
        },
      },
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: `${releasePackage.path}/CHANGELOG.md`,
      },
    ],
    [
      '@semantic-release/npm',
      {
        pkgRoot: releasePackage.path,
        tarballDir: releasePackage.path,
      },
    ],
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'npm install --package-lock-only --ignore-scripts',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          {
            path: `${releasePackage.path}/*.tgz`,
            label: `${packageJson.name} npm package`,
          },
        ],
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: [
          'package-lock.json',
          `${releasePackage.path}/package.json`,
          `${releasePackage.path}/CHANGELOG.md`,
        ],
        message: `chore(release): ${packageJson.name} \${nextRelease.version} [skip ci]\n\n\${nextRelease.notes}`,
      },
    ],
  ],
};
