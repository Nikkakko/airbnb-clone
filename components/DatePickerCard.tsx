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

interface DatePickerCardProps {
  price: number | null;
}

const DatePickerCard: React.FC<DatePickerCardProps> = ({ price }) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  return (
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
        <DatePickerWithRange date={date} setDate={setDate} />
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 items-start">
        <Button className="bg-gradient-to-r from-pink-500 to-pink-600 w-full ">
          Reserve
        </Button>

        {/* generate ul list of total */}

        <TotalInputs price={price} date={date} />

        {/* generate total */}
      </CardFooter>
    </Card>
  );
};

export default DatePickerCard;
