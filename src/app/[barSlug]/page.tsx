import { auth } from "@clerk/nextjs";
import type { Metadata, ResolvingMetadata } from "next";
import { getBarBySlug } from "~/db/queries";
import Link from "next/link";
import { BeverageList } from "~/components/beverage-list";
import { Button } from "~/components/ui/button";
import { BarMap } from "./map";
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

export default async function BarPage({ params }: Props) {
  const { userId } = auth();
  const bar = await getBarBySlug(params.barSlug);

  const isOwner = bar.staff.some(({ staffId }) => staffId === userId);
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
            {isOwner && (
              <div className="flex gap-2">
                <Button variant="ghost" asChild>
                  <Link href={`/${bar.slug}/branding`}>Branding</Link>
                </Button>
                <Button variant="secondary" asChild>
                  <Link href={`/${bar.slug}/edit`}>Edit</Link>
                </Button>
              </div>
            )}
          </div>

          <h3 className="mt-8 text-xl font-bold">Tap list</h3>
          {bar.beverages.length === 0 ? (
            <p className="text-muted-foreground">
              Nothing listed at {bar.name} yet, check back soon 🍺
            </p>
          ) : (
            <BeverageList beverages={bar.beverages} />
          )}
        </div>
      </main>

      <BarMap bar={bar} />
    </>
  );
}
