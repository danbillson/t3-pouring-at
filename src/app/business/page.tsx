import { Beer, MapPin, User2 } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function Business() {
  return (
    <main className="flex flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center px-4 py-16 ">
        <h1 className="mb-6 max-w-2xl px-4 text-center text-2xl">
          Keep your customers up to date with what&apos;s pouring at your bar
        </h1>
        <h2 className="max-w-3xl text-center text-muted-foreground">
          Pouring.at is an app designed for craft micropubs with rotating taps
          to help regular customers and those visiting the area for the first
          time find their favourite beers
        </h2>
        <div className="my-8 flex gap-4">
          <Button variant="default" asChild>
            <Link href={`/sign-up`}>Sign up</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href={`/sign-in`}>Sign in</Link>
          </Button>
        </div>
      </div>
      <div className="w-full bg-muted">
        <div className="container flex flex-col items-center justify-center bg-muted px-4 py-16">
          <h2 className="mb-8 max-w-3xl text-center text-xl text-muted-foreground">
            How does it work?
          </h2>
          <div className="grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Card>
              <CardHeader>
                <User2 size={48} />
                <CardTitle>Sign up</CardTitle>
                <CardDescription>
                  Create an account and add information about your bar
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Beer size={48} />
                <CardTitle>List your beers</CardTitle>
                <CardDescription>
                  Tap and untap beers as they come and go
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <MapPin size={48} />
                <CardTitle>Be found</CardTitle>
                <CardDescription>
                  Once your bar has been verified people will be able to find
                  you through the bar search
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
