"use client";
import { Listing } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import * as React from "react";
import HeartButton from "./HeartButton";
import { useRouter } from "next/navigation";
import useCountries from "@/hooks/useCountries";
import { formatedPrice } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";

interface ListingCardProps {
  data: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ data }) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const session = useSession();
  const user = session.data?.user;
  const router = useRouter();
  const { getByValue } = useCountries();

  const location = getByValue(data.locationValue);

  const dataPrice = formatedPrice(data.price);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="col-span-1 cursor-pointer group">
      <div className="flex flex-col gap-2 w-full">
        <Carousel className="w-full max-w-xs " setApi={setApi}>
          <CarouselContent>
            {data.images?.map((imageSrc, index) => (
              <CarouselItem key={index} className="overflow-hidden rounded-md">
                <Link href={`/listings/${data.id}`}>
                  <Image
                    src={imageSrc}
                    alt="Listing Image"
                    priority
                    quality={100}
                    width={200}
                    height={150}
                    className="object-cover h-[200px] w-full group-hover:scale-110 transition "
                    sizes="200px"
                  />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2" />
          <div className="py-2 text-center text-sm text-white absolute bottom-0 left-0 right-0 bg-neutral-900 bg-opacity-50 rounded-b-md">
            {Array.from({ length: count }, (_, i) => i + 1).map(num => (
              <span
                key={num}
                className={`h-2 w-2 mx-1 rounded-full inline-block ${
                  num === current ? "bg-white" : "bg-white opacity-50"
                }`}
              />
            ))}
          </div>
          <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2" />
          <div className="absolute top-3 right-3 z-20">
            <HeartButton
              listingId={data.id}
              isFavorite={user?.favoriteIds?.includes(data.id) || false}
            />
          </div>
        </Carousel>

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
