
// Rendered inside the @modal parallel slot for /products/[id]
export default async function ProductModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="info-panel">
      <h2>Parallel Slot: <code>@modal</code> -- Product {id}</h2>
    </div>
  );
}
