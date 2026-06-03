'use client';

import { useRouter } from 'next/navigation';

import styles from './styles.module.css';

export default function UseRouterDemo() {
  const router = useRouter();

  return (
    <section
      className={styles.routerDemo}
      aria-labelledby="use-router-demo-title"
    >
      <h2 id="use-router-demo-title" className={styles.routerDemoTitle}>
        Programmatic Navigation Demo (useRouter)
      </h2>
      <p className={styles.routerDemoText}>
        Click any action below to trigger route transitions and watch the top
        progress bar.
      </p>
      <div className={styles.routerActions}>
        <button type="button" onClick={() => router.back()}>
          router.back()
        </button>
        <button type="button" onClick={() => router.forward()}>
          router.forward()
        </button>
        <button type="button" onClick={() => router.push('/about')}>
          router.push('/about')
        </button>
        <button type="button" onClick={() => router.replace('/about')}>
          router.replace('/about')
        </button>
        <button type="button" onClick={() => router.push('/products/1')}>
          router.push('/products/1')
        </button>
        <button type="button" onClick={() => router.push('/products/1/info')}>
          router.push('/products/1/info')
        </button>
        <button type="button" onClick={() => router.replace('/products/2')}>
          router.replace('/products/2')
        </button>
        <button
          type="button"
          onClick={() => router.replace('/products/2/info')}
        >
          router.replace('/products/2/info')
        </button>
      </div>
    </section>
  );
}
