"use client";
import { cn, formatedPrice } from "@/lib/utils";
import { addDays } from "date-fns";
import * as React from "react";
import { DateRange } from "react-day-picker";
import { Separator } from "./ui/separator";

interface TotalInputsProps {
  price: number | null;
  date?: DateRange | undefined;
}

const TotalInputs: React.FC<TotalInputsProps> = ({ price, date }) => {
  const from = date?.from ? date.from : new Date();
  const to = date?.to ? date.to : addDays(new Date(), 7);

  const nights = Math.ceil(
    (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)
  );

  const nightlyPrice = price ? price * nights : 0;

  const totalInputs = React.useMemo(() => {
    return [
      {
        label: "Nightly price",
        price: nightlyPrice,
      },
      {
        label: "Cleaning fee",
        price: 27,
      },
      {
        label: "Service fee",
        price: 92,
      },
    ];
  }, [nightlyPrice]);

  const totalPrice = totalInputs.reduce((acc, { price }) => acc + price, 0);

  return (
    <ul className="w-full space-y-2">
      {totalInputs.map(({ label, price }) => (
        <li key={label} className="flex justify-between">
          <span>{label}</span>
          <span>{formatedPrice(price)}</span>
        </li>
      ))}
      <Separator />
      <li className="flex justify-between">
        <span className="font-bold">Total</span>
        <span
          className={cn(
            "font-bold",
            totalPrice === 0 ? "text-muted-foreground" : "text-black"
          )}
        >
          {formatedPrice(totalPrice)}
        </span>
      </li>
    </ul>
  );
};

export default TotalInputs;
