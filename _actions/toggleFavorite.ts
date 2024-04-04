"use server";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleFavoriteAction(listingId: string) {
  const user = await currentUser();

  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  const currentDbUser = await db.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!currentDbUser) {
    return {
      error: "User not found",
    };
  }

  const hasFavorited = currentDbUser.favoriteIds.includes(listingId);

  try {
    if (hasFavorited) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          favoriteIds: {
            set: currentDbUser.favoriteIds.filter(id => id !== listingId),
          },
        },
      });
    } else {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          favoriteIds: {
            set: [...currentDbUser.favoriteIds, listingId],
          },
        },
      });
    }

    revalidatePath("/");

    return {
      success: true,
      hasFavorited: !hasFavorited,
    };
  } catch (error) {
    return {
      error: "Something went wrong",
    };
  }
}
