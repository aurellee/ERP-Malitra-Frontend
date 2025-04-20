// "use client"

// import React, { useState } from "react"
// import { format } from "date-fns"
// import { Button } from "@/components/ui/button"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Calendar } from "@/components/ui/calendar"
// import { CalendarIcon, ChevronDown } from "lucide-react"

// export function HiredDatePicker() {
//   const [open, setOpen] = useState(false)
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

//   return (
//     <div>
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             variant="outline"
//             className="p-2 flex w-full items-center h-[40px] justify-between font-regular
//             text-theme hover:text-theme hover:bg-[oklch(0.278_0.033_256.848_/_5%)] dark:hover:bg-[#191919] dark:bg-[#121212]"
//           >
//             <span className="w-full flex items-center justify-start gap-2.5">
//             <CalendarIcon className="h-4 w-4" size={16}/>
//             {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Select Date"}
//             </span>
//             <ChevronDown className="h-4 w-4 opacity-70 justify-end" />
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent
//           side="bottom"
//           align="end"
//           sideOffset={8}
//           className="w-auto p-4"
//         >
//           <Calendar
//             mode="single"
//             selected={selectedDate}
//             onSelect={(date) => {
//               if (date) {
//                 setSelectedDate(date)
//                 setOpen(false)
//               }
//             }}
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   )
// }

// export default HiredDatePicker

'use client'

import * as React from 'react'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'    // your existing Month‑view calendar
import { format } from 'date-fns'

interface HiredDatePicker {
    value: string               // expected as "YYYY-MM-DD" or ""
    onChange: (date: string) => void
}

export function HiredDatePicker({ value, onChange }: HiredDatePicker) {
    const [open, setOpen] = React.useState(false)
    // parse the incoming string or default to today
    const selectedDate = React.useMemo(() => {
        return value ? new Date(value) : new Date()
    }, [value])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="p-2 flex w-full items-center h-[48px] justify-between font-regular
            text-theme hover:text-theme hover:bg-[oklch(0.278_0.033_256.848_/_5%)] dark:hover:bg-[#191919] dark:bg-[#121212]">
                    <span className="w-full justify-start h-[48px] flex items-center gap-2.5">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(selectedDate, 'dd/MM/yyyy')}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-70 justify-end" />
                </Button>
            </PopoverTrigger>

            <PopoverContent align="start" side="bottom" sideOffset={8} className="justify-center text-center">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                        if (date) {
                            const iso = format(date, 'yyyy-MM-dd')
                            onChange(iso)
                            setOpen(false)
                        }
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}