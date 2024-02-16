"use client";
import { TableCell, TableRow } from "~/components/ui/table";
import type { Bar, BarStaff } from "~/db/schema";
import { Button } from "~/components/ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { verifyBar } from "~/db/mutations";

type BarWithStaff = Bar & { staff: BarStaff[] };

function DisplarBarRow({ bar }: { bar: BarWithStaff }) {
  const { pending } = useFormStatus();
  return (
    <TableRow
      key={bar.id}
      className={`${pending ? "bg-green-300 hover:bg-green-300" : ""}`}
    >
      <TableCell className="font-medium">{bar.name}</TableCell>
      <TableCell>{bar.city}</TableCell>
      <TableCell>{bar.postcode}</TableCell>
      <TableCell className="text-right">
        <Button className="underline" variant="ghost" type="submit">
          Verify
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function VerifyBar({ bar }: { bar: BarWithStaff }) {
  const [deleted, action] = useFormState(async () => {
    try {
      await verifyBar(bar.id);
      return true;
    } catch (e) {
      // TODO: display error
      return false;
    }
  }, false);

  if (deleted) {
    return null;
  }

  return (
    <form action={action}>
      <DisplarBarRow bar={bar} />
    </form>
  );
}
