import Link from 'next/link';

// Rendered inside the @modal parallel slot for /products/[id]/info
export default async function ProductInfoModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="info-panel">
      <h2>Quick Info — Product {id}</h2>
      <p>This panel is rendered via a <strong>parallel route</strong> (<code>@modal</code> slot).</p>
      <p className="info-close-link">
        <Link href={`/products/${id}`}>✕ Close</Link>
      </p>
    </div>
  );
}
