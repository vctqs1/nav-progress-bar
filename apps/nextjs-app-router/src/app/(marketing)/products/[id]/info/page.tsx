import Link from 'next/link';

// Standalone page for direct navigation to /products/[id]/info
export default async function ProductInfoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div
      style={{
        marginTop: '1.5rem',
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: 8,
        background: '#f9f9f9',
      }}
    >
      <h2>Quick Info — Product {id}</h2>
      <p>
        This panel is rendered via a <strong>parallel route</strong> (
        <code>@modal</code> slot).
      </p>
      <p style={{ marginTop: '0.5rem' }}>
        <Link href={`/products/${id}`}>✕ Close</Link>
      </p>
    </div>
  );
}
