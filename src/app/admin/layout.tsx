import { Layout } from "~/components/ui/layout";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <h1 className="text-4xl font-bold">Admin</h1>

      <Table>
        <TableCaption>Verify bars</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Bar name</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Postcode</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </Layout>
  );
}
