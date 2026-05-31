# @vctqs1/nav-progress-bar-react

React wrapper for [`@vctqs1/nav-progress-bar`](https://www.npmjs.com/package/@vctqs1/nav-progress-bar). It renders the `<vctqs1-nav-progress-bar>` custom element, re-exports the core API, and adds JSX typing so React and Next.js App Router can use it without extra setup.

> Live demo: https://nav-progress-bar.vercel.app/

> Demo video:

<video src="https://github.com/user-attachments/assets/4144ed95-8c25-4aa9-b804-905ac24805b4" controls width="100%"></video>

## Installation

```bash
pnpm add @vctqs1/nav-progress-bar @vctqs1/nav-progress-bar-react
```

## Quick Start

### Next.js App Router

```tsx
// app/layout.tsx
import NavProgressBar from '@vctqs1/nav-progress-bar-react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <NavProgressBar primary="#3fffa8" />
        {children}
      </body>
    </html>
  );
}
```

```ts
// instrumentation-client.ts
import { getNavProgressBar, registerNavProgressBar } from '@vctqs1/nav-progress-bar-react';

registerNavProgressBar();

export function onRouterTransitionStart() {
  getNavProgressBar()?.start();
}
```

In the demo app, product routes intentionally delay their server response so you can see the progress bar appear before the route-level `loading.tsx` fallback.

### React SPA

```tsx
import { useEffect } from 'react';
import NavProgressBar, { getNavProgressBar, registerNavProgressBar } from '@vctqs1/nav-progress-bar-react';

registerNavProgressBar();

export default function App() {
  useEffect(() => {
    const nav = (globalThis as { navigation?: EventTarget }).navigation;
    if (!nav?.addEventListener) return;
    nav.addEventListener('navigate', () => getNavProgressBar()?.start());
  }, []);

  return (
    <>
      <NavProgressBar />
      <main>{/* routes */}</main>
    </>
  );
}
```

## Why This Package Exists

The core package is framework-agnostic. This wrapper exists to make React usage feel native:

1. It renders the custom element from JSX.
2. It ships JSX types so TypeScript accepts `<vctqs1-nav-progress-bar>`.
3. It keeps SSR-friendly declarative shadow DOM support available without forcing React into the core package.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `primary` | `string` | `#006bde` | Bar color. Accepts a hex color or a CSS custom property name like `--brand-color`. |

## loading.tsx vs NavProgressBar

`loading.tsx` only appears after the server responds. The progress bar starts earlier, at route departure, so the user sees immediate feedback while the App Router is still waiting on RSC data.

```tsx
// app/products/[id]/loading.tsx
export default function Loading() {
  return <p>Loading product…</p>;
}
```

That is why the demo uses a delayed product route: the bar should show first, then the loading skeleton should take over, then the page content should render.

## SSR

The wrapper renders the custom element server-side, and the underlying component reuses declarative shadow DOM during hydration. That avoids the flash you would get from mounting an empty custom element and filling it later in the browser.

## Related

- [Core package README](../nav-progress-bar/README.md)
- [Next.js issue #43548](https://github.com/vercel/next.js/issues/43548)

## License

MIT

The core `@vctqs1/nav-progress-bar` package has zero dependencies and works in any environment. This wrapper exists solely to:

1. Provide correct TypeScript JSX types for `<vctqs1-nav-progress-bar>` so React doesn't complain about an unknown element
2. Ship a typed React component with a clean import
3. Handle the Declarative Shadow DOM template for SSR without pulling React into the core package

## Related

- [`@vctqs1/nav-progress-bar`](https://www.npmjs.com/package/@vctqs1/nav-progress-bar) — core Web Component, framework-agnostic
- [Next.js issue #43548](https://github.com/vercel/next.js/issues/43548) — the problem this solves

## License

MIT
