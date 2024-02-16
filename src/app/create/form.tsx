"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, type UseFormSetValue } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Field, Form, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { schema, type FormValues } from "./schema";
import { createBar } from "~/db/mutations";
import { useTransition } from "react";

export function CreateBarForm({ userIsAdmin }: { userIsAdmin: boolean }) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const [isLoading, startTransition] = useTransition();
  const slug = form.watch("slug");

  const onError = (message: string) => {
    if (message === "Reserved slug") {
      form.setError("slug", {
        type: "focus",
        message: `Sorry, that slug is reserved. Please try a different slug.`,
      });
    }
    if (message === "Invalid postcode") {
      form.setError("postcode", {
        type: "focus",
        message: `Sorry, we couldn't find that postcode. Please try again.`,
      });
    }
    if (message.includes("Unique constraint")) {
      form.setError("slug", {
        type: "focus",
        message: `Sorry, that slug is already taken. Please try a different slug.`,
      });
    }
  };

  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      const result = await createBar(data);
      if (result.success) {
        void router.push(`/${data.slug}`);
      } else {
        onError(result.message);
      }
    });
  };

  return (
    <>
      {userIsAdmin && (
        <Button
          className="mx-auto"
          variant="secondary"
          onClick={() => autofill(form.setValue)}
        >
          Autofill
        </Button>
      )}
      <Form {...form}>
        <form
          className="mx-auto grid w-full max-w-sm gap-4 lg:max-w-3xl"
          /* eslint-disable-next-line */
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Field name="name" label="Bar name" control={form.control}>
              <Input placeholder="The Wobbly Duck" autoComplete="off" />
            </Field>

            <Field
              name="slug"
              label="Slug"
              description={slug ? `https://pouring.at/${slug}` : ""}
              control={form.control}
            >
              <Input placeholder="wobbly-duck" autoComplete="off" />
            </Field>
          </div>

          <div className="my-4 h-[1px] w-full bg-border" />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Field name="line1" label="Address line 1" control={form.control}>
              <Input placeholder="4 Old Eldon Square" autoComplete="off" />
            </Field>

            <Field name="line2" label="Address line 2" control={form.control}>
              <Input placeholder="" autoComplete="off" />
            </Field>

            <Field name="city" label="City" control={form.control}>
              <Input placeholder="Newcastle upon Tyne" autoComplete="off" />
            </Field>

            <Field name="postcode" label="Postcode" control={form.control}>
              <Input placeholder="NE1 7JG" autoComplete="off" />
            </Field>
          </div>

          <div className="my-4 h-[1px] w-full bg-border" />

          <div className="flex flex-col">
            <FormLabel>
              Opening Hours{" "}
              <span className="text-muted-foreground">(Optional)</span>
            </FormLabel>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {days.map((day) => (
                <Field
                  key={day}
                  name={`openingHours.${day}`}
                  label={day}
                  control={form.control}
                >
                  <Input placeholder="12 - 11pm" autoComplete="off" />
                </Field>
              ))}
            </div>
          </div>

          <div className="my-4 h-[1px] w-full bg-border" />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Field
              name="url"
              label={
                <>
                  Website url{" "}
                  <span className="text-muted-foreground">(Optional)</span>
                </>
              }
              control={form.control}
            >
              <Input
                placeholder="https://wobblyduck.co.uk/"
                autoComplete="off"
              />
            </Field>
          </div>

          <Button className="mt-4" disabled={isLoading} type="submit">
            {isLoading ? "Creating bar..." : "Submit"}
          </Button>
        </form>
      </Form>
    </>
  );
}

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const autofill = (setValue: UseFormSetValue<FormValues>) => {
  setValue("name", "The Wobbly Duck");
  setValue("slug", "wobbly-duck");
  setValue("line1", "4 Old Eldon Square");
  setValue("city", "Newcastle upon Tyne");
  setValue("postcode", "NE1 7JG");
  setValue("url", "https://wobblyduck.co.uk/");
  setValue("openingHours.monday", "12 - 11pm");
  setValue("openingHours.tuesday", "12 - 11pm");
  setValue("openingHours.wednesday", "12 - 11pm");
  setValue("openingHours.thursday", "12 - 11pm");
  setValue("openingHours.friday", "12 - 11pm");
  setValue("openingHours.saturday", "12 - 11pm");
  setValue("openingHours.sunday", "12 - 11pm");
};
