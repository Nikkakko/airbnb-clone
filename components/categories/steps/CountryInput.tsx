import Heading from "@/components/Heading";
import Map from "@/components/Map";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NoSsr from "@/hooks/noSsr";
import useCountries from "@/hooks/useCountries";

import * as React from "react";
import { useFormContext } from "react-hook-form";

interface CountryInputProps {}

const CountryInput: React.FC<CountryInputProps> = ({}) => {
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

      <NoSsr>
        <Map />
      </NoSsr>
    </>
  );
};

export default CountryInput;
