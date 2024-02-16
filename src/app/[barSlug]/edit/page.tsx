import { auth } from "@clerk/nextjs";
import Map from "google-maps-react-markers";
import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { AddBeverage } from "~/components/add-beverage";
import { BeverageList } from "~/components/beverage-list";
import { Marker } from "~/components/marker";
import { Button } from "~/components/ui/button";
import { redirect } from "next/navigation";
import { getBarBySlug } from "~/db/queries";
import { BarMap } from "../map";
import { BarName } from "~/components/state";

type Props = {
  params: { barSlug: string };
};

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const bar = await getBarBySlug(params.barSlug);

  return {
    title: `Pouring at ${bar.name}`,
    description: `See all of the beers pouring at ${bar.name}`,
  };
}

export default async function BarEdit({ params }: Props) {
  const { userId } = auth();
  const bar = await getBarBySlug(params.barSlug);

  const isOwner = bar.staff.some(({ staffId }) => staffId === userId);

  if (!isOwner) {
    redirect("/");
  }

  // if (isError) return <Layout>Sorry, something went wrong</Layout>;

  // if (isLoading || !data) return <Layout>Pouring...</Layout>;

  return (
    <>
      <BarName name={bar.name} />
      <main className="mx-auto flex max-w-6xl flex-col">
        <div className="flex w-full flex-col px-8 py-16">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">{bar.name}</h1>
              <p className="text-xs text-muted-foreground">
                {bar.line1},{bar.line2 && ` ${bar.line2},`} {bar.city},{" "}
                {bar.postcode}
              </p>
            </div>

            <Button variant="secondary" asChild>
              <Link href={`/${bar.slug}`}>Back</Link>
            </Button>
          </div>

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
        </div>
      </main>

      <BarMap bar={bar} />
    </>
  );
}
