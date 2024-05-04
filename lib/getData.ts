import db from "@/lib/db";
import { currentUser } from "./auth";

export async function getAllListing() {
  try {
    const listings = await db.listing.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return listings;
  } catch (error) {
    return [];
  }
}

export async function getListingById(id: string) {
  try {
    const listing = await db.listing.findUnique({
      where: {
        id,
      },

      include: {
        user: true,
        reservations: true,
        reviews: true,
      },
    });

    if (!listing) {
      return null;
    }
    return listing;
  } catch (error) {
    return null;
  }
}

export async function getUserReservations(listingId: string) {
  const user = await currentUser();
  if (!user) {
    return [];
  }

  try {
    const reservations = await db.reservation.findMany({
      where: {
        userId: user.id,
        listingId,
      },
      orderBy: {
        startDate: "desc",
      },
    });

    return reservations;
  } catch (error) {
    return [];
  }
}

export async function getUserReservationsAction(userId: string | undefined) {
  try {
    const reservations = await db.reservation.findMany({
      where: {
        userId,
      },
      include: {
        listing: true,
      },
      orderBy: {
        startDate: "desc",
      },
    });
    return reservations;
  } catch (error) {
    console.error("Failed to get reservations", error);
    return [];
  }
}

export async function getReviews(listingId: string) {
  const reviews = await db.review.findMany({
    where: {
      listingId,
    },
    include: {
      user: true,
    },
  });

  return reviews;
}
