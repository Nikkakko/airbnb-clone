import EmptyState from "@/components/EmptyState";
import ListingCard from "@/components/ListingCard";
import ListingCardSkeleton from "@/components/skeletons/ListingCardSkeleton";
import { Shell } from "@/components/ui/Shell";
import { currentUser } from "@/lib/auth";
import { getUserReservations, getUserReservationsAction } from "@/lib/getData";
import { redirect } from "next/navigation";
import * as React from "react";

interface PageTripsProps {}

const PageTrips: React.FC<PageTripsProps> = async ({}) => {
  const user = await currentUser();

  //use promise all to get all the reservations

  if (!user) {
    return (
      <EmptyState
        title="You need to be logged in to view your trips"
        subtitle="Login or create an account to view your trips"
      />
    );
  }
  const reservations = await getUserReservationsAction(user.id);

  if (reservations.length === 0) {
    return (
      <EmptyState
        title="You have no trips"
        subtitle="You have not made any reservations yet"
      />
    );
  }

  return (
    <Shell variant="container" className="py-24">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">My trips</h1>
          <p className="text-gray-500">View your upcoming and past trips</p>
        </div>

        <div className="grid grid-cols-1 gap-2 md:gap-3 xl:gap-4 md:grid-cols-2 xl:grid-cols-4">
          {reservations.map(reservation => (
            <React.Suspense
              key={reservation.id}
              fallback={<ListingCardSkeleton />}
            >
              <ListingCard
                data={reservation.listing}
                reservation={{
                  startDate: reservation.startDate,
                  endDate: reservation.endDate,
                  reservationId: reservation.id,
                }}
              />
            </React.Suspense>
          ))}
        </div>
      </div>
    </Shell>
  );
};

export default PageTrips;
