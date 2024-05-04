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

    //revalidate
    revalidatePath(`/listings/${data.listingId}`);
  } catch (error) {
    return {
      error: "An error occurred while creating the reservation",
    };
  }
}

export async function removeReservation(reservationId: string) {
  const user = await currentUser();

  if (!user) {
    return {
      error: "You must be logged in to remove a reservation",
    };
  }

  //prevent user from deleting other users reservations
  const reservation = await db.reservation.findUnique({
    where: {
      id: reservationId,
    },
  });

  if (!reservation || reservation.userId !== user.id) {
    return {
      error: "You can't remove this reservation",
    };
  }

  //prevent user from deleting reservation if the start date is today
  if (new Date(reservation.startDate) <= new Date()) {
    return {
      error: "You can't remove a reservation that has already started",
    };
  }

  try {
    await db.reservation.delete({
      where: {
        id: reservationId,
        userId: user.id,
      },
    });

    revalidatePath("/trips");
  } catch (error) {
    return {
      error: "An error occurred while removing the reservation",
    };
  }
}
