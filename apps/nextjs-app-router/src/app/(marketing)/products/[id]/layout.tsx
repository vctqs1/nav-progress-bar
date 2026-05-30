
import Link from 'next/link';

// Simulate a slow data fetch to make the progress bar visible
async function getProduct(id: string) {
  await new Promise((r) => setTimeout(r, id === '3' ? 5000 : 600));
  return { id, name: `Product ${id}`, price: `$${(Number(id) * 29).toFixed(2)}` };
}

export default async function ProductLayout({
  children,
  modal,
  params,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Price: {product.price}</p>
      <p>
        <Link href={`/products/${id}/info`}>ℹ️ View Info</Link>
      </p>
      {id === '3' && (
        <p style={{ color: 'orange' }}>⚠️ This page has a 5s artificial delay — watch the bar!</p>
      )}
      {modal}
      {children}
    </div>
  );
}
