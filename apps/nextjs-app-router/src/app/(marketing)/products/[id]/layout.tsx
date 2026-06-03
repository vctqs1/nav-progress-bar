
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Simulate a slow data fetch to make the progress bar visible
async function getProduct(id: string) {
  await new Promise((r) => setTimeout(r, id === '2' ? 7000 : 3000));
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
        <Link prefetch={false} href={`/products/${id}/info`}>ℹ️ View Info</Link>
      </p>
      {id === '2' && (
        <p className="warning-delay">⚠️ This page has a 7s artificial delay — watch the bar!</p>
      )}
      {children}
      {modal}
    </div>
  );
}
