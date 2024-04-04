import * as React from "react";
import { Skeleton } from "../ui/skeleton";

interface ListingCardSkeletonProps {}

const ListingCardSkeleton: React.FC<ListingCardSkeletonProps> = ({}) => {
  return (
    <div className="flex flex-col">
      <Skeleton className="h-48 w-48" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};

export default ListingCardSkeleton;
