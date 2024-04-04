import Categories from "@/components/Categories";
import EmptyState from "@/components/EmptyState";
import ListingCard from "@/components/ListingCard";
import ListingCardSkeleton from "@/components/skeletons/ListingCardSkeleton";
import { Shell } from "@/components/ui/Shell";
import { getAllListing } from "@/lib/getData";
import * as React from "react";

interface HomeProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Home({ params, searchParams }: HomeProps) {
  const listings = await getAllListing();
  const isEmpty = listings.length === 0;

  const categoryParam = searchParams.category as string | undefined;

  return (
    <main className="flex flex-col flex-1">
      <Categories />

      {isEmpty ? (
        <EmptyState showReset />
      ) : (
        <Shell variant="container" as="section">
          <div className="pt-24 grid  grid-cols-1  sm:grid-cols-2  md:grid-cols-3  lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
            {listings?.map(listing => (
              <React.Suspense
                key={listing.id}
                fallback={<ListingCardSkeleton />}
              >
                <ListingCard data={listing} />
              </React.Suspense>
            ))}
          </div>
        </Shell>
      )}
    </main>
  );
}
