import EmptyState from "@/components/EmptyState";
import ListingCard from "@/components/ListingCard";
import LoginButton from "@/components/LoginButton";
import ListingCardSkeleton from "@/components/skeletons/ListingCardSkeleton";
import { Shell } from "@/components/ui/Shell";
import { currentUser } from "@/lib/auth";
import { getFavorites, getUserFavoriteListings } from "@/lib/getData";
import * as React from "react";

interface FavoritesPageProps {}

const FavoritesPage: React.FC<FavoritesPageProps> = async ({}) => {
  // const favorites = await getFavorites();
  // const favoriteIds = await getUserFavoriteListings();
  // const user = await currentUser();

  //promise all
  const [favorites, favoriteIds, user] = await Promise.all([
    getFavorites(),
    getUserFavoriteListings(),
    currentUser(),
  ]);

  if (!user) {
    return (
      <Shell
        variant="container"
        className="py-24 justify-center items-center flex flex-col space-y-4"
      >
        <h1 className="text-3xl font-bold text-center">Favorites</h1>
        <p className="text-center">
          You need to be logged in to view your favorites.
        </p>
        <LoginButton />
      </Shell>
    );
  }

  if (favorites?.length === 0) {
    return (
      <Shell variant="container" className="py-24">
        <EmptyState
          title="You have no favorites"
          subtitle="You have not added any listings to your favorites yet"
        />
      </Shell>
    );
  }

  return (
    <Shell variant="container" className="py-24">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">My Favorites</h1>
          <p className="text-gray-500">
            View your favorite listings and easily book them
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 md:gap-3 xl:gap-4 md:grid-cols-2 xl:grid-cols-4">
          {favorites?.map(listing => (
            <React.Suspense fallback={<ListingCardSkeleton />} key={listing.id}>
              <ListingCard
                data={listing}
                isFavorite={favoriteIds?.some(fav => fav === listing.id)}
              />
            </React.Suspense>
          ))}
        </div>
      </div>
    </Shell>
  );
};

export default FavoritesPage;
