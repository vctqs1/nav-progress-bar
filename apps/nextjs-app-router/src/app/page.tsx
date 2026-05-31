import Link from 'next/link';
import styles from './page.module.css';

export default function Index() {
  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <h1>
              <span> Hello there  👋, </span>
              Welcome to @vctqs1/nav-progress-bar
            </h1>
          </div>

          <div id="introduction" className={`${styles.introduction} rounded shadow`}>
            <video
              className={styles.demoVideo}
              autoPlay
              loop
              muted
              playsInline
              controls
              preload="metadata"
              src="/nav-progress-bar-demo.mov"
            >
              Your browser does not support the video tag.
            </video>
            <p className={styles.caption}>
              Demo: instant route feedback with the navigation top progress bar.
            </p>
            <p className={styles.cspNote}>
              CSP test is enabled (`style-src 'self'`) to verify no inline styles are required.
            </p>
          </div>

          <div id="quick-start" className={`${styles.section} rounded shadow`}>
            <h2>Quick Start</h2>

            <h3>React / Next.js App Router</h3>
            <p>Install the React wrapper:</p>
            <pre className={styles.codeBlock}>
              <code>pnpm add @vctqs1/nav-progress-bar-react</code>
            </pre>

            <p>Add to your root layout:</p>
            <pre className={styles.codeBlock}>
              <code>{`// app/layout.tsx
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
}`}</code>
            </pre>

            <p>Create instrumentation client:</p>
            <pre className={styles.codeBlock}>
              <code>{`// instrumentation-client.ts
import { getNavProgressBar, registerNavProgressBar } from '@vctqs1/nav-progress-bar-react';

registerNavProgressBar();

// Next.js App Router hook
export function onRouterTransitionStart(
  url: string,
  navigationType: 'push' | 'replace' | 'traverse',
) {
  console.log(\`Navigation started: \${navigationType} to \${url}\`);
  getNavProgressBar()?.start();
}

// Or manually listen to Navigation API events
const nav = (globalThis as { navigation?: EventTarget }).navigation;
if (nav?.addEventListener) {
  nav.addEventListener('navigate', () => getNavProgressBar()?.start());
}`}</code>
            </pre>

            <h3>Vanilla / Any Framework</h3>
            <p>Install the core package:</p>
            <pre className={styles.codeBlock}>
              <code>pnpm add @vctqs1/nav-progress-bar</code>
            </pre>

            <p>Register and listen to navigation events:</p>
            <pre className={styles.codeBlock}>
              <code>{`import { registerNavProgressBar, getNavProgressBar } from '@vctqs1/nav-progress-bar';

registerNavProgressBar();

// Listen to browser navigation events
const nav = (globalThis as { navigation?: EventTarget }).navigation;
if (nav?.addEventListener) {
  nav.addEventListener('navigate', () => getNavProgressBar()?.start());
}`}</code>
            </pre>

            <p>
              <Link href="https://github.com/vctqs1/nav-progress-bar" target="_blank" rel="noopener">
                🐙 GitHub Repo
              </Link>
              {' • '}
              <Link href="https://www.npmjs.com/package/@vctqs1/nav-progress-bar-react" target="_blank" rel="noopener">
                ⚛️ React NPM Package
              </Link>
              {' • '}
              <Link href="https://www.npmjs.com/package/@vctqs1/nav-progress-bar" target="_blank" rel="noopener">
                🎯 Core NPM Package
              </Link>
            </p>
          </div>

          <div id="demo-routes" className={`${styles.section} rounded shadow`}>
            <h2>Try It Out</h2>
            <p>Navigate to these routes to see the progress bar in action:</p>
            <ul>
              <li>
                <Link href="/about">About</Link> — instant feedback
              </li>
              <li>
                <Link href="/products/1">Product 1</Link> — 2.2s delay
              </li>
              <li>
                <Link href="/products/3">Product 3</Link> — 7s delay (watch it fill!)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
