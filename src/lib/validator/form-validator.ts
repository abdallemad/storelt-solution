import { z } from "zod";

export const authFormSchema = (type: "sign-in" | "sign-up") => {
  return z.object({
    email: z
      .string({ message: "Require field" })
      .email({ message: "Invalid email" })
      .min(5),
    fullname:
      type === "sign-up"
        ? z.string({ message: "required field" }).min(5)
        : z.string().optional(),
  });
};
