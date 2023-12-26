// import PhoneInput, { isValidNumber } from "react-native-phone-number-input";
// import { CountryCodeList } from "react-native-country-picker-modal";
import { z } from "zod";

// const countryCode = z.enum(CountryCodeList);

export const AuthSchema = z
  .object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    photoUrl: z.string().url().optional(),
    //   phone: z
    //     .object({
    //       country_code: countryCode,
    //       phone_number: z.string(),
    //     })
    //     .refine((val) => isValidNumber(val.phone_number, val.country_code), {
    //       message: "Invalid phone number",
    //     }),
  })
  .refine((val) => val.password === val.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type AuthFormSchema = z.infer<typeof AuthSchema>;
