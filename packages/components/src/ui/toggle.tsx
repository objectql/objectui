import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-sm text-sm font-medium transition-all duration-300 hover:text-cyan-400 focus-visible:ring-1 focus-visible:ring-cyan-400/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none aria-invalid:ring-destructive/20 aria-invalid:border-destructive whitespace-nowrap",
  {
    variants: {
      variant: {
        default: [
          "bg-transparent hover:bg-cyan-950/20",
          "data-[state=on]:bg-cyan-950/40 data-[state=on]:text-cyan-300 data-[state=on]:border data-[state=on]:border-cyan-500/30 data-[state=on]:shadow-[0_0_12px_-3px_rgba(6,182,212,0.4)]",
        ],
        outline: [
          "border border-cyan-900/60 bg-transparent shadow-xs hover:bg-cyan-950/30 hover:text-cyan-300 hover:border-cyan-500/50",
          "data-[state=on]:bg-cyan-600 data-[state=on]:text-white data-[state=on]:border-cyan-400 data-[state=on]:shadow-[0_0_15px_rgba(6,182,212,0.6)]",
        ],
      },
      size: {
        default: "h-9 px-3 min-w-9",
        sm: "h-8 px-2 min-w-8 text-xs",
        lg: "h-10 px-3 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
