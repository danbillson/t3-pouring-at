import type { BarBeverage, Beverage, Brewery } from "@prisma/client";
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type BeverageListProps = {
  beverages: (BarBeverage & { beverage: Beverage & { brewery: Brewery } })[];
  edit?: boolean;
};

export const BeverageList = ({ beverages, edit }: BeverageListProps) => {
  const ctx = api.useContext();
  const { mutate, isLoading, variables } = api.barBeverage.untap.useMutation({
    onSuccess: () => {
      void ctx.bars.getBySlug.invalidate();
    },
  });

  return (
    <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {beverages.map(({ barId, beverageId, beverage, tappedOn }) => {
        return (
          <div
            key={beverage.id}
            className={`border-2 border-solid ${
              isLoading && variables?.beverageId === beverageId
                ? "border-red-500"
                : "border-black"
            } flex flex-col justify-between px-4 py-2`}
          >
            <div>
              <div>
                <p className="mr-2 text-lg">
                  {beverage.brewery.name}{" "}
                  <span className="font-bold">{beverage.name}</span>
                </p>
              </div>
              <div>
                <span className="mr-2 text-sm">
                  {String(beverage.abv)}%
                  <span className="mx-1 text-xs text-slate-500">ABV</span>
                </span>
                <span className="text-sm">{beverage.style}</span>
              </div>
              <span className="mt-3 block text-sm">
                Tapped:{" "}
                <span className="font-bold">{dayjs(tappedOn).fromNow()}</span>
              </span>
            </div>
            {edit && (
              <Button
                className="ml-auto mt-3 underline"
                variant="ghost"
                disabled={isLoading}
                onClick={() => {
                  mutate({ barId, beverageId });
                }}
              >
                Untap
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};
