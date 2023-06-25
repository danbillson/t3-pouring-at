import { Skeleton } from "~/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";

export const LoadingBarPreview = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-40" />
        </CardTitle>

        <CardDescription>
          <Skeleton className="h-5 w-72" />
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-56" />
      </CardContent>

      <CardFooter>
        <Button className="ml-auto" variant="ghost" disabled>
          Go to bar
        </Button>
      </CardFooter>
    </Card>
  );
};
