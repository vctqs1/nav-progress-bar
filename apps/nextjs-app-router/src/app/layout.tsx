import './global.css';

import NavProgressBar from '@vctqs1/nav-progress-bar-react';
import Link from 'next/link';

import UseRouterDemo from './use-router-demo';

export const metadata = {
  title: 'Next.js Toploader Demo | @vctqs1/nav-progress-bar',
  description:
    'Next.js toploader demo for App Router. A zero-dependency, CSP-safe navigation progress bar built as a native Web Component.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavProgressBar primary='#3fffa8' />
        <header className="app-nav">
          <nav aria-label="Primary" className="app-nav-inner">
            <Link prefetch={false} href="/">Home</Link>
            <Link prefetch={false} href="/about">About</Link>
            <Link prefetch={false} href="/products/1">Product 1</Link>
            <Link prefetch={false} href="/products/2">Product 2</Link>
            <Link prefetch={false} href="/products/3">Product 3</Link>
          </nav>
        </header>
        <main className="app-shell">
          {children}
          <UseRouterDemo />
        </main>
      </body>
    </html>
  );
}
