import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/50 tracking-wide",
  {
    variants: {
      variant: {
        default:
          "bg-cyan-950/80 text-cyan-50 border border-cyan-500/50 shadow-[0_0_10px_-3px_rgba(6,182,212,0.3)] hover:bg-cyan-900 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] active:scale-95",
        destructive:
          "bg-red-950/80 text-red-50 border border-red-500/50 hover:bg-red-900 hover:border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]",
        outline:
          "border border-cyan-800 bg-background/50 hover:bg-cyan-950/30 hover:border-cyan-500/50 hover:text-cyan-100 text-muted-foreground",
        secondary:
          "bg-slate-800/80 text-secondary-foreground hover:bg-slate-700/80 border border-slate-700",
        ghost:
          "hover:bg-cyan-950/20 hover:text-cyan-400 data-[state=open]:bg-cyan-950/20 data-[state=open]:text-cyan-400",
        link: "text-cyan-400 underline-offset-4 hover:underline hover:text-cyan-300",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-sm gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-10 rounded-sm px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-sm",
        "icon-sm": "size-8 rounded-sm",
        "icon-lg": "size-10 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }>(({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
