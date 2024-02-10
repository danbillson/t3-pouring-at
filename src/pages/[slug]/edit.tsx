import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { sql } from "drizzle-orm";
import Map from "google-maps-react-markers";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { AddBeverage } from "~/components/add-beverage";
import { BeverageList } from "~/components/beverage-list";
import { Marker } from "~/components/marker";
import { Button } from "~/components/ui/button";
import { Layout } from "~/components/ui/layout";
import { db } from "~/db";
import { api } from "~/utils/api";

const BarEdit: NextPage<{ slug: string }> = ({ slug }) => {
  const { data, isLoading, isError } = api.bars.getBySlug.useQuery({ slug });

  if (isError) return <Layout>Sorry, something went wrong</Layout>;

  if (isLoading || !data) return <Layout>Pouring...</Layout>;

  const { bar } = data;

  return (
    <>
      <Head>
        <title>Editing | {bar.name}</title>
        <meta
          name="description"
          content={`See all of the beers pouring at ${bar.name}`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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

      <div className="h-96 w-screen py-4">
        <Map
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          defaultCenter={{ lng: bar.longitude, lat: bar.latitude }}
          defaultZoom={17}
        >
          <Marker bar={bar} lat={bar.latitude} lng={bar.longitude} />
        </Map>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { userId } = getAuth(context.req);

  if (!userId) {
    return {
      redirect: {
        destination: `/sign-in`,
        permanent: false,
      },
    };
  }

  const slug = context.params?.slug as string;
  const bar = await db.query.bar.findFirst({
    where: (bar, { eq, exists, and }) =>
      and(
        eq(bar.slug, slug),
        exists(
          sql`select * 
            from staff s 
            where s.bar_id = ${bar.id} 
              and s.user_id = ${userId}`,
        ),
      ),
  });

  if (!bar) {
    return {
      redirect: {
        destination: `/${slug}`,
        permanent: false,
      },
    };
  }

  return { props: { ...buildClerkProps(context.req), slug } };
};

export default BarEdit;
