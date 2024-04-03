"use client";
import { TableCell, TableRow } from "~/components/ui/table";
import type { Bar, BarStaff } from "~/db/schema";
import { Button } from "~/components/ui/button";
import { verifyBar } from "~/db/mutations";
import { useState, useTransition } from "react";

type BarWithStaff = Bar & { staff: BarStaff[] };

export function VerifyBar({ bar }: { bar: BarWithStaff }) {
  const [pending, startTransition] = useTransition();
  const [deleted, setDeleted] = useState(false);
  const verify = () => {
    startTransition(async () => {
      try {
        await verifyBar(bar.id);
        setDeleted(true);
      } catch (e) {
        // TODO: display error
      }
    });
  };

  if (deleted) {
    return null;
  }

  return (
    <TableRow
      key={bar.id}
      className={`${pending ? "bg-green-300 hover:bg-green-300" : ""}`}
    >
      <TableCell className="font-medium">{bar.name}</TableCell>
      <TableCell>{bar.city}</TableCell>
      <TableCell>{bar.postcode}</TableCell>
      <TableCell className="text-right">
        <Button
          className="underline"
          variant="ghost"
          type="submit"
          disabled={pending}
          onClick={() => verify()}
        >
          Verify
        </Button>
      </TableCell>
    </TableRow>
  );
}
