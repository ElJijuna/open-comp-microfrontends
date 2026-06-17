# @open-comp/gh

GitHub-scoped React components for the `open-comp` ecosystem.

## Installation

```bash
npm install @open-comp/gh
```

## Components

### `GitHubProfile`

Displays a GitHub user profile card.

```tsx
import { GitHubProfile } from '@open-comp/gh'

<GitHubProfile
  username="ElJijuna"
  avatarUrl="https://avatars.githubusercontent.com/u/12345"
  bio="Open source developer"
/>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `username` | `string` | yes | GitHub username (displayed as `@username`) |
| `avatarUrl` | `string` | no | URL of the avatar image |
| `bio` | `string` | no | Short bio text |

## Consumption patterns

### A — classic npm install

```tsx
import { GitHubProfile } from '@open-comp/gh'
```

### B — via `open-comp` orchestrator (Module Federation)

```tsx
import { Microfrontend } from 'open-comp'

<Microfrontend
  url="https://unpkg.com/@open-comp/gh@0.1.0/dist/remoteEntry.js"
  remoteName="opencomp_gh"
  expose="./GitHubProfile"
  username="ElJijuna"
  fallback={<span>Loading…</span>}
/>
```

### C — direct ESM from unpkg

```ts
const { GitHubProfile } = await import(
  'https://unpkg.com/@open-comp/gh@0.1.0/dist/index.es.js'
)
```

## Releases

Use the `gh` commit scope:

```bash
feat(gh): add repo card component      # minor
fix(gh): fix avatar fallback           # patch
feat(gh)!: rename username prop        # major
```
