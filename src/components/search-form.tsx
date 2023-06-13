import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

const schema = z.object({
  location: z.string().trim().nonempty({ message: "Please enter a location" }),
  style: z.string().trim().optional(),
  brewery: z.string().trim().optional(),
});

type FormValues = z.infer<typeof schema>;

type SearchFormProps = {
  defaultValues?: FormValues;
};

export const SearchForm = ({ defaultValues }: SearchFormProps) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
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
    <form
      className="mx-auto grid w-full grid-cols-1 gap-4 px-6 md:grid-cols-2"
      /* eslint-disable-next-line */
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col">
        <label htmlFor="location">Location</label>
        <input
          className="w-full border-2 border-solid border-black px-4 py-2"
          placeholder="Newcastle upon Tyne"
          {...register("location")}
        />
        {errors.location && (
          <p className="mt-2 text-xs italic text-red-500">
            {errors.location?.message}
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
      </div>

      <div className="flex flex-col">
        <label htmlFor="brewery">Brewery</label>
        <input
          className="w-full border-2 border-solid border-black px-4 py-2"
          placeholder="Full Circle Brew Co."
          {...register("brewery")}
        />
      </div>

      <div />
      <div />

      <button className="btn ml-auto mt-4 w-fit" type="submit">
        Submit
      </button>
    </form>
  );
};
