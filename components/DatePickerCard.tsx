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
import { Separator } from "./ui/separator";
import { DateRange } from "react-day-picker";
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

interface DatePickerCardProps {
  price: number | null;
  reservations: Reservation[];
}

const DatePickerCard: React.FC<DatePickerCardProps> = ({ price }) => {
  const [isPending, startTransaction] = React.useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof ReservationFormSechema>>({
    resolver: zodResolver(ReservationFormSechema),
    defaultValues: {
      date: {
        from: new Date(),
        to: addDays(new Date(), 7),
      },

      totalPrice: 0,
      listingId: "",
    },
  });

  function onSubmit(values: z.infer<typeof ReservationFormSechema>) {
    startTransaction(async () => {
      const result = await createReservation(values);
      if (result?.error) {
        toast({
          title: "Error",
          description: "An error occurred while creating the reservation",
        });
      } else {
        toast({
          title: "Success",
          description: "Reservation created",
        });
      }
    });

    console.log(values, "values");
  }

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
            <DatePickerWithRange />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 items-start">
            <Button
              className="bg-gradient-to-r from-pink-500 to-pink-600 w-full 
              hover:from-pink-600 hover:to-pink-700"
            >
              Reserve
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
