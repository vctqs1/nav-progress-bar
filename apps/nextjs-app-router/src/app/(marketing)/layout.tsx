import UseRouterDemo from "@/components/use-router-demo";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="marketing-shell">{children}<UseRouterDemo/></div>;
}
