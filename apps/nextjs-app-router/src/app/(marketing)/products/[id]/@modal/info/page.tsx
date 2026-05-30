import Link from 'next/link';

// Rendered inside the @modal parallel slot for /products/[id]/info
export default async function ProductInfoModal({ params }: { params: Promise<{ id: string }> }) {
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
      <p>This panel is rendered via a <strong>parallel route</strong> (<code>@modal</code> slot).</p>
      <p style={{ marginTop: '0.5rem' }}>
        <Link href={`/products/${id}`}>✕ Close</Link>
      </p>
    </div>
  );
}
