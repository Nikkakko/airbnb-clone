import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/*
container locks the width of the content to a reasonable size, and centers it.
    container: {
      center: true,
      screens: {
        xl: "1312px",
      },
    },
    you can add a variant to the shel
*/

const shellVariants = cva("", {
  variants: {
    variant: {
      default: "container",
      container:
        "max-w-[1280px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 2xl:px-0",
      centered: "container flex h-[100dvh] max-w-2xl flex-col justify-center",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface ShellProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof shellVariants> {
  as?: React.ElementType;
}

function Shell({ className, as: Comp = "div", variant, ...props }: ShellProps) {
  return (
    <Comp className={cn(shellVariants({ variant }), className)} {...props} />
  );
}

export { Shell, shellVariants };
