import * as React from "react";
import { toggleFavoriteAction } from "@/_actions/toggleFavorite";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { useModalStore } from "@/store/modalStore";

interface HeartButtonProps {
  listingId: string;
  isFavorite?: boolean;
}

const HeartButton: React.FC<HeartButtonProps> = ({ listingId, isFavorite }) => {
  const [hasFavorited, setHasFavorited] = React.useState(false);
  const { onOpen } = useModalStore();
  const user = useSession().data?.user;
  const [isPending, startTransition] = React.useTransition();

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
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <button
      onClick={toggleFavorite}
      className="relative hover:opacity-80 transition cursor-point disabled:cursor-not-allowed disabled:opacity-50"
    >
      <AiOutlineHeart
        size={28}
        className="fill-white absolute -top-[2px] -right-[2px]"
      />
      <AiFillHeart
        size={24}
        className={
          hasFavorited || isFavorite ? "fill-rose-500" : "fill-neutral-500/70"
        }
      />
    </button>
  );
};

export default HeartButton;
