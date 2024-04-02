import Heading from "@/components/Heading";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { categories } from "@/data/sitedata";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useFormContext } from "react-hook-form";

interface CategoryInputProps {}

const CategoryInput: React.FC<CategoryInputProps> = ({}) => {
  const { control } = useFormContext();
  return (
    <>
      <Heading
        title="Which of these describes your place?"
        subtitle="pick a category"
      />

      <FormField
        name="category"
        control={control}
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto space-y-0">
            {categories.map(category => (
              <FormControl key={category.label}>
                <div
                  onClick={() => {
                    field.onChange(category.label);
                  }}
                  className={cn(
                    "rounded-xl border-2 col-span-1 p-4 flex flex-col gap-3 hover:border-black transition cursor-pointer",
                    field.value === category.label &&
                      "bg-neutral-100 border-black"
                  )}
                >
                  <category.icon size={30} />
                  <div className="font-semibold">{category.label}</div>
                </div>
              </FormControl>
            ))}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default CategoryInput;
