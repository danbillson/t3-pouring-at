import { type Bar } from "~/db/schema";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import * as HoverCard from "@radix-ui/react-hover-card";
import Link from "next/link";

type MarkerProps = {
  bar: Bar;
  // lat and lng and required by google-maps-react-markers but not used
  lat: number;
  lng: number;
};

export const Marker = ({ bar }: MarkerProps) => {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        <Link href={`/${bar.slug}`}>
          <Avatar className="left-[-22.5px] top-[-22.5px] inline-flex h-[45px] w-[45px] select-none">
            <AvatarFallback>
              {bar.name
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </Link>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className="z-50 w-64 rounded-md bg-background p-5 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade data-[state=open]:transition-all"
          sideOffset={5}
        >
          <div className="flex flex-col">
            <p className="mb-4">{bar.name}</p>
            <p className="text-xs text-muted-foreground">{bar.line1}</p>
            {bar.line2 && (
              <p className="text-xs text-muted-foreground">{bar.line2}</p>
            )}
            <p className="text-xs text-muted-foreground">{bar.city}</p>
            <p className="text-xs text-muted-foreground">{bar.postcode}</p>
          </div>
          <HoverCard.Arrow className="fill-background" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};
