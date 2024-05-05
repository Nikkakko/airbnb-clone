"use client";
import * as React from "react";
import { useModalStore } from "@/store/modalStore";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { SearchSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import CountrySelect from "../categories/steps/CountrySelect";
import InfoInput from "../categories/steps/InfoInput";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { DatePickerWithRange } from "../listinDetail/DateRangePickerComponent";
import { useRouter } from "next/navigation";

import qs from "query-string";

interface CommandModalProps {}

const steps = [
  {
    id: "Step 1",
    name: "Location",
    fields: ["location"],
  },

  {
    id: "Step 2",
    name: "Info",
    fields: ["roomCount", "bathroomCount", "guestCount"],
  },
];

type Inputs = z.infer<typeof SearchSchema>;
type FieldName = keyof Inputs;

const CommandModal: React.FC<CommandModalProps> = ({}) => {
  const { type, onOpen, isOpen, onClose } = useModalStore();
  const isModalOpen = type === "command" && isOpen;
  const [currentStep, setCurrentStep] = React.useState(0);
  const [previousStep, setPreviousStep] = React.useState(0);
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const form = useForm<Inputs>({
    resolver: zodResolver(SearchSchema),

    defaultValues: {
      bathroomCount: 1,
      guestCount: 1,
      location: "",
      roomCount: 1,
    },
  });

  const handleBack = React.useCallback(() => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep(step => step - 1);
    }
  }, [currentStep]);

  function onSubmit(values: Inputs) {
    //navigate to searchpage and pass the values

    const paramValues = {
      bathroomCount: values.bathroomCount,
      guestCount: values.guestCount,
      location: values.location,
      roomCount: values.roomCount,
    };

    const url = qs.stringifyUrl(
      {
        url: "/search",
        query: paramValues,
      },
      {
        skipEmptyString: true,
        skipNull: true,
      }
    );

    router.push(url, { scroll: false });
  }

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

        if (!isPending) {
          handleClose();
        }
      }
    }
  };

  const actionLabel = React.useMemo(() => {
    return currentStep === steps.length - 1 ? "Search" : "Next";
  }, [currentStep]);

  const handleClose = React.useCallback(() => {
    onClose();
    form.reset();
  }, [onClose, form]);

  if (!isModalOpen) {
    return null;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{steps[currentStep].name}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            {currentStep === 0 && <CountrySelect searchModal />}
            {currentStep === 1 && <InfoInput searchModal />}

            <div className="flex gap-4">
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

export default CommandModal;
