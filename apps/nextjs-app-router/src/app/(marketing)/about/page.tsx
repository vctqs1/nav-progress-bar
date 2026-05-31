
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function delay(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function AboutPage() {
  await delay(1500);

  return (
    <div>
      <h1>About</h1>
      <p>
        This app dogfoods <code>@vctqs1/nav-progress-bar</code> — a zero-dependency,
        CSP-safe progress bar that hooks into the browser Navigation API.
      </p>
    </div>
  );
}
