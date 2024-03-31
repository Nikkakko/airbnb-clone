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
import { useToast } from "../ui/use-toast";
import { LoginSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import * as z from "zod";
import { login } from "@/_actions/login";
import { Input } from "../ui/input";

interface LoginModalProps {}

const LoginModal: React.FC<LoginModalProps> = ({}) => {
  const { type, isOpen, onClose } = useModalStore();
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();
  const isModalOpen = type === "login" && isOpen;

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof LoginSchema>) {
    startTransition(async () => {
      const { error, success } = await login(values);

      if (error) {
        toast({
          title: "Error!",
          description: error,
        });
      } else {
        toast({
          title: "Success!",
          description: "You have successfully logged in.",
        });
        onClose();
      }
    });
  }

  //make handleClose function with react useCallBack
  const handleClose = React.useCallback(() => {
    onClose();
    form.reset();
  }, [form, onClose]);

  if (!isModalOpen) {
    return null;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              Login
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

export default LoginModal;
