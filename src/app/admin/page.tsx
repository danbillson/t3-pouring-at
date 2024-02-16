import { TableCell, TableRow } from "~/components/ui/table";
import { getAllUnverified } from "~/db/queries";
import { VerifyBar } from "./verify-bar";

export async function AdminPage() {
  const bars = await getAllUnverified();
  if (!bars || bars.length === 0) {
    return (
      <TableRow>
        <TableCell className="font-medium">All clear 😁</TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {bars.map((bar) => (
        <VerifyBar key={bar.id} bar={bar} />
      ))}
    </>
  );
}
