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
