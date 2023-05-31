import Map from "google-maps-react-markers";
import type { GetStaticProps, NextPage } from "next";
import { Layout } from "~/components/layout";
import { Marker } from "~/components/marker";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const Bar: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.bars.getById.useQuery({ id });

  if (!data) return <Layout>Sorry, we couldn&apos;t find this bar</Layout>;

  const { bar } = data;

  const location = bar.location as { lat: number; lon: number };

  return (
    <>
      <Layout>
        <h1 className="text-2xl font-bold">{bar.name}</h1>
      </Layout>
      <div className="h-96 w-screen py-4">
        <Map
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          defaultCenter={{ lat: location.lat, lng: location.lon }}
          defaultZoom={17}
        >
          <Marker bar={bar} />
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
