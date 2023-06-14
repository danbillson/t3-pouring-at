import { type Bar } from "@prisma/client";
import * as Avatar from "@radix-ui/react-avatar";
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
          <Avatar.Root className="relative left-[-22.5px] top-[-22.5px] inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full bg-slate-900 align-middle">
            <Avatar.Fallback className="leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium text-orange11">
              {bar.name
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)}
            </Avatar.Fallback>
          </Avatar.Root>
        </Link>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className="w-64 rounded-md bg-white p-5 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade data-[state=open]:transition-all"
          sideOffset={5}
        >
          <div className="flex flex-col">
            <p className="mb-4">{bar.name}</p>
            <p className="text-xs text-slate-600">{bar.line1}</p>
            {bar.line2 && <p className="text-xs text-slate-600">{bar.line2}</p>}
            <p className="text-xs text-slate-600">{bar.city}</p>
            <p className="text-xs text-slate-600">{bar.postcode}</p>
          </div>
          <HoverCard.Arrow className="fill-white" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};
