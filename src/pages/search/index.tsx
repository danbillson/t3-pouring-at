import type { Bar, BarBeverage, Beverage, Brewery } from "@prisma/client";
import Map from "google-maps-react-markers";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { BarPreview } from "~/components/bar-preview";
import { LoadingBarPreview } from "~/components/loading-bar-preview";
import { Marker } from "~/components/marker";
import { SearchForm } from "~/components/search-form";
import { api } from "~/utils/api";

type SearchQuery = {
  location: string;
  style: string | undefined;
  brewery: string | undefined;
};

const Search: NextPage = () => {
  const router = useRouter();
  const { location, style, brewery } = router.query as SearchQuery;
  const search = { location, style, brewery };

  const { data, isLoading, isError, error } = api.bars.search.useQuery(
    {
      location,
      style,
      brewery,
    },
    {
      enabled: !!location,
      retry: false,
    }
  );

  const bars =
    data?.bars.filter(hasBrewery(brewery)).filter(hasBeerStyle(style)) || [];

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="max-w-2xl px-4 text-2xl text-black">
          Search for your favourite beers that are pouring at bars across the UK
        </h1>
        <SearchForm defaultValues={search} loading={isLoading} />
        {isLoading && (
          <div className="grid w-full grid-cols-1 gap-4 px-6 md:grid-cols-2">
            <LoadingBarPreview />
            <LoadingBarPreview />
          </div>
        )}
        {isError && <p className="pb-4">{prettyError(error)}</p>}
        {data && data.bars.length === 0 && (
          <p className="pb-4">No bars found, try searching again</p>
        )}
        {data && bars.length > 0 ? (
          <>
            <div className="grid w-full grid-cols-1 gap-4 px-6 md:grid-cols-2">
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
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
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
      </div>
    </main>
  );
};

const prettyError = (error: { message: string } | undefined) => {
  if (!error) return "Something went wrong...";
  if (error.message === "Invalid address") {
    return "Invalid address, please try a different location or postcode";
  }
};

type BarWithBeverages = Bar & {
  beverages: (BarBeverage & { beverage: Beverage & { brewery: Brewery } })[];
};

const hasBeerStyle = (style?: string) => (bar: BarWithBeverages) => {
  if (!style) return true;
  return bar.beverages.some((beverage) =>
    beverage.beverage.style.includes(style)
  );
};

const hasBrewery = (brewery?: string) => (bar: BarWithBeverages) => {
  if (!brewery) return true;
  return bar.beverages.some((beverage) =>
    beverage.beverage.brewery.name.includes(brewery)
  );
};

export default Search;
