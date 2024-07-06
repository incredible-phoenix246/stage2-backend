import { z } from "zod";
import validator from "validator";

export const userSchema = z.object({
  firstName: z.string().min(3, {
    message: "first name is required",
  }),
  lastName: z.string().min(3, {
    message: "last name is required",
  }),
  email: z.string().email(),
  password: z.string().min(8, {
    message: "password must be at least 8 characters",
  }),
  phone: z.string().refine(validator.isMobilePhone, {
    message: "phone number is invalid",
  }),
});

export const organisationSchema = z.object({
  name: z.string().min(3, {
    message: "name is required",
  }),
  description: z.string().min(8, {
    message: "description is required and must be at least 8 characters",
  }),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "password must be at least 8 characters",
  }),
});
