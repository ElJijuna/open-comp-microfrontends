# @open-comp/widgets

Monorepo of microfrontend widgets published under `@open-comp/*`.  
Each widget compiles to ESM + UMD + `remoteEntry.js` and is consumable via the `open-comp` orchestrator or as a classic npm install.

---

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| [`@open-comp/hello-world`](./packages/hello-world) | `0.1.0` | Dummy widget — validates the full build/publish/load pipeline |

---

## Getting started

```bash
npm install
npm run build
```

---

## Consumption patterns

### A — classic npm install

```tsx
import { HelloWorld } from '@open-comp/hello-world'

<HelloWorld name="Ivan" />
```

### B — via `open-comp` orchestrator (Module Federation)

```tsx
import { Microfrontend } from 'open-comp'

<Microfrontend
  url="https://unpkg.com/@open-comp/hello-world@0.1.0/dist/remoteEntry.js"
  remoteName="opencomp_hello_world"
  expose="./HelloWorld"
  name="Ivan"
  fallback={<span>Loading…</span>}
/>
```

### C — direct ESM from unpkg

```ts
const { HelloWorld } = await import(
  'https://unpkg.com/@open-comp/hello-world@0.1.0/dist/index.es.js'
)
```

---

## Development

```bash
npm run dev          # watch mode for all packages
npm run lint         # ESLint across all packages
npm run format       # Biome format
```

### Adding a new widget

1. Create `packages/<widget-name>/` with the same structure as `hello-world`
2. Set federation `name` to `opencomp_<widget_name>` (underscores, no hyphens)
3. Add `react` and `react-dom` to `peerDependencies`, marked `singleton: true` in federation `shared`
4. Run `npm install` from root to hoist dependencies

---

## Tech stack

- [Turborepo](https://turbo.build) — monorepo task orchestration
- [Vite 8](https://vite.dev) — build tool
- [@originjs/vite-plugin-federation](https://github.com/originjs/vite-plugin-federation) — Module Federation
- [Biome](https://biomejs.dev) — formatting + linting
- [ESLint](https://eslint.org) — React hooks + TypeScript rules
