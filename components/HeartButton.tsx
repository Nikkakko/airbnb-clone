import * as React from "react";
import { toggleFavoriteAction } from "@/_actions/toggleFavorite";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface HeartButtonProps {
  listingId: string;
}

const HeartButton: React.FC<HeartButtonProps> = ({ listingId }) => {
  const [hasFavorited, setHasFavorited] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const toggleFavorite = () => {
    startTransition(async () => {
      try {
        const { hasFavorited, error, success } = await toggleFavoriteAction(
          listingId
        );

        if (success) {
          setHasFavorited(hasFavorited);
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <button
      onClick={toggleFavorite}
      className="relative hover:opacity-80 transition cursor-point disabled:cursor-not-allowed disabled:opacity-50"
      disabled={isPending}
    >
      <AiOutlineHeart
        size={28}
        className="fill-white absolute -top-[2px] -right-[2px]"
      />
      <AiFillHeart
        size={24}
        className={hasFavorited ? "fill-rose-500" : "fill-neutral-500/70"}
      />
    </button>
  );
};

export default HeartButton;
