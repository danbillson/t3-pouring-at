import type { Bar, BarBeverage, Beverage, Brewery } from "@prisma/client";
import { getDistance } from "geolib";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";

type BarWithBeverages = Bar & {
  beverages: (BarBeverage & { beverage: Beverage & { brewery: Brewery } })[];
};

type BarPreviewProps = {
  bar: BarWithBeverages;
  search?: {
    location: {
      lat: number;
      lng: number;
    };
    style?: string;
    brewery?: string;
  };
};

export const BarPreview = ({ bar, search }: BarPreviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{bar.name}</CardTitle>

        <CardDescription>
          {bar.line1},{bar.line2 && ` ${bar.line2},`} {bar.city}, {bar.postcode}
          {search?.location &&
            ` (${(
              getDistance(
                { latitude: bar.latitude, longitude: bar.longitude },
                {
                  latitude: search.location.lat,
                  longitude: search.location.lng,
                }
              ) / 1609
            ).toFixed(2)} miles)`}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {bar.beverages.length > 0 && (
          <div>
            <p className="mt-2 text-sm font-bold text-slate-800">Preview</p>
            {bar.beverages
              .sort(byStyleAndBrewery(search?.style, search?.brewery))
              .slice(0, 4)
              .map(({ beverage }) => (
                <div key={beverage.id}>
                  <span className="text-xs text-slate-600">
                    {beverage.brewery.name}{" "}
                    <span className="font-bold">{beverage.name}</span> -{" "}
                    {beverage.style}
                  </span>
                </div>
              ))}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button className="ml-auto" variant="ghost" asChild>
          <Link href={`/${bar.slug}`} className="underline">
            Go to bar
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

type BeverageWithBrewery = BarBeverage & {
  beverage: Beverage & { brewery: Brewery };
};

const byStyleAndBrewery =
  (style?: string, brewery?: string) =>
  (a: BeverageWithBrewery, b: BeverageWithBrewery) => {
    if (!style && !brewery) return 0;
    if (style && !brewery) {
      if (a.beverage.style.includes(style)) return -1;
      if (b.beverage.style.includes(style)) return 1;
      return 0;
    }
    if (!style && brewery) {
      if (a.beverage.brewery.name.includes(brewery)) return -1;
      if (b.beverage.brewery.name.includes(brewery)) return 1;
      return 0;
    }
    if (style && brewery) {
      if (a.beverage.style.includes(style)) return -1;
      if (b.beverage.style.includes(style)) return 1;
      if (a.beverage.brewery.name.includes(brewery)) return -1;
      if (b.beverage.brewery.name.includes(brewery)) return 1;
      return 0;
    }
    return 0;
  };
