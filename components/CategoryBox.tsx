"use client";
import { Category } from "@/data/sitedata";
import { cn } from "@/lib/utils";
import * as React from "react";
import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
interface CategoryBoxProps {
  category: Category;
  selected: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({ category, selected }) => {
  const router = useRouter();
  const params = useSearchParams();

  const handleClick = React.useCallback(() => {
    const currentCategory = params.get("category");
    const newCategory = category.label.toLowerCase();
    const query =
      currentCategory === newCategory ? {} : { category: newCategory };

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: query,
      },
      {
        skipEmptyString: true,
        skipNull: true,
      }
    );

    router.push(url);
  }, [category.label, router, params]);
  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "gap-2",
        "p-3",
        "border-b-2",
        "hover:text-neutral-800",
        "transition",
        "cursor-pointer",
        selected ? "border-b-neutral-800" : "border-transparent",
        selected ? "text-neutral-800" : "text-neutral-500"
      )}
    >
      {<category.icon />}
      <div className="font-medium text-sm">{category.label}</div>
    </div>
  );
};

export default CategoryBox;
