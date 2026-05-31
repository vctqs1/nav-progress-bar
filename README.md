# nav-progress-bar

Monorepo for the `@vctqs1/nav-progress-bar` progress bar and its React wrapper. The core package is a zero-dependency, CSP-safe Web Component that works anywhere the browser supports the Navigation API. The React package adds JSX typing and SSR-friendly rendering for Next.js and other React apps.

> Live demo: https://nav-progress-bar.vercel.app/

> Demo video:

<video src="https://github.com/user-attachments/assets/4144ed95-8c25-4aa9-b804-905ac24805b4" controls width="100%"></video>

## Packages

| Package | Description |
|---|---|
| [`@vctqs1/nav-progress-bar`](./packages/nav-progress-bar/README.md) | Core Web Component, framework-agnostic, zero dependencies. |
| [`@vctqs1/nav-progress-bar-react`](./packages/nav-progress-bar-react/README.md) | React wrapper with JSX types and SSR-friendly `<NavProgressBar />`. |

## What’s In The Repo

- `packages/nav-progress-bar` contains the custom element, lifecycle, and browser API integration.
- `packages/nav-progress-bar-react` re-exports the core API and provides the React component wrapper.
- `apps/nextjs-app-router` is the demo app that shows the progress bar alongside App Router loading states, including the artificial product delay routes.

## Quick Start

### Core package

```bash
pnpm add @vctqs1/nav-progress-bar
```

```ts
import { registerNavProgressBar } from '@vctqs1/nav-progress-bar';

registerNavProgressBar();
```

### React package

```bash
pnpm add @vctqs1/nav-progress-bar @vctqs1/nav-progress-bar-react
```

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

## Development

```bash
pnpm install
pnpm nx run-many --target=build
pnpm nx run-many --target=test
pnpm nx build nav-progress-bar
pnpm nx build nav-progress-bar-react
pnpm nx test nav-progress-bar
pnpm nx test nav-progress-bar-react
```

## More Details

- [Core package README](./packages/nav-progress-bar/README.md)
- [React package README](./packages/nav-progress-bar-react/README.md)

## License

MIT
