import { Shell } from "@/components/ui/Shell";
import * as React from "react";
import qs from "query-string";
import { getSearchResults } from "@/lib/getData";
import EmptyState from "@/components/EmptyState";
import ListingCard from "@/components/ListingCard";
import ListingCardSkeleton from "@/components/skeletons/ListingCardSkeleton";

interface SearchPageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const SearchPage: React.FC<SearchPageProps> = async ({
  params,
  searchParams,
}) => {
  const paramValues = {
    location: searchParams.location as string,
    guestCount: Number(searchParams.guestCount),
    roomCount: Number(searchParams.roomCount),
    bathroomCount: Number(searchParams.bathroomCount),
  };

  const getResults = await getSearchResults(paramValues);

  if (!getResults || !Array.isArray(getResults) || getResults.length === 0) {
    return (
      <Shell variant="container" className="py-24">
        <EmptyState
          title="No results found"
          subtitle="We couldn't find any listings matching your search criteria"
          showReset
        />
      </Shell>
    );
  }

  return (
    <Shell variant="container" className="py-24">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">Search Results</h1>
          <p className="text-gray-500">Results for {paramValues.location}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.isArray(getResults) &&
            getResults.map(listing => (
              <React.Suspense
                key={listing.id}
                fallback={<ListingCardSkeleton />}
              >
                <ListingCard key={listing.id} data={listing} />
              </React.Suspense>
            ))}
        </div>
      </div>
    </Shell>
  );
};

export default SearchPage;
