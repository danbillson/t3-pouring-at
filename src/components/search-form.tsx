import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Combobox } from "~/components/ui/combobox";
import { Field, Form } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { cities } from "~/data/gb";

const schema = z.object({
  location: z.string().trim().nonempty({ message: "Please enter a location" }),
  style: z.string().trim().optional(),
  brewery: z.string().trim().optional(),
});

type FormValues = z.infer<typeof schema>;

type SearchFormProps = {
  defaultValues?: FormValues;
  loading?: boolean;
};

export const SearchForm = ({ defaultValues, loading }: SearchFormProps) => {
  const router = useRouter();
  const form = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = ({ location, style, brewery }: FormValues) => {
    void router.push(
      `/search?location=${encodeURIComponent(location)}${
        style ? `&style=${encodeURIComponent(style)}` : ""
      }${brewery ? `&brewery=${encodeURIComponent(brewery)}` : ""}`
    );
  };

  return (
    <Form {...form}>
      <form
        className="mx-auto grid w-full grid-cols-1 gap-4 px-4 md:grid-cols-2"
        /* eslint-disable-next-line */
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Field
          name="location"
          label="Location"
          description="Search by town, city or postcode"
          control={form.control}
        >
          <Combobox placeholder="Newcastle upon Tyne" options={cities} />
        </Field>

        <Field name="style" label="Style" control={form.control}>
          <Input placeholder="IPA" autoComplete="off" />
        </Field>

        <Field name="brewery" label="Brewery" control={form.control}>
          <Input placeholder="Full Circle" autoComplete="off" />
        </Field>

        <div />
        <div />

        <Button className="ml-auto" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
};
