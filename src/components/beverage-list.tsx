import type { BarBeverage, Beverage, Brewery } from "@prisma/client";
import { BeverageCard } from "~/components/beverage-card";

type BeverageListProps = {
  beverages: (BarBeverage & { beverage: Beverage & { brewery: Brewery } })[];
  edit?: boolean;
};

export const BeverageList = ({ beverages, edit }: BeverageListProps) => {
  return (
    <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {beverages.map((barBeverage) => {
        return (
          <BeverageCard
            key={barBeverage.beverageId}
            barBeverage={barBeverage}
            edit={edit}
          />
        );
      })}
    </div>
  );
};
