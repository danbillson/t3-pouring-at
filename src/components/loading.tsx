import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export const LoadingBarPreview = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-5 w-72" />
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

export const LoadingBar = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-5 w-72" />
        <Skeleton className="h-5 w-36" />
      </CardContent>
      <CardFooter>
        <Button className="ml-auto" variant="ghost" disabled>
          Go to bar
        </Button>
      </CardFooter>
    </Card>
  );
};
