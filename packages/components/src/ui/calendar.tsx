"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
} from "react-day-picker"

import { cn } from "../lib/utils"
import { Button, buttonVariants } from "./button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-[#0a0a0b] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-slate-950/80 to-black backdrop-blur-3xl border border-violet-500/20 shadow-[0_0_50px_-12px_rgba(124,58,237,0.25)] rounded-xl group/calendar p-4 [--cell-size:--spacing(9)]",
        "before:absolute before:inset-0 before:rounded-xl before:bg-[url('https://grainy-gradients.vercel.app/noise.svg')] before:opacity-10 before:pointer-events-none",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit relative overflow-hidden", defaultClassNames.root),
        months: cn(
          "flex gap-4 flex-col md:flex-row relative z-10",
          defaultClassNames.months
        ),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between px-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: "outline", size: "icon-sm" }),
          "z-20 bg-slate-900/80 border-violet-800/50 text-violet-400 hover:bg-violet-900/40 hover:text-violet-100 hover:border-violet-500 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-300 rounded-full",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: "outline", size: "icon-sm" }),
          "z-20 bg-slate-900/80 border-violet-800/50 text-violet-400 hover:bg-violet-900/40 hover:text-violet-100 hover:border-violet-500 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-300 rounded-full",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size) text-transparent bg-clip-text bg-linear-to-r from-violet-200 via-cyan-200 to-violet-200 font-bold tracking-[0.2em] relative uppercase text-lg",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative has-focus:border-violet-500 border border-violet-900/50 shadow-xs has-focus:ring-violet-500/30 has-focus:ring-[2px] rounded-md bg-slate-950 text-violet-200",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute bg-slate-950 inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex my-2", defaultClassNames.weekdays),
        weekday: cn(
          "text-violet-500/70 rounded-md flex-1 font-mono text-[0.65rem] uppercase tracking-widest select-none pb-2",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-1", defaultClassNames.week),
        week_number_header: cn(
          "select-none w-(--cell-size)",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] select-none text-muted-foreground",
          defaultClassNames.week_number
        ),
        day: cn(
          "relative w-full h-full p-0 text-center group/day aspect-square select-none",
          defaultClassNames.day
        ),
        range_start: cn(
          "rounded-l-full bg-violet-900/20",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none bg-violet-900/10", defaultClassNames.range_middle),
        range_end: cn("rounded-r-full bg-violet-900/20", defaultClassNames.range_end),
        today: cn(
          "text-cyan-400 font-bold", // Styling handled in DayButton mostly
          defaultClassNames.today
        ),
        outside: cn(
          "text-slate-800 opacity-30 aria-selected:text-slate-800",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-slate-800 opacity-20",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-violet-600 data-[selected-single=true]:text-white data-[selected-single=true]:shadow-[0_0_20px_rgba(124,58,237,0.8)] data-[selected-single=true]:border-violet-400 data-[selected-single=true]:scale-110 data-[selected-single=true]:z-10",
        
        "data-[range-middle=true]:bg-transparent data-[range-middle=true]:text-violet-200",
        
        "data-[range-start=true]:bg-violet-600 data-[range-start=true]:text-white data-[range-start=true]:shadow-[0_0_15px_rgba(124,58,237,0.5)] data-[range-start=true]:z-10",
        
        "data-[range-end=true]:bg-violet-600 data-[range-end=true]:text-white data-[range-end=true]:shadow-[0_0_15px_rgba(124,58,237,0.5)] data-[range-end=true]:z-10",

        // Today state (Current Timeline)
        "data-[today=true]:border data-[today=true]:border-cyan-500/50 data-[today=true]:text-cyan-300 data-[today=true]:shadow-[0_0_10px_rgba(6,182,212,0.3)]",
        
        // Base hover & focus
        "group-data-[focused=true]/day:border-violet-400 group-data-[focused=true]/day:ring-violet-500/50",
        "hover:bg-violet-900/30 hover:text-white hover:scale-125 hover:z-20 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-300",
        
        "bg-transparent flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal rounded-full",
        
        "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[2px]",
        
        "text-violet-300/80 [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
