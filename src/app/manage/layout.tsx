import { Plus } from "lucide-react";
import Link from "next/link";
import { Layout } from "~/components/ui/layout";

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <h2 className="text-2xl font-bold">Your Bars</h2>
      {children}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/create" className="border-2 border-foreground p-4">
          <span className="flex items-center gap-3 align-middle text-xl font-bold">
            <Plus />
            Add new bar
          </span>
        </Link>
      </div>
    </Layout>
  );
}
