# @vctqs1/nav-progress-bar

A zero-dependency, CSP-safe top-of-page progress bar built as a native Web Component. It works in any framework or in plain HTML, and it is especially useful for Next.js App Router where `loading.tsx` does not appear until the RSC payload arrives.

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

registerNavProgressBar();
getNavProgressBar()?.start();
```

```html
<vctqs1-nav-progress-bar primary="#006bde"></vctqs1-nav-progress-bar>
```

If you want to start it manually from browser navigation events, feature-detect the Navigation API:

```ts
const nav = (globalThis as { navigation?: EventTarget }).navigation;

if (nav?.addEventListener) {
  nav.addEventListener('navigate', () => getNavProgressBar()?.start());
}
```

### Next.js App Router

The bar fills the gap before `loading.tsx` becomes visible. The demo app in `apps/nextjs-app-router` uses a delayed product route to show the bar before the loading skeleton takes over.

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
- Navigation API lifecycle handling for `navigate` and `navigatesuccess`
- Optional `primary` color override via attribute or registration options

## API

### `registerNavProgressBar(options?)`

Registers the `<vctqs1-nav-progress-bar>` custom element. Calling it more than once is safe. Registration is skipped if the browser does not support the Navigation API.

```ts
registerNavProgressBar();
registerNavProgressBar({ primary: '#fff' });
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

### Attribute

| Attribute | Type | Default | Description |
|---|---|---|---|
| `primary` | hex color or `--css-variable` | `#006bde` | Bar color. |

## Color Configuration

```html
<vctqs1-nav-progress-bar primary="#006bde"></vctqs1-nav-progress-bar>
<vctqs1-nav-progress-bar primary="--your-brand-color"></vctqs1-nav-progress-bar>
```

The component resolves `primary="--token"` to `var(--token, #006bde)` inside its shadow root, so it can inherit document-level CSS custom properties.

Priority order:

1. HTML attribute `primary="..."`
2. `registerNavProgressBar({ primary: '...' })`
3. Hardcoded fallback `#006bde`

## How It Works

The component uses Shadow DOM and two constructable stylesheets:

- A layout sheet for the fixed top-of-page positioning
- A color sheet for the active/completed states
- A progress sheet that rewrites only the width rule during animation

Progress eases toward 85% every 200ms and finishes at 100% before fading out. The timing is intentionally indeterminate so the bar feels responsive without pretending to know exact load progress.

## Browser Support

Requires the [Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API). Chrome and Edge support it; unsupported browsers skip registration gracefully.

## Framework Notes

The core package is framework-agnostic. Common patterns:

- Next.js App Router: render the element in `app/layout.tsx` and start it from `instrumentation-client.ts`
- React SPA: register once and call `start()` from your router transition hooks if needed
- Vanilla HTML: add the custom element to the page and call `registerNavProgressBar()` in a module script

## Development

```bash
pnpm install
pnpm nx build nav-progress-bar
pnpm nx test nav-progress-bar
```

## License

MIT

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
