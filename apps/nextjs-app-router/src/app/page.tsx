import Link from 'next/link';
import styles from './page.module.css';
import UseRouterDemo from '../components/use-router-demo';

export default function Index() {
  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="hero-title">
        <p className={styles.kicker}>
          Next.js App Router demo and package docs
        </p>
        <h1 id="hero-title">
          Show route progress with a CSP-safe bar built for Next.js App Router
          and React.
        </h1>
        <p className={styles.heroCopy}>
          Use{' '}
          <code className={styles.inlineCode}>
            @vctqs1/nav-progress-bar-react
          </code>{' '}
          in Next.js App Router for the simplest setup. Use{' '}
          <code className={styles.inlineCode}>@vctqs1/nav-progress-bar</code>{' '}
          directly when you want the browser Navigation API wiring in a plain
          React app or vanilla page.
        </p>
        <div className={styles.heroLinks}>
          <Link href="#quick-start">Quick start</Link>
          <Link href="#configuration">Configuration</Link>
          <Link href="#routes">Try the demo</Link>
        </div>
      </section>

      <section
        id="introduction"
        className={styles.mediaCard}
        aria-labelledby="demo-title"
      >
        <h2 id="demo-title">Live demo</h2>
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
          The bar starts on navigation, advances while the route is loading, and
          fades out on completion.
        </p>
      </section>

      <section
        id="quick-start"
        className={styles.section}
        aria-labelledby="quick-start-title"
      >
        <h2 id="quick-start-title">Quick start</h2>
        <div className={styles.grid}>
          <article className={styles.card}>
            <h3>React / Next.js App Router</h3>
            <p>
              Recommended for Next.js App Router. The wrapper renders the
              element and keeps the transition hook in your app layer.
            </p>
            <pre className={styles.codeBlock}>
              <code>pnpm add @vctqs1/nav-progress-bar-react</code>
            </pre>
            <pre className={styles.codeBlock}>
              <code>{`import NavProgressBar from '@vctqs1/nav-progress-bar-react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <NavProgressBar primary="#3fffa8" height="3px" />
        {children}
      </body>
    </html>
  );
}`}</code>
            </pre>
            <p>
              <code className={styles.inlineCode}>start()</code> belongs in{' '}
              <code>instrumentation-client.ts</code> or your own transition hook
              for Next.js App Router.
            </p>
            <pre className={styles.codeBlock}>
              <code>{`import {
  registerNavProgressBar,
  getNavProgressBar,
} from '@vctqs1/nav-progress-bar-react';

registerNavProgressBar();

export function onRouterTransitionStart(
  url: string,
  navigationType: 'push' | 'replace' | 'traverse',
) {
  console.log(\`Navigation started: \${navigationType} to \${url}\`);
  getNavProgressBar()?.start();
}`}</code>
            </pre>
          </article>

          <article className={styles.card}>
            <h3>Core package</h3>
            <p>
              Use the core element when you want browser navigation events to
              drive the bar automatically.
            </p>
            <pre className={styles.codeBlock}>
              <code>pnpm add @vctqs1/nav-progress-bar</code>
            </pre>
            <pre className={styles.codeBlock}>
              <code>{`import { registerNavProgressBar, getNavProgressBar } from '@vctqs1/nav-progress-bar';

registerNavProgressBar({ primary: '#006bde', height: '3px' });

const nav = (globalThis as { navigation?: EventTarget }).navigation;
if (nav?.addEventListener) {
  nav.addEventListener('navigate', () => getNavProgressBar()?.start());
}`}</code>
            </pre>
          </article>
        </div>
      </section>

      <section
        id="lifecycle"
        className={styles.section}
        aria-labelledby="lifecycle-title"
      >
        <h2 id="lifecycle-title">Navigation lifecycle</h2>


        <p className={styles.lifecycleIntro}>
          The browser Navigation API emits lifecycle events automatically.
          Next.js App Router requires manual control.
        </p>

        <div className={styles.callout}>
          <h3>Why does Next.js require manual control?</h3>
          <p>
            The browser Navigation API emits <code className={styles.inlineCode}>navigate</code> and{" "}
            <code className={styles.inlineCode}>navigatesuccess</code> events automatically. Next.js App Router
            does not expose equivalent lifecycle events, so applications must call{" "}
            <code className={styles.inlineCode}>start()</code> and <code className={styles.inlineCode}>finish()</code> manually.
          </p>
        </div>

        <br />

        <div className={styles.lifecycleGrid}>
          <article className={styles.lifecycleCard}>
            <header>
              <h3>Browser Navigation API</h3>
              <span className={styles.badge}>Automatic</span>
            </header>

            <div className={styles.flow}>
              <div className={styles.step}>
                <code>navigate</code>
              </div>

              <div className={styles.arrow}>↓</div>

              <div className={styles.step}>Progress bar starts</div>

              <div className={styles.arrow}>↓</div>

              <div className={styles.step}>Page transition</div>

              <div className={styles.arrow}>↓</div>

              <div className={styles.step}>
                <code>navigatesuccess</code>
              </div>

              <div className={styles.arrow}>↓</div>

              <div className={styles.step}>Progress bar finishes</div>
            </div>
          </article>

          <article className={styles.lifecycleCard}>
            <header>
              <h3>Next.js App Router</h3>
              <span className={styles.badgeManual}>Manual</span>
            </header>

            <div className={styles.flow}>
              <div className={styles.step}>
                <code>router.push()</code>
              </div>

              <div className={styles.arrow}>↓</div>

              <div className={styles.step}>
                <code>start() -- need call inside onRouterTransitionStart</code>
              </div>

              <div className={styles.arrow}>↓</div>

              <div className={styles.step}>RSC / Route loading</div>

              <div className={styles.arrow}>↓</div>

              <div className={styles.step}>Route settles</div>

              <div className={styles.arrow}>↓</div>

              <div className={styles.step}>
                <code>finish() -- do not call manually as it already added automatically</code>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section
        id="configuration"
        className={styles.section}
        aria-labelledby="config-title"
      >
        <h2 id="config-title">Configuration</h2>
        <p>
          Set color and height either on the element or during registration.
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.configTable}>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Default</th>
                <th scope="col">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">primary</th>
                <td>
                  <code className={styles.inlineCode}>
                    var(--token, #006bde)
                  </code>
                </td>
                <td>
                  Pass a CSS variable token like{' '}
                  <code className={styles.inlineCode}>--brand-color</code> or{' '}
                  <code className={styles.inlineCode}>#HEX</code> to keep the
                  bar themeable.
                </td>
              </tr>
              <tr>
                <th scope="row">height</th>
                <td>
                  <code className={styles.inlineCode}>3px</code>
                </td>
                <td>
                  Use{' '}
                  <code className={styles.inlineCode}>height="--token"</code> if
                  you want a CSS variable fallback.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className={styles.note}>
          Use{' '}
          <code className={styles.inlineCode}>
            @vctqs1/nav-progress-bar-react
          </code>{' '}
          for App Router projects and{' '}
          <code className={styles.inlineCode}>@vctqs1/nav-progress-bar</code>{' '}
          when you want the underlying web component directly.
        </p>
      </section>

      <section
        id="routes"
        className={styles.section}
        aria-labelledby="routes-title"
      >
        <h2 id="routes-title">Try the demo routes</h2>
        <p>
          These links trigger route transitions so you can watch the progress
          bar settle against real navigation.
        </p>
        <ul className={styles.routeList}>
          <li>
            <Link prefetch={false} href="/about">
              About
            </Link>{' '}
            - instant feedback
          </li>
          <li>
            <Link prefetch={false} href="/products/1">
              Product 1
            </Link>{' '}
            - 3s delay
          </li>
          <li>
            <Link prefetch={false} href="/products/2">
              Product 2
            </Link>{' '}
            - 7s delay
          </li>
        </ul>
      </section>

      <section
        id="resources"
        className={styles.section}
        aria-labelledby="resources-title"
      >
        <h2 id="resources-title">Resources</h2>
        <p>
          Package links and project references live here instead of inside the
          demo section.
        </p>
        <div className={styles.resourceGrid}>
          <Link
            className={styles.resourceCard}
            href="https://www.npmjs.com/package/@vctqs1/nav-progress-bar-react"
            target="_blank"
            rel="noopener"
          >
            <span className={styles.resourceBadge}>React</span>
            <span className={styles.resourceTitle}>
              @vctqs1/nav-progress-bar-react
            </span>
            <span className={styles.resourceText}>
              Install the wrapper for Next.js App Router.
            </span>
          </Link>
          <Link
            className={styles.resourceCard}
            href="https://www.npmjs.com/package/@vctqs1/nav-progress-bar"
            target="_blank"
            rel="noopener"
          >
            <span className={styles.resourceBadge}>Core</span>
            <span className={styles.resourceTitle}>
              @vctqs1/nav-progress-bar
            </span>
            <span className={styles.resourceText}>
              Use the underlying web component directly.
            </span>
          </Link>
          <Link
            className={styles.resourceCard}
            href="https://github.com/vctqs1/nav-progress-bar"
            target="_blank"
            rel="noopener"
          >
            <span className={styles.resourceBadge}>GitHub</span>
            <span className={styles.resourceTitle}>Source repo</span>
            <span className={styles.resourceText}>
              View the code, issues, and release history.
            </span>
          </Link>
          <Link
            className={styles.resourceCard}
            href="https://www.linkedin.com/in/thu-vo-cat-79143b181/"
            target="_blank"
            rel="noopener"
          >
            <span className={styles.resourceBadge}>LinkedIn</span>
            <span className={styles.resourceTitle}>Thu Vo Cat</span>
            <span className={styles.resourceText}>
              Connect with me on LinkedIn.
            </span>
          </Link>
        </div>
      </section>

      <UseRouterDemo />
    </main>
  );
}
