# @vctqs1/nav-progress-bar

A zero-dependency, CSP-safe top-of-page progress bar built as a native Web Component. Works in any framework — or no framework at all.

> Live demo: https://nav-progress-p0gw9z3lf-vctqs1s-projects.vercel.app/

> Demo video:

<video src="https://github.com/user-attachments/assets/4144ed95-8c25-4aa9-b804-905ac24805b4" controls width="100%"></video>

> Originally built to solve the [Next.js App Router `loading.js` dead gap](https://github.com/vercel/next.js/issues/43548), but the underlying mechanism (the browser [Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API)) works anywhere.

> If you use Next.js App Router, this is the missing feedback layer before `loading.js` renders.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Packages](#packages)
- [Quick Start](#quick-start)
  - [Next.js App Router](#nextjs-app-router)
  - [Nuxt](#nuxt)
  - [SvelteKit](#sveltekit)
  - [Astro](#astro)
  - [Manual start (non-Next.js)](#manual-start-non-nextjs)
  - [Vanilla HTML](#vanilla-html-snippet)
  - [ES Module](#es-module)
- [Color Configuration](#color-configuration)
- [API](#api)
- [How It Works](#how-it-works)
- [Browser Support](#browser-support)
- [Debugging](#debugging)
- [License](#license)

## Features

- **Zero dependencies** — pure Web Component, no React, no Vue, nothing
- **CSP-safe** — all styling via `adoptedStyleSheets`, no inline `style=` or `<style>` tags
- **SSR-ready** — supports Declarative Shadow DOM, no flash on hydration
- **Framework-agnostic** — Next.js, Nuxt, SvelteKit, Astro, Remix, vanilla HTML
- **Auto start/finish** — listens to browser Navigation API events automatically
- **Customisable color** — raw hex or CSS custom property

## Installation

```bash
npm install @vctqs1/nav-progress-bar
# or
pnpm add @vctqs1/nav-progress-bar
# or
yarn add @vctqs1/nav-progress-bar
```

## Packages

| Package | Description |
|---------|-------------|
| [`@vctqs1/nav-progress-bar`](https://www.npmjs.com/package/@vctqs1/nav-progress-bar) | Core Web Component — zero dependencies, framework-agnostic. Use this directly for vanilla HTML or non-React frameworks. |
| [`@vctqs1/nav-progress-bar-react`](https://www.npmjs.com/package/@vctqs1/nav-progress-bar-react) | React wrapper with SSR support and JSX types. Use this for React and especially Next.js App Router. |


## Quick Start

Pick your framework below. For most SPA routers the Navigation API fires automatically after `registerNavProgressBar()` — no extra wiring needed. If you need to force a manual start signal, see [Manual start (non-Next.js)](#manual-start-non-nextjs) below.

### Next.js App Router

The bar solves the `loading.js` dead gap — the frozen period between a user clicking a link and any loading feedback appearing. See [Next.js issue #43548](https://github.com/vercel/next.js/issues/43548).

This is the primary use case: start the bar on route departure, then let it finish automatically when the new App Router page commits.

**1. Add the React wrapper** (handles SSR rendering):

```bash
npm install @vctqs1/nav-progress-bar-react
```

**2. Add to your root layout** (`app/layout.tsx`):

```tsx
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

**3. Create `instrumentation-client.ts`** at the project root:

```ts
import { registerNavProgressBar, getNavProgressBar } from '@vctqs1/nav-progress-bar';

registerNavProgressBar();

export function onRouterTransitionStart(
  url: string,
  navigationType: 'push' | 'replace' | 'traverse',
) {
  getNavProgressBar()?.start();
}
```

How the bar completes without a "done" callback — Next.js calls `history.pushState()` to update the URL, which fires the browser `navigatesuccess` event as a side effect. The web component listens for this internally and calls `finish()` automatically.

```
User clicks <Link>
  → "navigate" fires instantly   → bar starts  (0ms)
  → Next.js fetches RSC payload
  → React patches the tree
  → history.pushState() finalises
  → "navigatesuccess" fires      → bar finishes
```

> 🎬 **Demo** — [watch the bar in action with Next.js App Router →](https://github.com/vctqs1/nav-progress-bar#nextjs-app-router)

---

### Nuxt

```ts
// plugins/nav-progress-bar.client.ts
import { registerNavProgressBar, getNavProgressBar } from '@vctqs1/nav-progress-bar';

export default defineNuxtPlugin(() => {
  registerNavProgressBar();

  const router = useRouter();
  router.beforeEach(() => getNavProgressBar()?.start());
  // finish() is handled automatically by navigatesuccess
});
```

```html
<!-- app.vue -->
<template>
  <div>
    <vctqs1-nav-progress-bar></vctqs1-nav-progress-bar>
    <NuxtPage />
  </div>
</template>
```

---

### SvelteKit

```ts
// src/hooks.client.ts
import { registerNavProgressBar } from '@vctqs1/nav-progress-bar';
registerNavProgressBar();
```

```svelte
<!-- src/routes/+layout.svelte -->
<vctqs1-nav-progress-bar></vctqs1-nav-progress-bar>
<slot />
```

---

### Astro

```astro
---
// src/layouts/BaseLayout.astro
---
<html>
  <body>
    <vctqs1-nav-progress-bar></vctqs1-nav-progress-bar>
    <slot />
    <script>
      import { registerNavProgressBar } from '@vctqs1/nav-progress-bar';
      registerNavProgressBar();
    </script>
  </body>
</html>
```

---

### Manual start (non-Next.js)

Most SPA routers trigger browser navigation events automatically, so the bar starts/finishes on its own after `registerNavProgressBar()`.
If you need to force an immediate start signal, add a guarded listener:

```ts
import { registerNavProgressBar, getNavProgressBar } from '@vctqs1/nav-progress-bar';

registerNavProgressBar();

const nav = (globalThis as { navigation?: EventTarget }).navigation;
if (nav?.addEventListener) {
  nav.addEventListener('navigate', () => getNavProgressBar()?.start());
}
```

---

### Vanilla HTML (snippet)

```html
<script type="module">
  import { registerNavProgressBar } from '@vctqs1/nav-progress-bar';
  registerNavProgressBar();
</script>

<vctqs1-nav-progress-bar></vctqs1-nav-progress-bar>
```

### ES Module

```ts
import { registerNavProgressBar, getNavProgressBar } from '@vctqs1/nav-progress-bar';

registerNavProgressBar();

// The bar auto-starts on navigate and auto-finishes on navigatesuccess.
// You can also control it manually:
getNavProgressBar()?.start();
getNavProgressBar()?.finish();
```

---

### Vanilla HTML (full page)

```html
<!DOCTYPE html>
<html>
  <body>
    <vctqs1-nav-progress-bar></vctqs1-nav-progress-bar>

    <script type="module">
      import { registerNavProgressBar } from '@vctqs1/nav-progress-bar';
      registerNavProgressBar();
    </script>
  </body>
</html>
```

## Color Configuration

Two formats are supported for the `primary` attribute:

```html
<!-- Raw hex or any CSS color -->
<vctqs1-nav-progress-bar primary="#006bde"></vctqs1-nav-progress-bar>

<!-- CSS custom property (resolved against document styles) -->
<vctqs1-nav-progress-bar primary="--your-brand-color"></vctqs1-nav-progress-bar>
```

When a CSS variable name is passed, the component wraps it in `var(--token, fallback)` inside its Shadow DOM — it inherits custom properties from the document since Shadow DOM does not isolate inherited CSS variables.

### Priority Order

1. HTML attribute `primary="..."` — runtime, per-element (highest)
2. `registerNavProgressBar({ primary: '...' })` — build-time default
3. Hardcoded fallback `#006bde` (lowest)

## API

### `registerNavProgressBar(options?)`

Registers the `<vctqs1-nav-progress-bar>` custom element. Safe to call multiple times — subsequent calls are no-ops. Skips registration entirely if the browser does not support the Navigation API.

```ts
registerNavProgressBar();
registerNavProgressBar({ primary: '#fff' });
```

### `getNavProgressBar()`

Returns the first `<vctqs1-nav-progress-bar>` element in the document, or `null`.

```ts
getNavProgressBar()?.start();
```

### Instance Methods

| Method | Description |
|--------|-------------|
| `start()` | Begins indeterminate progress animation, returns `this` |
| `finish()` | Completes bar to 100% then fades out, returns `this` |

### HTML Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `primary` | color or `--css-var` | `#006bde` | Bar fill color |

## How It Works

The component uses an asymptotic easing approach: every 200ms it moves 8% of the remaining distance toward 85%, never quite reaching it. When `finish()` is called, width jumps to 100% then fades out over 700ms. This gives the appearance of continuous progress without knowing actual load time.

All styling uses two `CSSStyleSheet` objects via `adoptedStyleSheets`:

- **Color sheet** — static rules for color, layout, and transitions. Rebuilt on attribute change.
- **Progress sheet** — single `.bar { width: N%; }` rule, rewritten via `replaceSync` on every tick. No rule accumulation, always authoritative.

## Browser Support

Requires the [Navigation API](https://caniuse.com/mdn-api_navigation) — Chrome 102+, Edge 102+. Firefox and Safari do not support it yet; registration is skipped gracefully in unsupported browsers (no errors, no stuck bar).

## Debugging

Test manually in the browser console:

```js
document.querySelector('vctqs1-nav-progress-bar').start();
document.querySelector('vctqs1-nav-progress-bar').finish();
```

Inspect the Shadow DOM in DevTools — Chrome and Firefox both expose Shadow DOM roots in the Elements panel under the `<vctqs1-nav-progress-bar>` element.

## License

MIT
