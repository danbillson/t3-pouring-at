import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import Map from "google-maps-react-markers";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { Layout } from "~/components/layout";
import { Marker } from "~/components/marker";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

const BarEdit: NextPage<{ slug: string }> = ({ slug }) => {
  const { data, isLoading, isError } = api.bars.getBySlug.useQuery({ slug });

  if (isError) return <Layout>Sorry, something went wrong</Layout>;

  if (isLoading || !data) return <Layout>Pouring...</Layout>;

  const { bar } = data;

  const location = bar.location as { lat: number; lon: number };

  return (
    <>
      <main className="mx-auto flex max-w-6xl flex-col">
        <div className="flex w-full flex-col px-8 py-16">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">{bar.name}</h1>
              <p className="text-xs text-slate-600">
                {bar.line1},{bar.line2 && ` ${bar.line2},`} {bar.city},{" "}
                {bar.postcode}
              </p>
            </div>

            <Link href={`/${bar.slug}`} className="btn h-fit">
              Back
            </Link>
          </div>
          <h3 className="mt-8 text-xl font-bold">Tap list</h3>
        </div>
      </main>

      <div className="h-96 w-screen py-4">
        <Map
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          defaultCenter={{ lat: location.lat, lng: location.lon }}
          defaultZoom={17}
        >
          <Marker bar={bar} lat={location.lat} lng={location.lon} />
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
  const bar = await prisma.bar.findFirst({
    where: {
      slug,
      staff: {
        some: {
          staffId: userId,
        },
      },
    },
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
