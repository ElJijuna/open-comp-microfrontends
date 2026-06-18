# @open-comp/gh

GitHub-scoped React components for the `open-comp` ecosystem.

## Installation

```bash
npm install @open-comp/gh
```

---

## Components

### `GitHubProfile`

Displays a GitHub user profile card with avatar, bio, stats, contribution graph and recent activity.

```tsx
import { GitHubProfile } from '@open-comp/gh'

<GitHubProfile login="ElJijuna" />
```

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `login` | `string` | — | GitHub username |
| `showContributions` | `boolean` | `true` | Show/hide the contribution graph section |
| `showRecentActivity` | `boolean` | `true` | Show/hide the recent activity section |

---

### `GitHubContributions`

Standalone contribution graph for a GitHub user. Use it independently when you only need the graph.

```tsx
import { GitHubContributions } from '@open-comp/gh'

<GitHubContributions login="ElJijuna" />
```

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `login` | `string` | — | GitHub username |
| `weeks` | `number` | `52` | Number of weeks to display |

---

## Consumption patterns

### A — classic npm install

```tsx
import { GitHubProfile, GitHubContributions } from '@open-comp/gh'

// or via subpath exports
import { GitHubProfile } from '@open-comp/gh/GitHubProfile'
import { GitHubContributions } from '@open-comp/gh/GitHubContributions'
```

### B — via `open-comp` orchestrator (Module Federation)

```tsx
import { Microfrontend } from 'open-comp'

// GitHubProfile
<Microfrontend
  url="https://unpkg.com/@open-comp/gh@latest/dist/remoteEntry.js"
  remoteName="opencomp_gh"
  expose="./GitHubProfile"
  login="ElJijuna"
  fallback={<span>Loading…</span>}
/>

// GitHubContributions
<Microfrontend
  url="https://unpkg.com/@open-comp/gh@latest/dist/remoteEntry.js"
  remoteName="opencomp_gh"
  expose="./GitHubContributions"
  login="ElJijuna"
  fallback={<span>Loading…</span>}
/>
```

### C — direct ESM from unpkg

```ts
const { GitHubProfile } = await import(
  'https://unpkg.com/@open-comp/gh@latest/dist/index.es.js'
)

const { GitHubContributions } = await import(
  'https://unpkg.com/@open-comp/gh@latest/dist/index.es.js'
)
```

---

## Releases

Use the `@open-comp/gh` commit scope:

```bash
feat(@open-comp/gh): add repo card component      # minor
fix(@open-comp/gh): fix avatar fallback           # patch
feat(@open-comp/gh)!: rename login prop           # major
```
