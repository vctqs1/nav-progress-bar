
// Rendered inside the @modal parallel slot for /products/[id]/info
export default async function ProductInfoModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="info-panel">
      <h2>Parallel Slot: <code>@modal/info</code> -- Product {id}</h2>
    </div>
  );
}
