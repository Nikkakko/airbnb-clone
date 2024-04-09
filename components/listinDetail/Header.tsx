"use client";

import useCountries from "@/hooks/useCountries";
import * as React from "react";
import { Button } from "../ui/button";
import { ShareIcon } from "lucide-react";
import HeartButton from "../HeartButton";

interface HeaderProps {}

const Header = ({
  title,
  listingId,
  locationValue,
}: {
  title: string;
  listingId: string;
  locationValue: string;
}) => {
  const { getByValue } = useCountries();
  const country = getByValue(locationValue as string);
  //write share functionallity copy to clipboard

  const handleShare = React.useCallback(() => {
    navigator.clipboard.writeText(
      `Check out this listing: ${title} at ${country?.label}, ${country?.region}`
    );
  }, [title, country]);

  return (
    <div className="flex items-center justify-between pt-6 pb-4">
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold">{title}</h1>
        <div className="flex gap-1">
          <p className="text-gray-500">{country?.label}</p> <span>&#8226;</span>
          <p className="text-gray-500">{country?.region}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          asChild
          variant={"ghost"}
          className="cursor-pointer "
          onClick={handleShare}
        >
          <div className="flex items-center gap-1">
            <ShareIcon />
            Share
          </div>
        </Button>
        <Button asChild variant={"ghost"} className="cursor-pointer ">
          <div className="flex items-center gap-1">
            <HeartButton listingId={listingId} />
            Save
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Header;
