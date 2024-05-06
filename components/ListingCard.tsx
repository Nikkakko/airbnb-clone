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
import { formatDate } from "date-fns";
import { Button } from "./ui/button";
import { removeReservation } from "@/_actions/createReservation";
import { useToast } from "./ui/use-toast";
import { LoaderIcon } from "lucide-react";
interface ListingCardProps {
  data: Listing;
  reservation?: {
    startDate: Date;
    endDate: Date;
    reservationId: string;
  };
  isFavorite?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  isFavorite,
}) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const user = useSession().data?.user;
  const { getByValue } = useCountries();
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();

  const location = getByValue(data.locationValue);
  const dataPrice = formatedPrice(data.price);

  //prevent canceling reservation if the start date is today

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
        <Carousel className="w-full max-w-xs" setApi={setApi}>
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
                    className="object-cover min-w-[200px] h-[200px] w-full  "
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
              slider
              isFavorite={isFavorite as boolean}
            />
          </div>
        </Carousel>

        <div className="font-semibold text-lg">
          {location?.region}, {location?.label}
        </div>
        <div className="flex items-center gap-1">
          {!reservation ? (
            <p className="font-light text-neutral-500">{data.category}</p>
          ) : (
            // add start-end date
            <p className="font-light text-neutral-500">
              {formatDate(reservation.startDate, " MMM dd")} -{" "}
              {formatDate(reservation.endDate, " MMM dd")}
            </p>
          )}
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">{dataPrice}</div>
          {!reservation && <div className="text-neutral-500">/ night</div>}
        </div>
      </div>
      {reservation && (
        //cancel reservation
        <Button
          variant="destructive"
          className="w-full mt-2 h-10"
          onClick={() => {
            startTransition(async () => {
              const res = await removeReservation(reservation.reservationId);
              if (res?.error) {
                toast({
                  title: "Error",
                  description: res.error,
                });
                return;
              }
              toast({
                title: "Reservation canceled",
                description: "Your reservation has been canceled",
              });
            });
          }}
          disabled={isPending}
        >
          {isPending ? (
            <LoaderIcon className="animate-spin h-5 w-5" />
          ) : (
            "Cancel Reservation"
          )}
        </Button>
      )}
    </div>
  );
};

export default ListingCard;
