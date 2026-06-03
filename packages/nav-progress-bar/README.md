# @vctqs1/nav-progress-bar

A zero-dependency, CSP-safe top-of-page progress bar built as a native Web Component.

Register the element once. In browsers that support the Navigation API, the component listens for `navigate` and `navigatesuccess` itself. For Next.js App Router, call `start()` from your transition hook because the route begins before the browser `navigate` signal is useful.

> Live demo: https://nav-progress-bar.vercel.app/

> Demo video:

<video src="https://github.com/user-attachments/assets/4144ed95-8c25-4aa9-b804-905ac24805b4" controls width="100%"></video>

## Installation

```bash
pnpm add @vctqs1/nav-progress-bar
```

## Quick Start

```ts
import { registerNavProgressBar, getNavProgressBar } from '@vctqs1/nav-progress-bar';

registerNavProgressBar({ primary: '#006bde', height: '3px' });
```

```html
<vctqs1-nav-progress-bar primary="#006bde"></vctqs1-nav-progress-bar>
```

If you want to start it yourself, feature-detect the Navigation API:

```ts
const nav = (globalThis as { navigation?: EventTarget }).navigation;

if (nav?.addEventListener) {
  nav.addEventListener('navigate', () => getNavProgressBar()?.start());
}
```

### Next.js App Router

For Next.js App Router, the React wrapper is the recommended entry point.

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
import { getNavProgressBar, registerNavProgressBar } from '@vctqs1/nav-progress-bar-react';

registerNavProgressBar();

export function onRouterTransitionStart() {
  getNavProgressBar()?.start();
}
```

## Features

- Zero dependencies
- CSP-safe styling via `adoptedStyleSheets`
- Declarative Shadow DOM support for SSR
- Automatic Navigation API wiring after registration in supported browsers
- Imperative `start()` and `finish()` when you want manual control
- Optional `primary` color and `height` overrides via attribute or registration options

## API

### `registerNavProgressBar(options?)`

Registers the `<vctqs1-nav-progress-bar>` custom element. Calling it more than once is safe.

```ts
registerNavProgressBar();
registerNavProgressBar({ primary: '#fff' });
registerNavProgressBar({ primary: '#fff', height: '4px' });
```

### `getNavProgressBar()`

Returns the first `<vctqs1-nav-progress-bar>` element in the document, or `null`.

```ts
getNavProgressBar()?.finish();
```

### Instance methods

| Method | Description |
|---|---|
| `start()` | Begins the indeterminate progress animation and returns `this`. |
| `finish()` | Completes the bar to 100% and fades it out, then returns `this`. |

### Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `primary` | hex color or `--css-variable` | `#006bde` | Bar color. |
| `height` | CSS length or `--css-variable` | `3px` | Bar height. |

## Style Configuration

```html
<vctqs1-nav-progress-bar primary="#006bde"></vctqs1-nav-progress-bar>
<vctqs1-nav-progress-bar primary="--your-brand-color"></vctqs1-nav-progress-bar>
<vctqs1-nav-progress-bar height="4px"></vctqs1-nav-progress-bar>
<vctqs1-nav-progress-bar height="--nav-bar-height"></vctqs1-nav-progress-bar>
```

When you pass a CSS custom property name, the component resolves it with a fallback inside its Shadow DOM:

- `primary="--token"` becomes `var(--token, #006bde)`
- `height="--token"` becomes `var(--token, 3px)`

Priority order:

1. HTML attribute `primary="..."` and `height="..."`
2. `registerNavProgressBar({ primary: '...', height: '...' })`
3. Hardcoded fallbacks `#006bde` and `3px`

## How It Works

The component uses Shadow DOM and two constructable stylesheets:

- A layout sheet for the fixed top-of-page positioning
- A color sheet for the active and completed states
- A progress sheet that rewrites only the width rule during animation

Progress eases toward 85% every 200ms and finishes at 100% before fading out. The component handles browser navigation automatically when the Navigation API is available. Next.js App Router still calls `start()` from its own transition hook.

## Browser Support

Requires the [Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API). Chrome and Edge support it; unsupported browsers skip registration gracefully.

## Framework Notes

- Next.js App Router: render the React wrapper in `app/layout.tsx` and call `start()` from `instrumentation-client.ts` or your own router hook
- React SPA: register once and let the Navigation API listeners drive the bar automatically
- Vanilla HTML: add the custom element to the page and call `registerNavProgressBar()` in a module script

## Development

```bash
pnpm install
pnpm nx build nav-progress-bar
pnpm nx test nav-progress-bar
```

## License

MIT