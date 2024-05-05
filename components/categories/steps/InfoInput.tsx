import * as React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { CircleMinus, CirclePlus } from "lucide-react";

interface InfoInputProps {
  searchModal?: boolean;
}

const InfoInput: React.FC<InfoInputProps> = ({ searchModal = false }) => {
  const { control } = useFormContext();
  return (
    <div className="flex flex-col gap-6">
      <Heading
        title={
          searchModal ? "More Infomration" : "Tell us more about your place"
        }
        subtitle="Fill in the details"
      />

      <FormField
        name="guestCount"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Counter
                value={field.value}
                onChange={field.onChange}
                title="Guest Count"
                subtitle="Maximum number of guests"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="roomCount"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Counter
                value={field.value}
                onChange={field.onChange}
                title="Room Count"
                subtitle="Number of rooms"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="bathroomCount"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Counter
                value={field.value}
                onChange={field.onChange}
                title="Bathroom Count"
                subtitle="Number of bathrooms"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const Counter = ({
  value,
  onChange,
  title,
  subtitle,
}: {
  value: number;
  onChange: (value: number) => void;
  title: string;
  subtitle: string;
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col ">
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-neutral-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          onClick={() => onChange(value - 1)}
          disabled={value === 1}
          className="p-2 rounded-md bg-neutral-100 hover:bg-neutral-200"
          type="button"
        >
          <CircleMinus className="text-black" />
        </Button>
        <input
          value={value}
          readOnly
          className="w-12 h-10 text-center bg-neutral-100 rounded-md select-none focus:outline-none"
        />
        <Button
          onClick={() => onChange(value + 1)}
          className="p-2 rounded-md bg-neutral-100 hover:bg-neutral-200"
          type="button"
        >
          <CirclePlus className="text-black" />
        </Button>
      </div>
    </div>
  );
};
export default InfoInput;
