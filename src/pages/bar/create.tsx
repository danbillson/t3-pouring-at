import { zodResolver } from "@hookform/resolvers/zod";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Layout } from "~/components/layout";
import { api } from "~/utils/api";

const schema = z.object({
  name: z.string().min(2, { message: "Please enter the name of your bar" }),
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

const CreateBar: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const { mutateAsync } = api.bars.create.useMutation({
    onSuccess: (data) => {
      void router.push(`/bar/${data.bar.id}`);
    },
  });

  const onSubmit = async (data: FormValues) => {
    await mutateAsync(data);
  };

  return (
    <Layout>
      <h2 className="text-center text-2xl font-bold">Tell us about your bar</h2>
      <form
        className="mx-auto grid w-full max-w-sm gap-4 lg:max-w-3xl"
        /* eslint-disable-next-line */
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="flex flex-col">
            <label htmlFor="name">Bar name</label>
            <input
              className="w-full border-2 border-solid border-black px-4 py-2"
              placeholder="The Wobbly Duck"
              autoComplete="off"
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-2 text-xs italic text-red-500">
                {errors.name?.message}
              </p>
            )}
          </div>
        </div>

        <div className="my-4 h-[1px] w-full bg-slate-500" />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="flex flex-col">
            <label htmlFor="line1">Address Line 1</label>
            <input
              className="w-full border-2 border-solid border-black px-4 py-2"
              placeholder="4 Old Eldon Square"
              autoComplete="off"
              {...register("line1")}
            />
            {errors.line1 && (
              <p className="mt-2 text-xs italic text-red-500">
                {errors.line1?.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="line2">
              Address Line 2 <span className="text-slate-500">(Optional)</span>
            </label>
            <input
              className="w-full border-2 border-solid border-black px-4 py-2"
              placeholder=""
              autoComplete="off"
              {...register("line2")}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="city">City</label>
            <input
              className="w-full border-2 border-solid border-black px-4 py-2"
              placeholder="Newcastle upon Tyne"
              autoComplete="off"
              {...register("city")}
            />
            {errors.city && (
              <p className="mt-2 text-xs italic text-red-500">
                {errors.city?.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="postcode">Postcode</label>
            <input
              className="w-full border-2 border-solid border-black px-4 py-2"
              placeholder="NE1 7JG"
              autoComplete="off"
              {...register("postcode")}
            />
            {errors.postcode && (
              <p className="mt-2 text-xs italic text-red-500">
                {errors.postcode?.message}
              </p>
            )}
          </div>
        </div>

        <div className="my-4 h-[1px] w-full bg-slate-500" />

        <div className="flex flex-col">
          <label>
            Opening Hours <span className="text-slate-500">(Optional)</span>
          </label>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {days.map((day) => (
              <div key={day} className="flex flex-col">
                <label
                  className="text-slate-500 first-letter:uppercase"
                  htmlFor={`openingHours.${day}`}
                >
                  {day}
                </label>
                <input
                  className="w-full border-2 border-solid border-black px-4 py-2"
                  placeholder="12 - 11pm"
                  {...register(`openingHours.${day}`)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="my-4 h-[1px] w-full bg-slate-500" />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="flex flex-col">
            <label htmlFor="url">
              Website url <span className="text-slate-500">(Optional)</span>
            </label>
            <input
              className="w-full border-2 border-solid border-black px-4 py-2"
              placeholder="https://wobblyduck.co.uk/"
              autoComplete="off"
              {...register("url")}
            />
            {errors.url && (
              <p className="mt-2 text-xs italic text-red-500">
                {errors.url?.message}
              </p>
            )}
          </div>
        </div>

        <input className="btn mt-4 w-fit" type="submit" />
      </form>
    </Layout>
  );
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
