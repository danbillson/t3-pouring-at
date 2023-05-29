import type { GetStaticProps, NextPage } from "next";
import { Layout } from "~/components/layout";

import { generateSSGHelper } from "~/server/helpers/ssgHelper";

const Bar: NextPage<{ id: string }> = ({ id }) => {
  return <Layout>Bar - {id}</Layout>;
};

export const getStaticProps: GetStaticProps = (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

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
