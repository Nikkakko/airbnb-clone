import Heading from "@/components/Heading";
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
                      <div>{country.flag}</div>
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
    </>
  );
};

export default CountryInput;

/* 

     <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage email addresses in your{" "}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
*/
