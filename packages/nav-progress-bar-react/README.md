# @vctqs1/nav-progress-bar-react

React wrapper for [`@vctqs1/nav-progress-bar`](https://www.npmjs.com/package/@vctqs1/nav-progress-bar) — a zero-dependency, CSP-safe top-of-page progress bar built as a native Web Component.

This package provides a thin React component that renders the `<vctqs1-nav-progress-bar>` custom element with proper TypeScript JSX types and SSR support via Declarative Shadow DOM.

## Table of Contents

- [Installation](#installation)
- [Peer Dependencies](#peer-dependencies)
- [Quick Start](#quick-start)
  - [Next.js App Router](#nextjs-app-router-recommended-setup)
  - [Custom color](#custom-color)
  - [React SPA (Vite, CRA, etc.)](#react-spa-vite-cra-etc)
- [Props](#props)
- [How SSR Works](#how-ssr-works)
- [Why a Separate Package?](#why-a-separate-package)
- [Related](#related)
- [License](#license)

## Installation

```bash
npm install @vctqs1/nav-progress-bar @vctqs1/nav-progress-bar-react
# or
pnpm add @vctqs1/nav-progress-bar @vctqs1/nav-progress-bar-react
```

## Peer Dependencies

| Package | Version |
|---------|---------|
| `react` | `>=18.0.0` |
| `@vctqs1/nav-progress-bar` | `>=1.0.0` |

## Quick Start

### Next.js App Router (recommended setup)

**1. Add to root layout** (`app/layout.tsx`):

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

**2. Create `instrumentation-client.ts`** at the project root:

```ts
import { registerNavProgressBar, getNavProgressBar } from '@vctqs1/nav-progress-bar-react';

registerNavProgressBar();

export function onRouterTransitionStart(
  url: string,
  navigationType: 'push' | 'replace' | 'traverse',
) {
  getNavProgressBar()?.start();
}
```

That's it. The bar starts on every route departure and finishes automatically when the new page commits.

> 🎬 **Demo** — watch the bar in action with Next.js App Router:

https://github.com/user-attachments/assets/d7537ef6-81a5-4c55-8884-900c9af06161

---

### Custom color

```tsx
<NavProgressBar primary="#ff6600" />
```

```tsx
<NavProgressBar primary="--your-brand-color" />
```

---

### React SPA (Vite, CRA, etc.)

For non-SSR React apps, register and place the component anywhere above your routes:

```tsx
// main.tsx
import { registerNavProgressBar } from '@vctqs1/nav-progress-bar-react';
registerNavProgressBar();
```

```tsx
// App.tsx
import NavProgressBar from '@vctqs1/nav-progress-bar-react';

export default function App() {
  return (
    <>
      <NavProgressBar />
      <RouterProvider router={router} />
    </>
  );
}
```

In a plain SPA the bar auto-starts and auto-finishes via the browser Navigation API — no extra wiring needed.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `primary` | `string` | `#006bde` | Bar color — accepts any CSS color or a `--css-variable` name |

## How SSR Works

The component renders a `<vctqs1-nav-progress-bar>` custom element server-side. It uses `<template shadowrootmode="open">` (Declarative Shadow DOM) to pre-render the bar div so the element has visual structure before JavaScript runs — preventing a flash of invisible bar during hydration.

When the custom element upgrades in the browser it detects the existing shadow root:

```ts
const shadow = this.shadowRoot ?? this.attachShadow({ mode: 'open' });
```

And skips creating a duplicate bar div if one already exists:

```ts
if (!shadow.querySelector('.bar')) {
  const bar = document.createElement('div');
  bar.className = 'bar';
  shadow.append(bar);
}
```

## Why a Separate Package?

The core `@vctqs1/nav-progress-bar` package has zero dependencies and works in any environment. This wrapper exists solely to:

1. Provide correct TypeScript JSX types for `<vctqs1-nav-progress-bar>` so React doesn't complain about an unknown element
2. Ship a typed React component with a clean import
3. Handle the Declarative Shadow DOM template for SSR without pulling React into the core package

## Related

- [`@vctqs1/nav-progress-bar`](https://www.npmjs.com/package/@vctqs1/nav-progress-bar) — core Web Component, framework-agnostic
- [Next.js issue #43548](https://github.com/vercel/next.js/issues/43548) — the problem this solves

## License

MIT
