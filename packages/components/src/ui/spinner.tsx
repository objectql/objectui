import * as React from "react"
import { cn } from "../lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("relative flex items-center justify-center shrink-0", className)}
      {...props}
    >
      <div className="relative aspect-square h-full w-full min-w-[1em] min-h-[1em]">
          {/* Outer Atmosphere / Fire (Fast Spin) */}
          <div className="absolute inset-0 rounded-full border-[15%] border-transparent border-t-orange-500 border-r-red-600 animate-[spin_0.8s_linear_infinite] shadow-[0_0_15px_-4px_rgba(234,88,12,0.8)]" 
               style={{ borderWidth: "2px" }} 
          />
          
          {/* Turbulence Layer (Reverse Spin) */}
          <div className="absolute inset-[10%] rounded-full border-[15%] border-transparent border-b-yellow-400/80 border-l-orange-500/80 animate-[spin_1.5s_ease-in-out_infinite_reverse]" 
               style={{ borderWidth: "2px" }}
          />

          {/* Core Planet (Internal) */}
          <div className="absolute inset-[25%] rounded-full overflow-hidden bg-slate-950 shadow-[inset_0_0_4px_rgba(0,0,0,0.8)]">
               {/* Molten Core Texture (Rotating) */}
               <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-[spin_3s_linear_infinite]">
                  <div className="w-full h-full bg-[conic-gradient(from_180deg,#1e293b_0deg,#0e7490_80deg,#7c3aed_160deg,#be123c_240deg,#ea580c_300deg,#1e293b_360deg)] opacity-90 blur-[1px]" />
               </div>
               
              {/* Surface Reflection & Shadow (Spherical look) */}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4)_0%,transparent_50%,rgba(0,0,0,0.9)_100%)] z-10" />
          </div>
      </div>
    </div>
  )
}

export { Spinner }
