"use client";

import { useRouter } from "next/navigation";

import Heading from "./Heading";
import { Button } from "./ui/button";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No exact matches",
  subtitle = "Try changing or removing some of your filters.",
  showReset,
}) => {
  const router = useRouter();

  return (
    <div
      className="
        h-[60vh]
        flex 
        flex-col 
        gap-2 
        justify-center 
        items-center 
        text-center
      "
    >
      <Heading title={title} subtitle={subtitle} />
      <div className="w-48 mt-4">
        {showReset && (
          <Button variant={"outline"} onClick={() => router.push("/")}>
            Remove all filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
