import db from "@/lib/db";
import { currentUser } from "./auth";
import { SearchSchema } from "@/schemas";
import { z } from "zod";
import { getErrorMessage } from "./handle-error";
import { revalidatePath } from "next/cache";

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

export async function getUserFavoriteListings() {
  const user = await currentUser();

  if (!user || !user.favoriteIds) {
    return [];
  }

  // Return user's favoriteIds
  return user.favoriteIds;
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

export async function getFavorites() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  //get users favorite ids from the database and find the listings
  const getUser = await db.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!getUser) {
    return null;
  }

  try {
    const favorites = await db.listing.findMany({
      where: {
        id: {
          in: getUser.favoriteIds,
        },
      },
    });

    return favorites;
  } catch (error) {
    console.error("Failed to get favorites", error);
  }
}

export async function getSearchResults(
  searchParams: z.infer<typeof SearchSchema> | undefined
) {
  if (!searchParams) return console.error("No search params");

  const { location, guestCount, roomCount, bathroomCount } = searchParams;

  const parsedValue = SearchSchema.safeParse(searchParams);

  if (!parsedValue.success) {
    return {
      error: parsedValue.error.errors,
    };
  }

  //guest room and bathroomCount shuld be less then listing count

  try {
    const listings = await db.listing.findMany({
      where: {
        guestCount: {
          gte: guestCount,
        },
        roomCount: {
          gte: roomCount,
        },
        bathroomCount: {
          gte: bathroomCount,
        },
        locationValue: {
          mode: "insensitive",
          contains: location.toLowerCase(),
        },
      },
    });

    revalidatePath("/search");
    return listings;
  } catch (error) {
    console.error("Failed to get search results", error);
    return getErrorMessage(error);
  }
}
