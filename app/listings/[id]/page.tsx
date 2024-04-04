import EmptyState from "@/components/EmptyState";
import HeartButton from "@/components/HeartButton";
import { Shell } from "@/components/ui/Shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useCountries from "@/hooks/useCountries";
import { getListingById } from "@/lib/getData";
import { ShareIcon } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import * as React from "react";

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
    title: listing?.title,
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
    <Shell variant="container" className="pt-24 flex flex-col">
      {/* add images grid 1 left 4right */}

      <Header
        title={listing.title}
        listingId={listing.id}
        locationValue={listing.locationValue}
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
      <div className="mt-4 flex flex-col gap-2">
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
      </div>
    </Shell>
  );
};

const ViewImages = () => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 group-hover:bg-opacity-20 flex items-center justify-center transition duration-300 ease-in-out " />
  );
};

const Header = ({
  title,
  listingId,
  locationValue,
}: {
  title: string;
  listingId: string;
  locationValue: string;
}) => {
  const { getByValue } = useCountries();
  const country = getByValue(locationValue as string);
  return (
    <div className="flex items-center justify-between pt-6 pb-4">
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold">{title}</h1>
        <div className="flex gap-1">
          <p className="text-gray-500">{country?.label}</p> <span>&#8226;</span>
          <p className="text-gray-500">{country?.region}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild variant={"ghost"} className="cursor-pointer ">
          <div className="flex items-center gap-1">
            <ShareIcon />
            Share
          </div>
        </Button>
        <Button asChild variant={"ghost"} className="cursor-pointer ">
          <div className="flex items-center gap-1">
            <HeartButton listingId={listingId} />
            Save
          </div>
        </Button>
      </div>
    </div>
  );
};

export default ListingDetail;
