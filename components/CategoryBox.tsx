"use client";
import { Category } from "@/data/sitedata";
import { cn } from "@/lib/utils";
import * as React from "react";
import qs from "query-string";
import { useParams, useRouter } from "next/navigation";
interface CategoryBoxProps {
  category: Category;
  selected: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({ category, selected }) => {
  const router = useRouter();
  const params = useParams();

  const handleClick = React.useCallback(() => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const newQuery = {
      ...currentQuery,
      category: category.label,
    };

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: newQuery,
      },
      {
        skipEmptyString: true,
        skipNull: true,
      }
    );

    router.push(url);
  }, [category.label, params, router]);
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
