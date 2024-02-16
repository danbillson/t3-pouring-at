import type { Bar, BarBeverage, Beverage, Brewery } from "~/db/schema";
import Map from "google-maps-react-markers";
import { BarPreview } from "~/components/bar-preview";
import { Marker } from "~/components/marker";
import { SearchForm } from "~/components/search-form";
import { searchBars } from "~/db/queries";
import { env } from "~/env.mjs";

type SearchQuery = {
  location: string;
  style: string | undefined;
  brewery: string | undefined;
};

export default async function Search({
  searchParams,
}: {
  searchParams: SearchQuery;
}) {
  const { location, style, brewery } = searchParams;
  const search = { location, style, brewery };
  const data = await searchBars(location);

  const bars =
    data?.bars.filter(hasBrewery(brewery)).filter(hasBeerStyle(style)) || [];

  return (
    <>
      <SearchForm />
      {data && data.bars.length === 0 && (
        <p className="pb-4">No bars found, try searching again</p>
      )}
      {data && bars.length > 0 ? (
        <>
          <div className="grid w-full grid-cols-1 gap-4 px-4 md:grid-cols-2">
            {bars.map((bar) => (
              <BarPreview
                key={bar.id}
                bar={bar}
                search={{ ...search, location: data.location }}
              />
            ))}
          </div>
          <div className="h-96 w-screen py-4">
            <Map
              apiKey={env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
              defaultCenter={{
                lng: data.location.lng,
                lat: data.location.lat,
              }}
              defaultZoom={13}
            >
              {bars.map((bar) => (
                <Marker
                  key={bar.id}
                  bar={bar}
                  lat={bar.latitude}
                  lng={bar.longitude}
                />
              ))}
            </Map>
          </div>
        </>
      ) : null}
    </>
  );
}

type BarWithBeverages = Bar & {
  beverages: (BarBeverage & {
    beverage: (Beverage & { brewery: Brewery | null }) | null;
  })[];
};

const hasBeerStyle = (style?: string) => (bar: BarWithBeverages) => {
  if (!style) return true;
  return bar.beverages.some(
    (beverage) => beverage.beverage?.style.includes(style),
  );
};

const hasBrewery = (brewery?: string) => (bar: BarWithBeverages) => {
  if (!brewery) return true;
  return bar.beverages.some(
    (beverage) => beverage.beverage?.brewery?.name.includes(brewery),
  );
};
