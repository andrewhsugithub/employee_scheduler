import { z } from "zod";

// const countryCode = z.enum(CountryCodeList);

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type SignInFormSchema = z.infer<typeof SignInSchema>;
