"use server";

import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { ReviewSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export async function addReviewAction(
  values: z.infer<typeof ReviewSchema>,
  listingId: string
) {
  const user = await currentUser();
  const verifiedValues = ReviewSchema.safeParse(values);

  if (!user) {
    return {
      error: "You must be logged in to make a review",
    };
  }

  if (!verifiedValues.success) {
    return {
      error: verifiedValues.error.errors,
    };
  }

  const { data } = verifiedValues;

  //find the listing by id and add the review
  const listing = await db.listing.findUnique({
    where: {
      id: listingId,
    },
  });

  if (!listing) {
    return {
      error: "Listing not found",
    };
  }

  try {
    await db.review.create({
      data: {
        comment: data.comment,
        rating: parseInt(data.rating),
        listingId: listingId,
        userId: user.id as string,
      },
    });

    revalidatePath(`/listings/${listingId}`);

    return {
      success: true,
    };
  } catch (error) {
    return {
      error: "An error occurred",
    };
  }
}

export async function getReviews(listingId: string) {
  const reviews = await db.listing.findMany({
    where: {
      id: listingId,
    },
  });

  return reviews;
}

export async function removeReview(reviewId: string) {
  const user = await currentUser();
  if (!user) {
    return {
      error: "You must be logged in to remove a review",
    };
  }

  const review = await db.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    return {
      error: "Review not found",
    };
  }

  if (review.userId !== user.id) {
    return {
      error: "You do not have permission to remove this review",
    };
  }

  try {
    await db.review.delete({
      where: {
        id: reviewId,
      },
    });

    revalidatePath(`/listings/${review.listingId}`);

    return {
      success: true,
    };
  } catch (error) {
    return {
      error: "An error occurred",
    };
  }
}
