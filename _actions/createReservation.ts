"use server";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { ReservationFormSechema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export default async function createReservation(
  values: z.infer<typeof ReservationFormSechema>
) {
  //remove all reservations
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

  // Check if the user is trying to reserve their own listing
  const listing = await db.listing.findUnique({
    where: {
      id: data.listingId,
    },
  });

  if (listing?.userId === user.id) {
    return {
      error: "You can't reserve your own listing",
    };
  }

  // Check if the listing is already reserved
  const reservations = await db.reservation.findMany({
    where: {
      listingId: data.listingId,
      OR: [
        {
          startDate: {
            lte: data.date.to,
          },
          endDate: {
            gte: data.date.from,
          },
        },
        {
          startDate: {
            lte: data.date.from,
          },
          endDate: {
            gte: data.date.to,
          },
        },
      ],
    },
  });

  if (reservations.length) {
    return {
      error: "This listing is already reserved for the selected dates",
    };
  }

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

    //revalidate
    revalidatePath(`/listings/${data.listingId}`);
  } catch (error) {
    return {
      error: "An error occurred while creating the reservation",
    };
  }
}
