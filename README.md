# @vctqs1/nav-progress-bar

A zero-dependency, CSP-safe top-of-page progress bar built as a native Web Component. Works in any framework — or no framework at all.

> Originally built to solve the [Next.js App Router `loading.js` dead gap](https://github.com/vercel/next.js/issues/43548), but works anywhere the browser supports the [Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API).

## Packages

| Package | Description |
|---------|-------------|
| [`@vctqs1/nav-progress-bar`](./packages/nav-progress-bar) | Core Web Component — zero dependencies, framework-agnostic |
| [`@vctqs1/nav-progress-bar-react`](./packages/nav-progress-bar-react) | React wrapper with SSR support and JSX types |

## Quick Install

**Vanilla / any framework:**
```bash
npm install @vctqs1/nav-progress-bar
```

**React / Next.js:**
```bash
npm install @vctqs1/nav-progress-bar @vctqs1/nav-progress-bar-react
```

## Quick Start

### Any framework

```html
<script type="module">
  import { registerNavProgressBar } from '@vctqs1/nav-progress-bar';
  registerNavProgressBar();
</script>

<vctqs1-nav-progress-bar></vctqs1-nav-progress-bar>
```

### Next.js App Router

```tsx
// app/layout.tsx
import NavProgressBar from '@vctqs1/nav-progress-bar-react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <NavProgressBar />
        {children}
      </body>
    </html>
  );
}
```

```ts
// instrumentation-client.ts
import { registerNavProgressBar, getNavProgressBar } from '@vctqs1/nav-progress-bar';

registerNavProgressBar();

export function onRouterTransitionStart(
  url: string,
  navigationType: 'push' | 'replace' | 'traverse',
) {
  getNavProgressBar()?.start();
}
```

For full framework guides (Nuxt, SvelteKit, Astro, Vanilla) see the [core package README](./packages/nav-progress-bar/README.md).

## Why

In Next.js App Router, `loading.js` is a React Suspense boundary — it only renders **after** the RSC payload arrives. On slow connections this creates a dead period of 100ms–2s+ where the page looks frozen after a user clicks a link.

```
User clicks Link
  → nothing visible happens   ← dead gap: page looks frozen
  → RSC payload arrives
  → React renders Suspense shell
    → loading.js displays      ← feedback finally appears
```

`@vctqs1/nav-progress-bar` fills that gap by starting the moment the browser fires the `navigate` event — synchronously on click, before any network request:

```
User clicks Link
  → "navigate" fires instantly
    → bar starts               ← immediate feedback (0ms)
    → RSC payload arrives
    → React patches the tree
      → "navigatesuccess" fires
        → bar finishes
```

The same mechanism works in any framework that triggers browser history mutations (`history.pushState`, `history.replaceState`) — which is every modern SPA router.

## How It Works

The bar is implemented as a native Custom Element (`<vctqs1-nav-progress-bar>`) with:

- **Shadow DOM** for style encapsulation
- **Constructable Stylesheets** (`adoptedStyleSheets`) for all styling — no inline `style=`, no `<style>` tags, fully CSP `style-src` safe
- **Navigation API** (`navigate` → start, `navigatesuccess` → finish) for auto lifecycle
- **Declarative Shadow DOM** for SSR hydration without flash

Progress uses asymptotic easing — every 200ms the bar moves 8% of the remaining distance toward 85%, never quite reaching it. On `finish()` it jumps to 100% and fades out.

## Browser Support

Requires the [Navigation API](https://caniuse.com/mdn-api_navigation) — Chrome 102+, Edge 102+. Registration is skipped gracefully in unsupported browsers (no errors, no stuck bar).

## Development

This is an [NX](https://nx.dev) monorepo using `pnpm`.

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm nx run-many --target=build

# Test all packages
pnpm nx run-many --target=test

# Build a specific package
pnpm nx build nav-progress-bar
pnpm nx build nav-progress-bar-react

# Test a specific package
pnpm nx test nav-progress-bar
pnpm nx test nav-progress-bar-react
```

## Publishing

```bash
# Build first
pnpm nx run-many --target=build

# Publish core
cd packages/nav-progress-bar && npm publish --access public

# Publish React wrapper
cd packages/nav-progress-bar-react && npm publish --access public
```

## License

MIT
