"use client";
import * as React from "react";
import { Shell } from "./ui/Shell";
import { categories } from "@/data/sitedata";
import CategoryBox from "./CategoryBox";
import { usePathname, useSearchParams } from "next/navigation";

interface CategoriesProps {}

const Categories: React.FC<CategoriesProps> = ({}) => {
  const params = useSearchParams();
  const categoryParam = params?.get("category");

  return (
    <Shell variant="container" as="section" className="sticky top-20">
      <div
        className=" pt-4
          flex 
          flex-row 
          items-center 
          justify-between
          overflow-x-auto"
      >
        {categories.map((category, index) => (
          <CategoryBox
            key={index}
            category={category}
            selected={category.label === categoryParam}
          />
        ))}
      </div>
    </Shell>
  );
};

export default Categories;
