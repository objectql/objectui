import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-slate-950/90 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-cyan-100 group-[.toaster]:border-slate-800 group-[.toaster]:shadow-[0_0_30px_-10px_rgba(0,0,0,0.5)] transition-all duration-30 data-[type=success]:border-emerald-500/50 data-[type=success]:shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)] data-[type=error]:border-red-500/50 data-[type=error]:shadow-[0_0_20px_-5px_rgba(239,68,68,0.2)] data-[type=info]:border-cyan-500/50 data-[type=info]:shadow-[0_0_20px_-5px_rgba(6,182,212,0.2)] data-[type=warning]:border-amber-500/50 data-[type=warning]:shadow-[0_0_20px_-5px_rgba(245,158,11,0.2)]",
          description: "group-[.toast]:text-slate-400 group-[.toast]:font-mono group-[.toast]:text-xs",
          actionButton:
            "group-[.toast]:bg-cyan-600 group-[.toast]:text-white group-[.toast]:font-bold group-[.toast]:rounded-sm group-[.toast]:shadow-[0_0_10px_cyan]",
          cancelButton:
            "group-[.toast]:bg-slate-800 group-[.toast]:text-slate-400 group-[.toast]:rounded-sm",
          title: "group-[.toast]:font-mono group-[.toast]:uppercase group-[.toast]:tracking-widest group-[.toast]:font-bold group-[.toast]:text-cyan-300 group-[.toast]:text-xs group-[.toast]:data-[type=error]:text-red-400 group-[.toast]:data-[type=success]:text-emerald-400",
          icon: "group-[.toast]:data-[type=success]:text-emerald-400 group-[.toast]:data-[type=error]:text-red-400 group-[.toast]:data-[type=info]:text-cyan-400 group-[.toast]:data-[type=warning]:text-amber-400",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-5 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />,
        info: <InfoIcon className="size-5 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />,
        warning: <TriangleAlertIcon className="size-5 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />,
        error: <OctagonXIcon className="size-5 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />,
        loading: <Loader2Icon className="size-5 animate-spin text-cyan-500" />,
      }}
      {...props}
    />
  )
}

export { Toaster }
