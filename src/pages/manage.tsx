import { useAuth } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { type NextPage } from "next";
import Link from "next/link";
import { LoadingBar } from "~/components/loading";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Layout } from "~/components/ui/layout";
import { api } from "~/utils/api";

const Manage: NextPage = () => {
  const { userId } = useAuth();

  const { isError, isLoading, data } = api.bars.getByUserId.useQuery(
    { userId: userId as string },
    { enabled: !!userId }
  );

  return (
    <Layout>
      <h2 className="text-2xl font-bold">Your Bars</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && <LoadingBar />}
        {isError && (
          <div className="pb-4">
            Something went wrong fetching your bars, please try again
          </div>
        )}
        {data &&
          data.bars.map((bar) => (
            <Card key={bar.id}>
              <CardHeader>
                <CardTitle>{bar.name}</CardTitle>
                <CardDescription>
                  {bar.line1},{bar.line2 && ` ${bar.line2},`} {bar.city},{" "}
                  {bar.postcode}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="ml-auto" variant="ghost" asChild>
                  <Link href={`/${bar.slug}`} className="underline">
                    Go to bar
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        <Link href="/create" className="border-2 border-foreground p-4">
          <span className="flex items-center gap-3 align-middle text-xl font-bold">
            <Plus />
            Add new bar
          </span>
        </Link>
      </div>
    </Layout>
  );
};

export default Manage;
