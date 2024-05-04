"use client";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem } from "../ui/form";

interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  reservedDates?: DateRange[];
}

export function DatePickerWithRange({
  className,
  reservedDates,
}: DatePickerWithRangeProps) {
  const { control } = useFormContext();

  const disabledDates = [
    { before: new Date() },
    ...(reservedDates || []).map(date => ({
      from: date.from,
      to: date.to,
    })),
  ];

  return (
    <div className={cn("grid gap-2", className)}>
      <FormField
        name="date"
        control={control}
        render={({ field }) => (
          <FormItem>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field?.value.from ? (
                    field.value.to ? (
                      <>
                        {format(field.value.from, "LLL dd, y")} -{" "}
                        {format(field.value.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(field.value.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={field.value.from}
                  selected={{ from: field.value.from!, to: field.value.to }}
                  onSelect={field.onChange}
                  numberOfMonths={2}
                  disabled={disabledDates}
                />
              </PopoverContent>
            </Popover>
          </FormItem>
        )}
      />
    </div>
  );
}
