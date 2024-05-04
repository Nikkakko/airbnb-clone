"use client";
import * as React from "react";
import { DatePickerWithRange } from "./listinDetail/DateRangePickerComponent";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { formatedPrice } from "@/lib/utils";
import { Button } from "./ui/button";
import { addDays } from "date-fns";
import TotalInputs from "./TotalInputs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReservationFormSechema } from "@/schemas";
import * as z from "zod";
import { Form } from "./ui/form";
import { Reservation } from "@prisma/client";
import createReservation from "@/_actions/createReservation";
import { useToast } from "./ui/use-toast";
import { LoaderIcon, Router } from "lucide-react";
import { useSession } from "next-auth/react";
import { useModalStore } from "@/store/modalStore";
import { useRouter } from "next/navigation";

interface DatePickerCardProps {
  price: number | null;
  listingId: string;
  reservations: Reservation[];
}

const DatePickerCard: React.FC<DatePickerCardProps> = ({
  price,
  listingId,
  reservations,
}) => {
  const [isPending, startTransaction] = React.useTransition();
  const { toast } = useToast();
  const { onOpen } = useModalStore();
  const user = useSession().data?.user;
  const router = useRouter();

  const form = useForm<z.infer<typeof ReservationFormSechema>>({
    resolver: zodResolver(ReservationFormSechema),
    defaultValues: {
      date: {
        from: undefined,
        to: undefined,
      },

      totalPrice: 0,
      listingId: listingId || "",
    },
  });

  function onSubmit(values: z.infer<typeof ReservationFormSechema>) {
    if (!user) {
      return onOpen("login", {});
    }
    startTransaction(async () => {
      try {
        const reserve = await createReservation(values);

        if (reserve?.error) {
          toast({
            title: "Error",
            description: reserve.error as string,
          });
          return;
        }

        toast({
          title: "Success",
          description: "Reservation created",
        });

        router.push("/trips");
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while creating the reservation",
        });
      }
    });
  }

  // get reserved dates

  const reservedDates = reservations.map(reservation => {
    return {
      from: new Date(reservation.startDate),
      to: new Date(reservation.endDate),
    };
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <Card className="shadow-md max-w-sm w-full">
          <CardHeader>
            <CardTitle>
              {formatedPrice(price ? price : 0)}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                night
              </span>
            </CardTitle>
            <CardDescription>
              Add your travel dates for exact pricing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DatePickerWithRange reservedDates={reservedDates} />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 items-start">
            <Button
              className="bg-gradient-to-r from-pink-500 to-pink-600 w-full 
              hover:from-pink-600 hover:to-pink-700"
              disabled={isPending}
            >
              {isPending ? (
                <LoaderIcon className="animate-spin h-5 w-5" />
              ) : (
                "Reserve"
              )}
            </Button>

            {/* generate ul list of total */}

            <TotalInputs price={price} />

            {/* generate total */}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default DatePickerCard;
