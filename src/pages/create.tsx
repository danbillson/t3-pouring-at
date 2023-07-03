import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { zodResolver } from "@hookform/resolvers/zod";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useForm, type UseFormSetValue } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Field, Form, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Layout } from "~/components/ui/layout";
import { api } from "~/utils/api";

const schema = z.object({
  name: z
    .string()
    .nonempty({ message: "Please enter the name of your bar" })
    .min(2, { message: "The name of your bar must be at least 2 characters" }),
  slug: z
    .string()
    .nonempty({ message: "Please enter a slug" })
    .min(2, { message: "Your slug must be at least 2 characters" })
    .regex(/^[a-zA-Z0-9-]+$/i, {
      message: "Your slug can only contain letters, numbers and dashes",
    }),
  line1: z
    .string()
    .nonempty({ message: "Please enter the first line of the address" }),
  line2: z.string().optional(),
  city: z
    .string()
    .nonempty({ message: "Please enter the city that your bar is in" }),
  postcode: z
    .string()
    .regex(/^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i, {
      message: "Please enter a valid postcode",
    })
    .nonempty({ message: "Please enter the postcode of your bar" }),
  openingHours: z.object({
    monday: z.string().optional(),
    tuesday: z.string().optional(),
    wednesday: z.string().optional(),
    thursday: z.string().optional(),
    friday: z.string().optional(),
    saturday: z.string().optional(),
    sunday: z.string().optional(),
  }),
  url: z
    .string()
    .url({ message: "Please enter a valid url" })
    .optional()
    .or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

type CreateBarProps = {
  userIsAdmin: boolean;
};

const CreateBar: NextPage<CreateBarProps> = ({ userIsAdmin }) => {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const slug = form.watch("slug");

  const { mutate, isLoading } = api.bars.create.useMutation({
    onSuccess: (data) => {
      void router.push(`/${data.bar.slug}`);
    },
    onError: (error) => {
      if (error.message === "Reserved slug") {
        form.setError("slug", {
          type: "focus",
          message: `Sorry, that slug is reserved. Please try a different slug.`,
        });
      }
      if (error.message === "Invalid postcode") {
        form.setError("postcode", {
          type: "focus",
          message: `Sorry, we couldn't find that postcode. Please try again.`,
        });
      }
      if (error.message.includes("Unique constraint")) {
        form.setError("slug", {
          type: "focus",
          message: `Sorry, that slug is already taken. Please try a different slug.`,
        });
      }
    },
  });

  const onSubmit = (data: FormValues) => {
    mutate(data);
  };

  return (
    <Layout>
      <h2 className="text-center text-2xl font-bold">Tell us about your bar</h2>
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
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { userId } = getAuth(context.req);
  const user = userId ? await clerkClient.users.getUser(userId) : undefined;

  if (!user) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  return { props: { userIsAdmin: user?.privateMetadata?.role === "admin" } };
};

export default CreateBar;

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
