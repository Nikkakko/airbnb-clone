import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const RentSchema = z.object({
  category: z.string().min(1, {
    message: "Category is required",
  }),

  location: z.string().min(1, {
    message: "Location is required",
  }),

  guestCount: z.number().min(1, {
    message: "Guest count is required",
  }),

  roomCount: z.number().min(1, {
    message: "Room count is required",
  }),

  bathroomCount: z.number().min(1, {
    message: "Bathroom count is required",
  }),

  imageSrc: z.string().min(1, {
    message: "Image is required",
  }),

  price: z.number().min(1, {
    message: "Price is required",
  }),

  title: z.string().min(1, {
    message: "Title is required",
  }),

  description: z.string().min(1, {
    message: "Description is required",
  }),
});
