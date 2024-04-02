import Heading from "@/components/Heading";
import * as React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionInputProps {}

const DescriptionInput: React.FC<DescriptionInputProps> = ({}) => {
  const { control } = useFormContext();
  return (
    <div className="flex flex-col gap-6">
      <Heading
        title="How would you describe your place?"
        subtitle="Write a detailed description of your place to attract guest"
      />
      <FormField
        name="title"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Give your place a title that will attract guests"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="description"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Tell guests about your place, what makes it unique, and what they can expect when they stay."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DescriptionInput;
