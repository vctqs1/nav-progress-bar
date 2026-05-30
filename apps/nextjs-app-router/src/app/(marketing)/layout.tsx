export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      {children}
    </div>
  );
}
