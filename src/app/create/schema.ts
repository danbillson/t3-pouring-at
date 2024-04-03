import { z } from "zod";

export const schema = z.object({
  name: z
    .string()
    .min(1, { message: "Please enter the name of your bar" })
    .min(2, { message: "The name of your bar must be at least 2 characters" }),
  slug: z
    .string()
    .min(1, { message: "Please enter a slug" })
    .min(2, { message: "Your slug must be at least 2 characters" })
    .regex(/^[a-zA-Z0-9-]+$/i, {
      message: "Your slug can only contain letters, numbers and dashes",
    }),
  line1: z
    .string()
    .min(1, { message: "Please enter the first line of the address" }),
  line2: z.string().optional(),
  city: z
    .string()
    .min(1, { message: "Please enter the city that your bar is in" }),
  postcode: z
    .string()
    .regex(/^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i, {
      message: "Please enter a valid postcode",
    })
    .min(1, { message: "Please enter the postcode of your bar" }),
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

export type FormValues = z.infer<typeof schema>;
