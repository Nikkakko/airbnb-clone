"use server";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { ReservationFormSechema } from "@/schemas";
import * as z from "zod";

export default async function createReservation(
  values: z.infer<typeof ReservationFormSechema>
) {
  const verifiedValues = ReservationFormSechema.safeParse(values);
  const user = await currentUser();

  if (!user) {
    return {
      error: "You must be logged in to make a reservation",
    };
  }

  if (!verifiedValues.success) {
    return {
      error: verifiedValues.error.errors,
    };
  }

  const { data } = verifiedValues;

  try {
    await db.reservation.create({
      data: {
        userId: user.id as string,
        listingId: data.listingId,
        totalPrice: data.totalPrice,
        endDate: data.date.to as Date,
        startDate: data.date.from as Date,
      },
    });
    await db.listing.update({
      where: {
        id: data.listingId,
      },
      data: {
        reservations: {
          create: {
            userId: user.id as string,
            startDate: data.date.from as Date,
            endDate: data.date.to as Date,
            totalPrice: data.totalPrice,
          },
        },
      },
    });
  } catch (error) {
    return {
      error: "An error occurred while creating the reservation",
    };
  }
}
