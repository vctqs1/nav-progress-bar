export default function Loading() {
  return (
    <div className="loading-skeleton">
      <div className="loading-skeleton-title" />
      <div className="loading-skeleton-line" />
      <div className="loading-skeleton-line short" />
      <p className="loading-copy">⏳ loading.tsx — Suspense skeleton while RSC loads…</p>
    </div>
  );
}
