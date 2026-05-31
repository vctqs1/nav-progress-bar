
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function delay(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function HomePage() {
  await delay(1200);

  return (
    <div>
      <h1>Nav Progress Bar — Dogfood</h1>
    </div>
  );
}
