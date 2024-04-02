import Heading from "@/components/Heading";
import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { useFormContext } from "react-hook-form";

interface PriceInputProps {}

const PriceInput: React.FC<PriceInputProps> = ({}) => {
  const { control } = useFormContext();
  return (
    <div className="flex flex-col gap-6">
      <Heading
        title="How much do you want to charge per night?"
        subtitle="Set a price that will attract guests"
      />

      <FormField
        name="price"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Set a price for your place"
                value={field.value}
                type="number"
                onChange={e => {
                  field.onChange(parseFloat(e.target.value));
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PriceInput;
