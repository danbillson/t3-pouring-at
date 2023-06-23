import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

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
        className="mx-auto grid w-full grid-cols-1 gap-4 px-6 md:grid-cols-2"
        /* eslint-disable-next-line */
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Newcastle upon Tyne" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="style"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Style</FormLabel>
              <FormControl>
                <Input placeholder="IPA" autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brewery"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brewery</FormLabel>
              <FormControl>
                <Input
                  placeholder="Full Circle"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
