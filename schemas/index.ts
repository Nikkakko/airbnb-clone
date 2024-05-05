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
    message: "Choose a category",
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

  imageSrc: z.array(z.string()).min(1, {
    message: "Image is required",
  }),

  price: z
    .number({
      invalid_type_error: "Enter Correct Price",
      required_error: "Price is required",
    })
    .min(1, {
      message: "Price is required",
    }),

  title: z.string().min(1, {
    message: "Title is required",
  }),

  description: z.string().min(1, {
    message: "Description is required",
  }),
});

const DATE_REQUIRED_ERROR = "Date is required.";

export const ReservationFormSechema = z.object({
  date: z
    .object(
      {
        from: z.date(),
        to: z.date(),
      },
      { required_error: DATE_REQUIRED_ERROR }
    )
    .refine(date => {
      return !!date.from;
    }, DATE_REQUIRED_ERROR),

  totalPrice: z.number().min(1, {
    message: "Total price is required",
  }),

  listingId: z.string().min(1, {
    message: "Listing id is required",
  }),
});

export const ReviewSchema = z.object({
  rating: z.string().refine(
    rating => {
      // return number between 1 and 5
      const num = parseInt(rating);
      return num;
    },
    { message: "Rating is required" }
  ),
  comment: z.string().min(1, {
    message: "Comment is required",
  }),
});

export const SearchSchema = z.object({
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
});
