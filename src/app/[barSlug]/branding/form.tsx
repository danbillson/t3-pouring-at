"use client";
import { useState, useTransition } from "react";
import { ColourPicker } from "~/components/colour-picker";
import { updateBranding } from "~/db/mutations";

type Branding = {
  colours?: {
    foreground?: string;
    background?: string;
    accent?: string;
  };
};

export function FormBranding({
  barId,
  branding: ogBranding,
}: {
  barId: string;
  branding?: Branding;
}) {
  const [isUpdating, startTransition] = useTransition();
  const [branding, setBranding] = useState<Branding | undefined>(ogBranding);

  const { foreground, background, accent } = resolveBranding(branding);
  const mutate = (input: Parameters<typeof updateBranding>[0]) => {
    startTransition(async () => {
      const bar = await updateBranding(input);
      setBranding(bar?.branding ?? undefined);
    });
  };

  return (
    <div className="mt-8 grid gap-2">
      <p className="text-sm">Foreground</p>
      <ColourPicker
        value={foreground}
        onChange={(colour) =>
          mutate({ id: barId, colours: { foreground: colour } })
        }
        disabled={isUpdating}
      />

      <p className="mt-4 text-sm">Background</p>
      <ColourPicker
        value={background}
        onChange={(colour) =>
          mutate({ id: barId, colours: { background: colour } })
        }
        disabled={isUpdating}
      />

      <p className="mt-4 text-sm">Accent</p>
      <ColourPicker
        value={accent}
        onChange={(colour) =>
          mutate({ id: barId, colours: { accent: colour } })
        }
        disabled={isUpdating}
      />
    </div>
  );
}

const resolveBranding = (branding?: Branding) => {
  return {
    foreground: branding?.colours?.foreground ?? "#000000",
    background: branding?.colours?.background ?? "#ffffff",
    accent: branding?.colours?.accent ?? "#000000",
  };
};
