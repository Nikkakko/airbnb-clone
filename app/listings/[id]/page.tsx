import * as React from "react";
import EmptyState from "@/components/EmptyState";

import Header from "@/components/listinDetail/Header";
import ListingCategory from "@/components/listinDetail/ListingCategory";
import { Shell } from "@/components/ui/Shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Separator } from "@/components/ui/separator";

import { getListingById, getReviews } from "@/lib/getData";
import { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";

import DatePickerCard from "@/components/DatePickerCard";
import ReviewSection from "@/components/ReviewSection";

import AddReviewModal from "@/components/modals/AddReview";
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

interface ListingDetailProps {
  params: {
    id: string;
  };

  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(
  { params, searchParams }: ListingDetailProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id;

  const listing = await getListingById(id);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title:
      listing?.title +
      " | Vacation Rentals, Homes, Experiences & Places - Airbnb",
    description: listing?.category,
    openGraph: {
      images: ["/some-specific-page-image.jpg", ...previousImages],
    },
  };
}

const ListingDetail: React.FC<ListingDetailProps> = async ({
  params: { id },
}) => {
  const listing = await getListingById(id);
  const reviews = await getReviews(id);

  const isFavorite = listing?.user.favoriteIds.includes(listing.id);

  const houseInfo = [
    {
      id: "1",
      title: "Guests",
      value: listing?.guestCount,
    },
    {
      id: "2",
      title: "Rooms",
      value: listing?.roomCount,
    },
    {
      id: "3",
      title: "Bathrooms",
      value: listing?.bathroomCount,
    },
  ];

  if (!listing) {
    return (
      <EmptyState
        title="Listing not found"
        subtitle="The listing you are looking for does not exist."
      />
    );
  }
  return (
    <Shell variant="container" className="py-24 flex flex-col">
      {/* add images grid 1 left 4right */}
      <Header
        title={listing.title}
        listingId={listing.id}
        locationValue={listing.locationValue}
        isFavorite={isFavorite || false}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4  rounded-xl overflow-hidden">
        <div className="col-span-1">
          <div className="relative w-[560px] h-full group object-cover  cursor-pointer overflow-hidden">
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              priority
              quality={100}
              className="object-cover"
            />
            {/* add overlay on group hover */}
            <ViewImages />
          </div>
        </div>
        <div className="col-span-1 grid grid-cols-2 gap-2">
          {listing.images.slice(1, 5).map(image => (
            <div
              key={image}
              className="relative w-full group h-[240px] object-cover  overflow-hidden cursor-pointer"
            >
              <Image
                key={image}
                src={image}
                fill
                alt={listing.title}
                className="object-cover "
                priority
                quality={100}
              />
              <ViewImages />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 ">
        {/* add author */}
        <div className="flex items-center gap-2">
          {listing.user ? (
            <div className="flex items-center gap-1">
              <Avatar>
                <AvatarImage
                  src={listing.user?.image as string}
                  alt={listing.user?.name as string}
                />
                <AvatarFallback>
                  <Image
                    src={"/images/placeholder.jpg"}
                    alt={"user-avatar"}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </AvatarFallback>
              </Avatar>
            </div>
          ) : null}
          <p className="text-lg font-bold">Hosted by {listing.user.name}</p>
        </div>

        <div className="flex gap-4 ">
          {houseInfo.map(info => (
            <div
              key={info.id}
              className="flex items-center justify-center gap-1"
            >
              <p className="text-lg font-bold">{info.value}</p>
              <p className="text-gray-500">{info.title}</p>
            </div>
          ))}
        </div>
        <Separator />
        <ListingCategory
          category={listing.category}
          description={listing.description}
        />
        <Separator />

        <div className="flex items-start gap-6">
          <Map location={listing?.locationValue} className="" />

          <DatePickerCard
            price={listing.price}
            reservations={listing.reservations}
            listingId={listing.id}
          />
        </div>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col gap-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 lg:grid-cols-4">
          {reviews.map(review => (
            <ReviewSection key={review.id} review={review} />
          ))}
        </div>
        <div className="flex flex-col gap-1 items-start">
          {reviews.length === 0 && (
            <>
              <p className="text-lg font-bold">No reviews yet</p>
              <p className="text-gray-500">Be the first to review this place</p>
            </>
          )}
          <AddReviewModal listingId={listing.id} />
        </div>
      </div>
    </Shell>
  );
};

const ViewImages = () => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 group-hover:bg-opacity-20 flex items-center justify-center transition duration-300 ease-in-out " />
  );
};

export default ListingDetail;
