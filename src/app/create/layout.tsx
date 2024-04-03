import { Layout } from "~/components/ui/layout";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <h2 className="text-center text-2xl font-bold">Tell us about your bar</h2>
      {children}
    </Layout>
  );
}
