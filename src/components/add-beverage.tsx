"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Bar } from "~/db/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Field,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useTransition } from "react";
import { createBeverage } from "~/db/mutations";
import { useRouter } from "next/navigation";

const schema = z.object({
  brewery: z.string().min(1, { message: "Please enter a brewery" }),
  name: z.string().min(1, { message: "Please enter the name of the beverage" }),
  style: z.string().min(1, { message: "Please enter a style" }),
  abv: z
    .number()
    .nonnegative({ message: "Please enter a valid ABV" })
    .lte(100, { message: "ABV cannot be greater than 100%" })
    .multipleOf(0.1, { message: "ABV can only be up to one decimal place" }),
});

type FormValues = z.infer<typeof schema>;

type AddBeverageProps = {
  bar: Bar;
};

export const AddBeverage = ({ bar }: AddBeverageProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const router = useRouter();
  const [isCreating, startTransition] = useTransition();

  const onSubmit = (data: FormValues) => {
    form.reset();
    startTransition(async () => {
      await createBeverage({ barId: bar.id, ...data });
      form.setFocus("brewery");
      form.reset({ brewery: "", name: "", style: "", abv: 0 });
      router.refresh();
    });
  };

  return (
    <Form {...form}>
      <form
        className="mx-auto grid w-full grid-cols-1 gap-4 lg:grid-cols-2"
        /* eslint-disable-next-line */
        onSubmit={(val) => void form.handleSubmit(onSubmit)(val)}
      >
        <Field name="brewery" label="Brewery" control={form.control}>
          <Input placeholder="Full Circle" autoComplete="off" />
        </Field>

        <Field name="name" label="Beverage name" control={form.control}>
          <Input placeholder="Looper" autoComplete="off" />
        </Field>

        <FormField
          name="abv"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>ABV</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  step="0.1"
                  onChange={(event) => field.onChange(+event.target.value)}
                  placeholder="6.4"
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Field name="style" label="Style" control={form.control}>
          <Input placeholder="IPA" autoComplete="off" />
        </Field>

        <div />
        <Button className="ml-auto mt-4" type="submit" disabled={isCreating}>
          Submit
        </Button>
      </form>
    </Form>
  );
};
