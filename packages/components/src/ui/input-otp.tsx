import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"

import { cn } from "../lib/utils"

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-3", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex h-14 w-11 items-center justify-center text-lg font-mono transition-all duration-300 outline-none rounded-md",
        "bg-slate-950/60 border-2 border-slate-800 text-slate-500", // Default state (Inactive)
        "data-[active=true]:border-cyan-400 data-[active=true]:text-cyan-300 data-[active=true]:bg-cyan-950/20", // Active/Focused
        "data-[active=true]:shadow-[0_0_20px_rgba(6,182,212,0.5),inset_0_0_10px_rgba(6,182,212,0.1)]", // Glow
        "data-[active=true]:-translate-y-1 data-[active=true]:scale-105", // Lift effect
        isActive && "animate-pulse-subtle", // Custom subtle pulse for active slot
        char && "border-cyan-500/50 text-cyan-100 bg-cyan-950/10 shadow-[0_0_10px_rgba(6,182,212,0.2)]", // Filled state
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-cyan-400 h-6 w-0.5 duration-1000 shadow-[0_0_8px_cyan]" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <div className="w-2 h-2 rounded-full bg-cyan-500/50 shadow-[0_0_10px_cyan]" />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
