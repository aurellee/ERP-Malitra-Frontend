"use client"

import React, { useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, ChevronDown } from "lucide-react"

export function AttendanceDatePicker() {
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="p-2 flex w-[220px] items-center h-[40px] justify-center text-center font-regular bg-[#0456F7] dark:bg-[#0456F7]
            text-white hover:text-white hover:bg-blue-700 dark:hover:bg-blue-700 rounded-[80px]"
          >
            <span className="w-full flex items-center justify-center gap-3.5">
            <CalendarIcon className="h-4 w-4" size={16}/>
            {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Select Date"}
            </span>
            <ChevronDown className="h-4 w-4 opacity-70 justify-start" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="end"
          sideOffset={8}
          className="w-auto p-4"
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                setSelectedDate(date)
                setOpen(false)
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default AttendanceDatePicker