import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { sql } from "drizzle-orm";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { ColourPicker } from "~/components/colour-picker";
import { Button } from "~/components/ui/button";
import { Layout } from "~/components/ui/layout";
import { db, schema } from "~/db";
import { api } from "~/utils/api";

type Branding = {
  colours?: {
    foreground?: string;
    background?: string;
    accent?: string;
  };
};

const BarBranding: NextPage<{ slug: string }> = ({ slug }) => {
  const { data, isLoading, isError, refetch } = api.bars.getBySlug.useQuery({
    slug,
  });
  const { mutate, isLoading: isUpdating } = api.bars.updateBranding.useMutation(
    {
      onSettled: () => {
        void refetch();
      },
    },
  );

  if (isError) return <Layout>Sorry, something went wrong</Layout>;

  if (isLoading || !data) return <Layout>Pouring...</Layout>;

  const { bar } = data;
  const branding = bar.branding as Branding;
  const { foreground, background, accent } = resolveBranding(branding);

  return (
    <>
      <Head>
        <title>Branding | {bar.name}</title>
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

            <div className="mt-8 grid gap-2">
              <p className="text-sm">Foreground</p>
              <ColourPicker
                value={foreground}
                onChange={(colour) =>
                  mutate({ id: bar.id, colours: { foreground: colour } })
                }
                disabled={isUpdating}
              />

              <p className="mt-4 text-sm">Background</p>
              <ColourPicker
                value={background}
                onChange={(colour) =>
                  mutate({ id: bar.id, colours: { background: colour } })
                }
                disabled={isUpdating}
              />

              <p className="mt-4 text-sm">Accent</p>
              <ColourPicker
                value={accent}
                onChange={(colour) =>
                  mutate({ id: bar.id, colours: { accent: colour } })
                }
                disabled={isUpdating}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

const resolveBranding = (branding: Branding) => {
  return {
    foreground: branding?.colours?.foreground ?? "#000000",
    background: branding?.colours?.background ?? "#ffffff",
    accent: branding?.colours?.accent ?? "#000000",
  };
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
          db
            .select()
            .from(schema.barStaff)
            .where(
              and(
                eq(schema.barStaff.barId, bar.id),
                eq(schema.barStaff.staffId, userId),
              ),
            ),
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

export default BarBranding;
