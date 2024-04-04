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
