"use client";
import { ReviewSchema } from "@/schemas";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "../ui/use-toast";
import { addReviewAction } from "@/_actions/review";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useModalStore } from "@/store/modalStore";

type AddReviewFormValues = z.infer<typeof ReviewSchema>;

interface AddReviewProps {
  listingId?: string;
}

const AddReview: React.FC<AddReviewProps> = ({ listingId }) => {
  const [isPending, startTranstion] = React.useTransition();
  const { isOpen, onClose, type } = useModalStore();
  const { toast } = useToast();

  const form = useForm<AddReviewFormValues>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      comment: "",
      rating: undefined,
    },
  });

  const ratings = ["1", "2", "3", "4", "5"];

  function onSubmit(values: AddReviewFormValues) {
    // Start a pending transition
    startTranstion(async () => {
      // Do something after the transition
      try {
        const res = await addReviewAction(values, listingId as string);
        if (res.error) {
          toast({
            title: "An error occurred",
            description: res.error as string,
          });
        } else {
          toast({
            title: "Review added",
            description: "Your review has been added",
          });
        }
      } catch (error) {
        toast({
          title: "An error occurred",
          description: "Something went wrong",
        });
      }
    });
  }

  const handleClose = React.useCallback(() => {
    onClose();
    form.reset();
  }, [form, onClose]);

  return (
    <Dialog onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button>Add Review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Review</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Rating" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ratings.map(rating => (
                        <SelectItem key={rating} value={rating}>
                          {rating}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Add a public review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write a review "
                      {...field}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    Share your experience, help others make better choices.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Adding review..." : "Add Review"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddReview;
