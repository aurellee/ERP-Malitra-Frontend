"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, ChevronDown, ChevronLeft } from "lucide-react"
import type { DateRange as DayPickerDateRange } from "react-day-picker"

// Example presets for quick range selection
const PRESETS: { label: string; range?: DayPickerDateRange }[] = [
  {
    label: "Today",
    range: { from: new Date(), to: new Date() },
  },
  {
    label: "Yesterday",
    range: { from: addDays(new Date(), -1), to: addDays(new Date(), -1) },
  },
  {
    label: "Last 7 Days",
    range: { from: addDays(new Date(), -6), to: new Date() },
  },
  {
    label: "This Month",
    range: {
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date(),
    },
  },
  {
    label: "Custom",
    range: undefined, // We'll let the user pick manually
  },
]

interface DateRangePickerProps {
  value: DayPickerDateRange | undefined
  onValueChange: (range: DayPickerDateRange | undefined) => void
}

export function DateRangePicker({ value, onValueChange }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  // Use the type from react-day-picker so that both "from" and "to" are optional

  function handlePresetClick(preset: { label: string; range?: DayPickerDateRange }) {
    if (preset.range) {
      onValueChange(preset.range)
      setOpen(false)
    } else {
      // "Custom" preset: let the user pick manually
      onValueChange(undefined)
    }
  }

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="justify-between">
          <Button variant="outline" className="h-9.5 md:h-9.5 flex items-center gap-2 bg-[#0456F7] text-white hover:bg-[#0348CF] hover:text-white dark:bg-[#0456F7] dark:text-white dark:hover:bg-[#0348CF] dark:border-black">
            <CalendarIcon className="h-4 w-4" />
            {value && value.from && value.to ? (
              <>
                {format(value.from, "dd/MM/yyyy")} - {format(value.to, "dd/MM/yyyy")}
              </>
            ) : (
              "Select Date Range"
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent side="bottom" align="end" sideOffset={8} className="w-auto p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Calendar for manual picking */}
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600">
                From:{" "}
                {value && value.from
                  ? format(value.from, "dd/MM/yyyy")
                  : "N/A"}{" "}
                — To:{" "}
                {value && value.to
                  ? format(value.to, "dd/MM/yyyy")
                  : "N/A"}
              </p>
              <Calendar
                mode="range"
                selected ={value}
                onSelect={(range) => {
                  onValueChange(range)
                }}
              />
            </div>

            {/* Quick Presets */}
            <div className="border-l border-gray-200 pl-4 flex flex-col gap-2">
              {PRESETS.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  className="w-auto px-2 text-sm justify-start"
                  onClick={() => handlePresetClick(preset)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}