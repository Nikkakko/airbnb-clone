"use server";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { RentSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export async function createListing(values: z.infer<typeof RentSchema>) {
  const verifiedValues = RentSchema.safeParse(values);
  const user = await currentUser();

  if (!verifiedValues.success) {
    return {
      error: "Invalid values",
    };
  }

  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  const {
    title,
    description,
    price,
    imageSrc,
    category,
    location,
    guestCount,
    roomCount,
    bathroomCount,
  } = values;

  try {
    await db.listing.create({
      data: {
        title,
        description,
        price,
        imageSrc,
        category,
        locationvalue: location,
        guestCount,
        roomCount,
        bathroomCount,
        userId: user.id as string,
      },
    });

    revalidatePath("/");
    return {
      success: true,
    };
  } catch (error) {
    return {
      error: "Something went wrong",
    };
  }
}
