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
import Heading from "../Heading";
import { categories } from "@/data/sitedata";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RentSchema } from "@/schemas";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import CategoryInput from "../categories/steps/CategoryInput";
import CountryInput from "../categories/steps/CountryInput";

interface RentModalProps {}

enum Steps {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const RentModal: React.FC<RentModalProps> = ({}) => {
  const { type, isOpen, onClose } = useModalStore();
  const isModalOpen = type === "rent" && isOpen;
  const [step, setStep] = React.useState(Steps.CATEGORY);
  const [isPending, startTransition] = React.useTransition();

  const handleBack = React.useCallback(() => {
    if (step === Steps.CATEGORY) {
      onClose();
    } else {
      setStep(prev => prev - 1);
    }
  }, [onClose, step]);

  const actionLabel = React.useMemo(() => {
    if (step === Steps.PRICE) {
      return "Create";
    } else {
      return "Next";
    }
  }, [step]);

  const form = useForm<z.infer<typeof RentSchema>>({
    resolver: zodResolver(RentSchema),

    mode: "onSubmit",
    defaultValues: {
      category: "",
      location: "",
      imageSrc: "",
      description: "",
      price: 1,
      bathroomCount: 1,
      guestCount: 1,
      roomCount: 1,
      title: "",
    },
  });

  function onSubmit(values: z.infer<typeof RentSchema>) {
    console.log(values);
  }

  const handleNext = React.useCallback(() => {
    setStep(prev => prev + 1);

    if (step === Steps.PRICE) {
      form.handleSubmit(onSubmit)();
    }
  }, [setStep, step, form]);

  if (!isModalOpen) return null;
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rent</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {step === Steps.CATEGORY && <CategoryInput />}

            {step === Steps.LOCATION && <CountryInput />}

            <div className="flex  gap-4">
              <Button
                onClick={handleNext}
                type="submit"
                className="bg-rose-500  text-white mt-4 w-full hover:bg-rose-600"
              >
                {actionLabel}
              </Button>

              {step !== Steps.CATEGORY && (
                <Button
                  onClick={handleBack}
                  type="button"
                  className="mt-4 w-full"
                >
                  Back
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
      <DialogFooter>
        <button>Close</button>
      </DialogFooter>
    </Dialog>
  );
};

export default RentModal;
