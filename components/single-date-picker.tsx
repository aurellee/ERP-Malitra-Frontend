import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ChevronDown } from "lucide-react";

type Props = {
  value: string; // in "yyyy-MM-dd" format
  onChange: (newDate: string) => void;
};

export function SingleDatePicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Convert string from form into Date object
  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    }
  }, [value]);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onChange(format(date, "yyyy-MM-dd")); // 💡 convert to "yyyy-MM-dd"
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="p-2 flex w-full items-center h-[40px] justify-between font-regular text-theme hover:text-theme hover:bg-[oklch(0.278_0.033_256.848_/_5%)] dark:hover:bg-[#191919] dark:bg-[#121212]"
        >
          <span className="w-full flex items-center justify-start gap-2.5">
            <CalendarIcon className="h-4 w-4" size={16} />
            {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Select Date"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-70 justify-end" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" sideOffset={8} className="w-auto p-4">
        <Calendar mode="single" selected={selectedDate} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
}

export default SingleDatePicker;