import { forwardRef, ButtonHTMLAttributes } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-display tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        primary: "bg-peach text-ink shadow-lg hover:shadow-xl hover:bg-[hsl(var(--peach-hover))] before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        secondary: "border-2 border-ink text-ink bg-transparent hover:bg-ink hover:text-background shadow-md hover:shadow-lg",
        ghost: "text-ink hover:bg-ink/5 hover:text-ink",
        outline: "border border-peach/30 text-ink bg-background hover:bg-peach/10 hover:border-peach",
        link: "text-ink underline-offset-4 hover:underline p-0",
      },
      size: {
        default: "px-8 py-3 text-sm",
        sm: "px-6 py-2 text-xs",
        lg: "px-10 py-4 text-base",
        xl: "px-12 py-5 text-lg",
        icon: "h-10 w-10",
      },
      rounded: {
        default: "rounded-none",
        sm: "rounded-sm", 
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      rounded: "default",
    },
  }
);

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<"button">>,
    HTMLMotionProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : motion.button;
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };