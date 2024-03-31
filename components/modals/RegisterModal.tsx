import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "@/store/modalStore";
import { Social } from "../navbar/Social";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { register } from "@/_actions/register";
import { useToast } from "../ui/use-toast";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

interface RegisterProps {}

const RegisterModal: React.FC<RegisterProps> = ({}) => {
  const { type, isOpen, onClose } = useModalStore();
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();
  const isModalOpen = type === "register" && isOpen;

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof RegisterSchema>) {
    startTransition(async () => {
      const { error, success } = await register(values);

      if (success) {
        toast({
          title: "Success!",
          description: "You have successfully registered.",
        });

        onClose();
      } else {
        toast({
          title: "Error!",
          description: error,
        });
      }
    });
  }

  if (!isModalOpen) {
    return null;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john doe"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="johndoe@example.com"
                      disabled={isPending}
                      {...field}
                      type="email"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="******"
                      {...field}
                      type="password"
                      disabled={isPending}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className="bg-rose-500 w-full hover:bg-rose-600"
            >
              Register
            </Button>
          </form>
        </Form>
        <Separator />

        <DialogFooter>
          <Social />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
