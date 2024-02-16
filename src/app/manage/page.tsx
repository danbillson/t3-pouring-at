import { auth, useAuth } from "@clerk/nextjs";
import { Plus } from "lucide-react";
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
import { getBarsByUserId } from "~/db/queries";

export default async function Manage() {
  const { userId } = auth();

  if (!userId) {
    return (
      <div className="pb-4">
        Something went wrong fetching your bars, please try again
      </div>
    );
  }

  const bars = await getBarsByUserId(userId);

  if (!bars) {
    return (
      <div className="pb-4">
        Something went wrong fetching your bars, please try again
      </div>
    );
  }

  return (
    <>
      {bars.map((bar) => (
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
    </>
  );
}
