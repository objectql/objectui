import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "../lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-sm bg-slate-950/60 border border-slate-800/60 shadow-inner",
        className
      )}
      {...props}
    >
      {/* Background Grid Pattern for empty track */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_2px,rgba(6,182,212,0.1)_2px),linear-gradient(0deg,transparent_2px,rgba(6,182,212,0.1)_2px)] bg-[size:10px_10px] opacity-20" />

      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 transition-all bg-cyan-500 relative shadow-[0_0_15px_cyan]"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      >
        {/* Pulse / Flow Effect Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite_linear]" />
        
        {/* Leading Edge Hotspot */}
        <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_2px_white] z-10" />
        
        {/* Scanlines on the bar */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[size:4px_4px]" />
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  )
}

export { Progress }
