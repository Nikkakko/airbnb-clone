"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "@/store/modalStore";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RentSchema } from "@/schemas";
import * as z from "zod";
import { Form } from "@/components/ui/form";

import { Button } from "../ui/button";
import CategoryInput from "../categories/steps/CategoryInput";
import CountrySelect from "../categories/steps/CountrySelect";
import InfoInput from "../categories/steps/InfoInput";
import AddImage from "../categories/steps/AddImage";
import DescriptionInput from "../categories/steps/DescriptionInput";
import PriceInput from "../categories/steps/PriceInput";
import { createListing } from "@/_actions/listing";
import { Loader2 } from "lucide-react";

interface RentModalProps {}

const steps = [
  {
    id: "Step 1",
    name: "Category",
    fields: ["category"],
  },
  {
    id: "Step 2",
    name: "Location",
    fields: ["location"],
  },
  {
    id: "Step 3",
    name: "Info",
    fields: ["roomCount", "bathroomCount", "guestCount"],
  },
  {
    id: "Step 4",
    name: "Images",
    fields: ["imageSrc"],
  },
  {
    id: "Step 5",
    name: "Description",
    fields: ["description", "title"],
  },
  {
    id: "Step 6",
    name: "Price",
    fields: ["price"],
  },
];

type Inputs = z.infer<typeof RentSchema>;

type FieldName = keyof Inputs;

const RentModal: React.FC<RentModalProps> = ({}) => {
  const { type, isOpen, onClose } = useModalStore();
  const isModalOpen = type === "rent" && isOpen;
  const [currentStep, setCurrentStep] = React.useState(0);
  const [previousStep, setPreviousStep] = React.useState(0);
  const [isPending, startTransition] = React.useTransition();

  const handleBack = React.useCallback(() => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep(step => step - 1);
    }
  }, [currentStep]);

  const actionLabel = React.useMemo(() => {
    return currentStep === steps.length - 1 ? "Create" : "Next";
  }, [currentStep]);

  const form = useForm<z.infer<typeof RentSchema>>({
    resolver: zodResolver(RentSchema),

    defaultValues: {
      category: "",
      location: "",
      imageSrc: [],
      description: "",
      price: 1,
      bathroomCount: 1,
      guestCount: 1,
      roomCount: 1,
      title: "",
    },
  });

  function onSubmit(values: z.infer<typeof RentSchema>) {
    startTransition(async () => {
      const listing = await createListing(values);
      if (listing.success) {
        handleOnClose();
      }
    });
  }

  console.log(form.watch("imageSrc"));

  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await form.trigger(fields as FieldName[], {
      shouldFocus: true,
    });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      setPreviousStep(currentStep);
      setCurrentStep(step => step + 1);
    } else {
      if (currentStep === steps.length - 1) {
        await form.handleSubmit(onSubmit)();
      }
    }
  };

  const handleOnClose = React.useCallback(() => {
    onClose();
    form.reset();
    setCurrentStep(0);
  }, [onClose, form]);

  if (!isModalOpen) return null;
  return (
    <Dialog open={isModalOpen} onOpenChange={handleOnClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rent</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {currentStep === 0 && <CategoryInput />}
            {currentStep === 1 && <CountrySelect />}
            {currentStep === 2 && <InfoInput />}
            {currentStep === 3 && <AddImage />}
            {currentStep === 4 && <DescriptionInput />}
            {currentStep === 5 && <PriceInput />}

            <div className="flex  gap-4">
              {currentStep !== 0 && (
                <Button
                  onClick={handleBack}
                  type="button"
                  className="mt-4 w-full bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
                >
                  Back
                </Button>
              )}
              <Button
                onClick={next}
                disabled={isPending}
                type="button"
                className="bg-rose-500  text-white mt-4 w-full hover:bg-rose-600"
              >
                {isPending && <Loader2 className="animate-spin mr-2" />}
                {actionLabel}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RentModal;
