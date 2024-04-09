import { categories } from "@/data/sitedata";
import * as React from "react";

interface ListingCategoryProps {
  category: string | null;
  description: string | null;
}

const ListingCategory: React.FC<ListingCategoryProps> = ({
  category,
  description,
}) => {
  const Icon = categories.find(cat => cat.label === category)?.icon;
  return (
    <div className="flex  gap-2 py-4">
      <div className="w-6 h-6">{Icon && <Icon size={26} />}</div>
      <div className="flex flex-col  gap-1">
        <p className="text-lg font-bold">{category}</p>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default ListingCategory;
