"use client";

import useCountries from "@/hooks/useCountries";
import * as React from "react";
import { Button } from "../ui/button";
import { ShareIcon } from "lucide-react";
import HeartButton from "../HeartButton";
import { useToast } from "../ui/use-toast";

interface HeaderProps {}

const Header = ({
  title,
  listingId,
  locationValue,
  isFavorite,
}: {
  title: string;
  listingId: string;
  locationValue: string;
  isFavorite: boolean;
}) => {
  const { getByValue } = useCountries();
  const country = getByValue(locationValue as string);
  const { toast } = useToast();
  const [isCopied, setIsCopied] = React.useState(false);

  const handleShare = React.useCallback(() => {
    // copy link to clipboard
    navigator.clipboard.writeText(window.location.href);

    // show toast

    toast({
      title: "Copied",
      description: "Link copied to clipboard",
    });

    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }, [toast]);

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
            {isCopied ? "Copied" : "Share"}
          </div>
        </Button>

        <HeartButton listingId={listingId} isFavorite={isFavorite} />
      </div>
    </div>
  );
};

export default Header;
