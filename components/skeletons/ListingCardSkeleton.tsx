import * as React from "react";
import { Skeleton } from "../ui/skeleton";

interface ListingCardSkeletonProps {}

const ListingCardSkeleton: React.FC<ListingCardSkeletonProps> = ({}) => {
  return (
    <div className="flex flex-col">
      <Skeleton className="h-48 w-56" />
      <div className="flex flex-col gap-2  mt-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-36" />
      </div>
    </div>
  );
};

export default ListingCardSkeleton;
