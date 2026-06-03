// Standalone page for direct navigation to /products/[id]/info
export default async function ProductInfoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="info-panel">
      <h2>Parallel Slot: <code>info</code> -- Product {id}</h2>
      <p>This panel is rendered via a <strong>parallel route</strong></p>
    </div>
  );
}
