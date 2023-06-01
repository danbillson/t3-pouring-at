import { useAuth } from "@clerk/nextjs";
import Map from "google-maps-react-markers";
import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { Layout } from "~/components/layout";
import { Marker } from "~/components/marker";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const Bar: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.bars.getById.useQuery({ id });
  const { userId } = useAuth();

  if (!data) return <Layout>Sorry, we couldn&apos;t find this bar</Layout>;

  const { bar } = data;

  const location = bar.location as { lat: number; lon: number };

  const isOwner = bar.staff.some(({ staffId }) => staffId === userId);

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
            {isOwner && (
              <Link href={`/bar/${bar.id}/edit`} className="btn h-fit">
                Edit
              </Link>
            )}
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

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.bars.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default Bar;
