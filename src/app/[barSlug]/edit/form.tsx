import { AddBeverage } from "~/components/add-beverage";
import { BeverageList } from "~/components/beverage-list";

import type { BarWithBeverages } from "~/db/schema";

export function EditBarForm({ bar }: { bar: BarWithBeverages }) {
  return (
    <>
      <p className="mb-2 mt-8 font-bold">Add a new beverage</p>
      <AddBeverage bar={bar} />

      <h3 className="mt-8 text-xl font-bold">Tap list</h3>
      {bar.beverages.length === 0 ? (
        <p className="text-muted-foreground">
          Nothing added yet, use the form above to add a beverage
        </p>
      ) : (
        <BeverageList beverages={bar.beverages} edit />
      )}
    </>
  );
}
