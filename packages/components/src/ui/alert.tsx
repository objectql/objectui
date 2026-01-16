import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils"

const alertVariants = cva(
  "relative w-full rounded-r-lg border-l-4 px-4 py-4 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current transition-all duration-300 backdrop-blur-md overflow-hidden group/alert",
  {
    variants: {
      variant: {
        default: [
          "bg-slate-950/80 border-l-cyan-500 border-y border-r border-y-cyan-900/30 border-r-cyan-900/30 text-cyan-100",
          "shadow-[0_0_20px_-5px_rgba(6,182,212,0.2)]",
          "[&>svg]:text-cyan-400 [&>svg]:drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]",
          "hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.4)] hover:bg-slate-900/90",
          "after:absolute after:inset-0 after:bg-linear-to-r after:from-cyan-500/10 after:to-transparent after:opacity-0 after:transition-opacity hover:after:opacity-100 after:pointer-events-none"
        ],
        destructive: [
          "bg-red-950/80 border-l-red-600 border-y border-r border-y-red-900/30 border-r-red-900/30 text-red-100",
          "shadow-[0_0_20px_-5px_rgba(239,68,68,0.2)]",
          "[&>svg]:text-red-500 [&>svg]:drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]",
          "hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.4)] hover:bg-red-950/90",
           "after:absolute after:inset-0 after:bg-linear-to-r after:from-red-500/10 after:to-transparent after:opacity-0 after:transition-opacity hover:after:opacity-100 after:pointer-events-none"
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-mono font-bold tracking-widest uppercase text-xs mb-1 drop-shadow-[0_0_2px_currentColor]",
        "group-[.destructive]/alert:text-red-400 group-[.default]/alert:text-cyan-400",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed font-sans opacity-90",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
