import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { zodResolver } from "@hookform/resolvers/zod";
import Map from "google-maps-react-markers";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Layout } from "~/components/layout";
import { Marker } from "~/components/marker";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

const schema = z.object({
  brewery: z.string().nonempty({ message: "Please enter a brewery" }),
  name: z
    .string()
    .nonempty({ message: "Please enter the name of the beverage" }),
  style: z.string().nonempty({ message: "Please enter a style" }),
  abv: z
    .number()
    .nonnegative({ message: "Please enter a valid ABV" })
    .lte(100, { message: "ABV cannot be greater than 100%" })
    .multipleOf(0.1, { message: "ABV can only be up to one decimal place" }),
});

type FormValues = z.infer<typeof schema>;

const BarEdit: NextPage<{ slug: string }> = ({ slug }) => {
  const { data, isLoading, isError } = api.bars.getBySlug.useQuery({ slug });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  if (isError) return <Layout>Sorry, something went wrong</Layout>;

  if (isLoading || !data) return <Layout>Pouring...</Layout>;

  const { bar } = data;

  const location = bar.location as { lat: number; lon: number };

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

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

          <p className="mb-2 mt-8 font-bold">Add a new beverage</p>
          <form
            className="mx-auto grid w-full grid-cols-1 gap-4 lg:grid-cols-2"
            /* eslint-disable-next-line */
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col">
              <label htmlFor="brewery">Brewery</label>
              <input
                className="w-full border-2 border-solid border-black px-4 py-2"
                placeholder="Full Circle Brew Co."
                autoComplete="off"
                {...register("brewery")}
              />
              {errors.brewery && (
                <p className="mt-2 text-xs italic text-red-500">
                  {errors.brewery?.message}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="name">Beverage name</label>
              <input
                className="w-full border-2 border-solid border-black px-4 py-2"
                placeholder="Looper"
                autoComplete="off"
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-2 text-xs italic text-red-500">
                  {errors.name?.message}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="abv">
                ABV <span className="text-slate-500">%</span>
              </label>
              <input
                className="w-full border-2 border-solid border-black px-4 py-2"
                placeholder="6.4"
                autoComplete="off"
                {...register("abv")}
              />
              {errors.abv && (
                <p className="mt-2 text-xs italic text-red-500">
                  {errors.abv?.message}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="style">Style</label>
              <input
                className="w-full border-2 border-solid border-black px-4 py-2"
                placeholder="IPA"
                autoComplete="off"
                {...register("style")}
              />
              {errors.style && (
                <p className="mt-2 text-xs italic text-red-500">
                  {errors.style?.message}
                </p>
              )}
            </div>

            <button className="btn mt-4 w-fit" type="submit">
              Submit
            </button>
          </form>
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
