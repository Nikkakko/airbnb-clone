import * as React from "react";
import Heading from "@/components/Heading";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCountries from "@/hooks/useCountries";
import dynamic from "next/dynamic";
import { useFormContext } from "react-hook-form";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

interface CountrySelectProps {}

const CountrySelect: React.FC<CountrySelectProps> = ({}) => {
  const { control } = useFormContext();
  const { getAll } = useCountries();

  return (
    <>
      <Heading
        title="Where is your place located?"
        subtitle="Help guests find your place easily."
      />
      <FormField
        name="location"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl className="w-full">
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="" side="bottom">
                {getAll().map(country => (
                  <SelectItem key={country.label} value={country.label}>
                    <div className="flex items-center w-full gap-3">
                      <div>
                        {country.label},
                        <span className="text-neutral-500">
                          {country.region}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <Map className="py-4" />
    </>
  );
};

export default CountrySelect;
