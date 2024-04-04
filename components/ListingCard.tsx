"use client";
import { Listing } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import * as React from "react";
import HeartButton from "./HeartButton";
import { useRouter } from "next/navigation";
import useCountries from "@/hooks/useCountries";
import { formatedPrice } from "@/lib/utils";

interface ListingCardProps {
  data: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ data }) => {
  const session = useSession();
  const user = session.data?.user;
  const router = useRouter();
  const { getByValue } = useCountries();

  const location = getByValue(data.locationvalue);

  const dataPrice = formatedPrice(data.price);

  return (
    <div
      className="col-span-1 cursor-pointer group"
      onClick={() => router.push(`/listings/${data.id}`)}
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full h-[200px] relative overflow-hidden rounded-xl">
          <Image
            fill
            className="object-cover h-full w-full group-hover:scale-110 transition"
            src={data.imageSrc}
            alt="Listing"
            priority
            quality={100}
            sizes="200px"
          />
          <div className="absolute top-3 right-3">
            <HeartButton
              listingId={data.id}
              isFavorite={user?.favoriteIds?.includes(data.id) || false}
            />
          </div>
        </div>
        <div className="font-semibold text-lg">
          {location?.region}, {location?.label}
        </div>
        <div className="font-light text-neutral-500">{data.category}</div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">{dataPrice}</div>
          <div className="text-neutral-500">/ night</div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
