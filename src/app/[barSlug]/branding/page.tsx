import Link from "next/link";
import { Button } from "~/components/ui/button";
import type { Metadata, ResolvingMetadata } from "next";
import { getBarBySlug } from "~/db/queries";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FormBranding } from "./form";
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
export default async function BarBranding({ params }: Props) {
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
              <h1 className="text-2xl font-bold">Set your branding</h1>
              <p className="max-w-lg text-sm text-muted-foreground">
                This will be used to create generate media such as instagram
                story or post images or define the look of your tap list pages
              </p>
            </div>

            <Button variant="secondary" asChild>
              <Link href={`/${bar.slug}`}>Back</Link>
            </Button>
          </div>

          <div>
            <h2 className="mb-2 mt-8 text-lg font-bold">Colours</h2>
            <p className="text-muted-foreground">
              Choose colours to match your brand
            </p>
            <FormBranding barId={bar.id} branding={bar.branding ?? undefined} />
          </div>
        </div>
      </main>
    </>
  );
}
