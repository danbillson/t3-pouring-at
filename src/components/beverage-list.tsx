import type { BarBeverage, Beverage, Brewery } from "@prisma/client";
import { api } from "~/utils/api";
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
    <div className="my-6 grid grid-cols-3 gap-4">
      {beverages.map(({ barId, beverageId, beverage, tappedOn }) => {
        return (
          <div
            key={beverage.id}
            className={`border-2 border-solid ${
              isLoading && variables?.beverageId === beverageId
                ? "border-red-500"
                : "border-black"
            } px-4 py-2`}
          >
            <div>
              <span className="mr-2 text-lg font-bold">
                {beverage.brewery.name}
              </span>
              <span className="text-lg">{beverage.name}</span>
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
            {edit && (
              <button
                className="ml-auto mt-3 block text-sm underline"
                disabled={isLoading}
                onClick={() => {
                  mutate({ barId, beverageId });
                }}
              >
                Untap
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
