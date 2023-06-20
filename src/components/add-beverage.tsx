import { zodResolver } from "@hookform/resolvers/zod";
import { type Bar } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

const schema = z.object({
  brewery: z.string().nonempty({ message: "Please enter a brewery" }),
  name: z
    .string()
    .nonempty({ message: "Please enter the name of the beverage" }),
  style: z.string().nonempty({ message: "Please enter a style" }),
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
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const ctx = api.useContext();
  const { mutate, isLoading: isCreating } = api.barBeverage.create.useMutation({
    onSuccess: () => {
      setFocus("brewery");
      reset();
      void ctx.bars.getBySlug.invalidate();
    },
  });

  const onSubmit = (data: FormValues) => {
    mutate({ ...data, barId: bar.id });
  };

  return (
    <form
      className="mx-auto grid w-full grid-cols-1 gap-4 lg:grid-cols-2"
      /* eslint-disable-next-line */
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col">
        <label htmlFor="brewery">Brewery</label>
        <input
          className="w-full border-2 border-solid border-black px-4 py-2"
          placeholder="Full Circle"
          autoComplete="off"
          {...register("brewery")}
        />
        {errors.brewery && (
          <p className="mt-2 text-xs italic text-red-500">
            {errors.brewery?.message}
          </p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="name">Beverage name</label>
        <input
          className="w-full border-2 border-solid border-black px-4 py-2"
          placeholder="Looper"
          autoComplete="off"
          {...register("name")}
        />
        {errors.name && (
          <p className="mt-2 text-xs italic text-red-500">
            {errors.name?.message}
          </p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="abv">
          ABV <span className="text-slate-500">%</span>
        </label>
        <input
          className="w-full border-2 border-solid border-black px-4 py-2"
          placeholder="6.4"
          autoComplete="off"
          {...register("abv", { valueAsNumber: true })}
        />
        {errors.abv && (
          <p className="mt-2 text-xs italic text-red-500">
            {errors.abv?.message}
          </p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="style">Style</label>
        <input
          className="w-full border-2 border-solid border-black px-4 py-2"
          placeholder="IPA"
          autoComplete="off"
          {...register("style")}
        />
        {errors.style && (
          <p className="mt-2 text-xs italic text-red-500">
            {errors.style?.message}
          </p>
        )}
      </div>

      <div />
      <Button className="ml-auto mt-4" type="submit" disabled={isCreating}>
        Submit
      </Button>
    </form>
  );
};
