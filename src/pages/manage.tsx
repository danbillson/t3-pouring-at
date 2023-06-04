import { useAuth } from "@clerk/nextjs";
import { type NextPage } from "next";
import { Layout } from "~/components/layout";
import { api } from "~/utils/api";
import { PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const Manage: NextPage = () => {
  const { userId } = useAuth();

  const { isError, isLoading, data } = api.bars.getByUserId.useQuery(
    { userId: userId as string },
    { enabled: !!userId }
  );

  if (isError) return <Layout>failed to load</Layout>;

  if (isLoading) return <Layout>loading...</Layout>;

  return (
    <Layout>
      <h2 className="text-2xl font-bold">Your Bars</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {data.bars.map((bar) => (
          <Link
            key={bar.id}
            href={`/${bar.slug}`}
            className="flex flex-col border border-black p-4 text-slate-600"
          >
            <span className="text-xl font-bold text-black">{bar.name}</span>
            <span>{bar.line1}</span>
            {bar?.line2 && <span>{bar.line2}</span>}
            <span>{bar.city}</span>
            <span>{bar.postcode}</span>
          </Link>
        ))}
        <Link href="/bar/create" className="border border-black p-4">
          <span className="flex items-center gap-2 align-middle text-xl font-bold">
            <PlusIcon />
            Add new bar
          </span>
        </Link>
      </div>
    </Layout>
  );
};

export default Manage;
