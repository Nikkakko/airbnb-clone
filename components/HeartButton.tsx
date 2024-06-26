"use client";
import * as React from "react";
import { toggleFavoriteAction } from "@/_actions/toggleFavorite";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { useModalStore } from "@/store/modalStore";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface HeartButtonProps {
  listingId: string;
  isFavorite: boolean;
  slider?: boolean;
}

const HeartButton: React.FC<HeartButtonProps> = ({
  listingId,
  isFavorite,
  slider,
}) => {
  const [optimisticLikes, addOptimisticLikes] =
    React.useOptimistic<boolean>(isFavorite);
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

    startTransition(async () => {
      try {
        addOptimisticLikes(prev => !prev);
        await toggleFavoriteAction(listingId);
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while toggling favorite",
        });
      }
    });
  };

  if (slider) {
    return (
      <button onClick={toggleFavorite} className="hover:scale-95">
        <div className="flex items-center gap-1">
          {optimisticLikes ? (
            <AiFillHeart size={24} className="fill-rose-500" />
          ) : (
            <AiOutlineHeart size={28} className="text-white" />
          )}
        </div>
      </button>
    );
  }

  return (
    <Button
      variant={"ghost"}
      onClick={toggleFavorite}
      className={cn(
        "hover:opacity-80 transition cursor-point disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-1"
      )}
    >
      <div className="flex items-center gap-1">
        {optimisticLikes ? (
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
