/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { cn } from "../lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-md bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_1.5s_infinite] after:bg-linear-to-r after:from-transparent after:via-cyan-900/20 after:to-transparent",
        className
      )}
      {...props}
    >
        {/* Optional tech pattern overlay for large skeletons */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(6,182,212,0.02)_50%,transparent_75%,transparent_100%)] bg-[size:8px_8px] opacity-50" />
    </div>
  )
}

export { Skeleton }
