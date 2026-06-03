import './global.css';

import NavProgressBar from '@vctqs1/nav-progress-bar-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://nav-progress-bar.vercel.app'),
  title: {
    default: '@vctqs1/nav-progress-bar-react',
    template: '%s | @vctqs1/nav-progress-bar-react',
  },
  description:
    'A zero-dependency, CSP-safe navigation progress bar for Next.js App Router. The React wrapper is the recommended entry point, while the core package powers framework-agnostic usage.',
  keywords: [
    '@vctqs1/nav-progress-bar-react',
    '@vctqs1/nav-progress-bar',
    'nextjs app router progress bar',
    'nav-progress-bar-react',
    'nav-progress-bar',
    'navigation progress bar',
    'csp-safe web component',
    'top loader',
    'route transition loader',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '@vctqs1/nav-progress-bar-react',
    description:
      'A zero-dependency, CSP-safe navigation progress bar for Next.js App Router, React, and plain HTML.',
    url: '/',
    siteName: '@vctqs1/nav-progress-bar-react',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '@vctqs1/nav-progress-bar-react',
    description:
      'A zero-dependency, CSP-safe navigation progress bar for Next.js App Router, React, and plain HTML.',
  },
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
        </main>
      </body>
    </html>
  );
}
