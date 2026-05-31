import Link from 'next/link';

// Standalone page for direct navigation to /products/[id]/info
export default async function ProductInfoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="info-panel">
      <h2>Quick Info — Product {id}</h2>
      <p>
        This panel is rendered via a <strong>parallel route</strong> (
        <code>@modal</code> slot).
      </p>
      <p className="info-close-link">
        <Link href={`/products/${id}`}>✕ Close</Link>
      </p>
    </div>
  );
}
