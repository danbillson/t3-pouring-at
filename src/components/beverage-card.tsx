import type { BarBeverage, Beverage, Brewery } from "~/db/schema";
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

dayjs.extend(relativeTime);

type BeverageCardProps = {
  barBeverage: BarBeverage & {
    beverage: (Beverage & { brewery: Brewery | null }) | null;
  };
  edit?: boolean;
  deleting?: boolean;
};

export const BeverageCard = ({ barBeverage, edit }: BeverageCardProps) => {
  const { barId, beverageId, beverage, tappedOn } = barBeverage;
  const ctx = api.useContext();
  const { mutate, isLoading, variables } = api.barBeverage.untap.useMutation({
    onSuccess: () => {
      void ctx.bars.getBySlug.invalidate();
    },
  });
  if (!beverage || !beverage.brewery) {
    // TODO: Logo error
    return null;
  }
  return (
    <Card
      className={`${
        isLoading && variables?.beverageId === beverageId
          ? "border-red-500"
          : "border-border"
      }`}
    >
      <CardHeader>
        <CardTitle>
          <span className="font-normal">{beverage.brewery.name}</span>{" "}
          {beverage.name}
        </CardTitle>
        <CardDescription>
          <span className="mr-2 text-sm">
            {String(beverage?.abv)}%<span className="mx-1 text-xs">ABV</span>
          </span>
          <span className="text-sm">{beverage.style}</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <span className="text-sm">
          Tapped: <span className="font-bold">{dayjs(tappedOn).fromNow()}</span>
        </span>
      </CardContent>

      {edit && (
        <CardFooter>
          <Button
            className="ml-auto underline"
            variant="ghost"
            disabled={isLoading}
            onClick={() => {
              mutate({ barId, beverageId });
            }}
          >
            Untap
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
