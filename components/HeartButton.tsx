"use client";
import * as React from "react";
import { toggleFavoriteAction } from "@/_actions/toggleFavorite";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { useModalStore } from "@/store/modalStore";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";

interface HeartButtonProps {
  listingId: string;
  isFavorite: boolean;
}

const HeartButton: React.FC<HeartButtonProps> = ({ listingId, isFavorite }) => {
  const [hasFavorited, setHasFavorited] = React.useState(false);
  const { onOpen } = useModalStore();
  const user = useSession().data?.user;
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();

  //add stop propagation
  const toggleFavorite = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();

    if (!user) {
      return onOpen("login", {});
    }
    setHasFavorited(prev => !prev);

    startTransition(async () => {
      try {
        const { hasFavorited, error, success } = await toggleFavoriteAction(
          listingId
        );
        toast({
          title: success ? "Success" : "Error",
          description: success
            ? hasFavorited
              ? "Listing added to favorites"
              : "Listing removed from favorites"
            : error,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while toggling favorite",
        });
      }
    });
  };

  return (
    <Button
      variant={"ghost"}
      onClick={toggleFavorite}
      className="hover:opacity-80 transition cursor-point disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-1"
    >
      <div className="flex items-center gap-1">
        {hasFavorited || isFavorite ? (
          <AiFillHeart size={24} className="fill-rose-500" />
        ) : (
          <AiOutlineHeart size={28} className="fill-black" />
        )}
      </div>
      Save
    </Button>
  );
};

export default HeartButton;
