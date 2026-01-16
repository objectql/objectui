import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-sm border px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:border-cyan-500 focus-visible:ring-cyan-500/50 focus-visible:ring-[1px] transition-all duration-300 overflow-hidden backdrop-blur-sm select-none",
  {
    variants: {
      variant: {
        default:
          "border-cyan-500/50 bg-cyan-950/40 text-cyan-300 shadow-[0_0_10px_-4px_rgba(6,182,212,0.6)] [a&]:hover:bg-cyan-900/60 [a&]:hover:shadow-[0_0_15px_-2px_rgba(6,182,212,0.8)] [a&]:hover:border-cyan-400",
        secondary:
          "border-slate-700 bg-slate-800/60 text-slate-300 shadow-sm [a&]:hover:bg-slate-700/80 [a&]:hover:text-slate-200",
        destructive:
          "border-red-500/40 bg-red-950/40 text-red-400 shadow-[0_0_10px_-4px_rgba(239,68,68,0.6)] [a&]:hover:bg-red-900/60 [a&]:hover:border-red-400 [a&]:hover:shadow-[0_0_15px_-2px_rgba(239,68,68,0.8)]",
        outline:
          "text-cyan-400 border-cyan-800 bg-transparent shadow-[inset_0_0_5px_rgba(6,182,212,0.1)] [a&]:hover:bg-cyan-950/30 [a&]:hover:border-cyan-500 [a&]:hover:text-cyan-200 [a&]:hover:shadow-[0_0_10px_-5px_cyan]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
