"use client";
import { Review, User } from "@prisma/client";
import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Star, StarHalf, TrashIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { removeReview } from "@/_actions/review";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

interface ReviewSectionProps {
  review: Review & {
    user: Pick<User, "id" | "name" | "image">;
  };
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ review }) => {
  const { comment, rating, createdAt, user } = review;
  const session = useSession();
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();
  const currentUser = session.data?.user;
  const { name, image } = user;

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const res = await removeReview(review.id);
        if (res.error) {
          toast({
            title: "An error occurred",
            description: res.error as string,
          });
        } else {
          toast({
            title: "Review deleted",
            description: "Your review has been deleted",
          });
        }
      } catch (error) {
        toast({
          title: "An error occurred",
          description: "Something went wrong",
        });
      }
    });
  };

  return (
    <Card className="relative">
      <CardHeader className="flex items-start flex-row gap-2  space-y-0">
        <Avatar className="w-6 h-6">
          <AvatarImage src={image as string} className="" />
          <AvatarFallback>User</AvatarFallback>
        </Avatar>
        <CardTitle className="text-xl">{name?.split(" ")[0]}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{comment}</CardDescription>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center w-full">
            <Rating value={rating} />
            <span className="ml-2 text-sm text-gray-500">
              {formatDate(new Date(createdAt), "MMMM dd, yyyy")}
            </span>
          </div>
        </div>
        {currentUser?.id === user.id && (
          <Button
            variant="destructive"
            className="absolute top-2 right-2 w-6 h-6 hover:scale-95"
            size="icon"
            disabled={isPending}
            onClick={handleDelete}
          >
            <TrashIcon size={16} />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ReviewSection;

const Rating: React.FC<{ value: number }> = ({ value }) => {
  const rating = Math.round(value);

  //calculate the number of stars to display

  const stars = Array.from({ length: 5 }).map((_, index) => {
    if (index + 1 <= rating) {
      return <Star key={index} size={12} className={cn("fill-black")} />;
    }
    if (index + 0.5 <= rating) {
      return <StarHalf key={index} size={12} className={cn("fill-black")} />;
    }
    return <Star key={index} size={12} className={cn("")} />;
  });

  return <div className="flex items-center gap-0">{stars}</div>;
};
