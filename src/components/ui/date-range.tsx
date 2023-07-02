"use client";

import * as React from "react";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

type Props = {
  className?: string;
  date?: DateRange;
  setDate: (date?: DateRange) => void;
};

export function DatePickerWithRange({ className, date, setDate }: Props) {
  const now = new Date();

  // array of objects containing text prop with the name of the month
  // and a minDate and maxDate props with the start and end of the month
  // of that month in the current year
  const monthRanges = Array.from({ length: 3 })
    .map((_, index) => now.getMonth() - index || now.getMonth() - index + 12)
    .map((monthIndex) => {
      const month = monthIndex;
      const year = now.getFullYear();
      const from = startOfMonth(new Date(year, month, 1));
      const to = endOfMonth(new Date(year, month, 1));
      return {
        text: new Intl.DateTimeFormat("en-US", { month: "long" }).format(from),
        from,
        to,
        value: month.toString(),
      };
    });

  const lastXDays = (days: number) => ({
    text: `Last ${days} days`,
    from: new Date(Date.now() - 1000 * 60 * 60 * 24 * days),
    to: new Date(),
    value: `last${days}Days`,
  });

  // last monday to sunday perdiod
  const lastWeek = {
    text: "Last week",
    from: startOfWeek(new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)),
    to: endOfWeek(new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)),
    value: "lastWeek",
  };

  const dateRangeOptions = [
    lastXDays(7),
    lastWeek,
    lastXDays(30),
    ...monthRanges,
  ];

  return (
    <div className={cn("grid gap-2 flex-1", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal flex-2",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3 gap-3" align="start">
          <Select
            onValueChange={(newValue) => {
              const opt = dateRangeOptions.find(
                ({ value }) => newValue === value
              );

              if (opt) setDate(opt);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              {dateRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
