import { auth } from "@clerk/nextjs";
import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { redirect } from "next/navigation";
import { getBarBySlug } from "~/db/queries";
import { BarsMap } from "~/components/bar-map";
import { BarName } from "~/components/state";
import { EditBarForm } from "./form";

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
          <EditBarForm bar={bar} />
        </div>
      </main>

      <BarsMap bars={[bar]} zoom={17} lat={bar.latitude} lng={bar.longitude} />
    </>
  );
}
