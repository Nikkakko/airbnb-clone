import Categories from "@/components/Categories";
import EmptyState from "@/components/EmptyState";
import ListingCard from "@/components/ListingCard";
import ListingCardSkeleton from "@/components/skeletons/ListingCardSkeleton";
import { Shell } from "@/components/ui/Shell";

import { getAllListing, getUserFavoriteListings } from "@/lib/getData";
import * as React from "react";

interface HomeProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Home({ params, searchParams }: HomeProps) {
  // const listings = await getAllListing();
  // const favoriteIds = await getUserFavoriteListings();

  //promise all
  const [listings, favoriteIds] = await Promise.all([
    getAllListing(),
    getUserFavoriteListings(),
  ]);

  const categoryParam =
    typeof searchParams.category === "string"
      ? searchParams.category
      : undefined;

  //filter by category
  const filteredListings = listings.filter(listing => {
    if (!categoryParam) {
      return true;
    }

    return listing.category.toLowerCase() === categoryParam.toLowerCase();
  });

  const isEmpty = filteredListings.length === 0;

  return (
    <main className="flex flex-col flex-1">
      <Categories />

      {isEmpty ? (
        <EmptyState showReset />
      ) : (
        <Shell variant="container" as="section">
          <div className="pt-24 grid  grid-cols-1  sm:grid-cols-2  md:grid-cols-3  lg:grid-cols-4 xl:grid-cols-5  gap-8">
            {filteredListings?.map(listing => {
              const isFavorite = favoriteIds?.some(fav => fav === listing.id);
              return (
                <React.Suspense
                  key={listing.id}
                  fallback={<ListingCardSkeleton />}
                >
                  <ListingCard data={listing} isFavorite={isFavorite} />
                </React.Suspense>
              );
            })}
          </div>
        </Shell>
      )}
    </main>
  );
}
