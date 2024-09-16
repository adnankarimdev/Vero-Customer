"use client";

import { useState } from "react";
import { format, parse, set, isBefore, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, Sunrise, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DateTimePickerProps {
  setDate: (date: Date) => void;
  date?: Date;
  setTime: (time: string) => void;
  time?: string;
  setSendEmailNow: (emailNow: boolean) => void;
}

export default function DateTimePicker({
  setDate,
  date,
  setTime,
  time,
  setSendEmailNow,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const now = new Date(); // Current date and time
  const timeOptions = [
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
  ];

  // Filter time options based on whether the selected date is today
  const filteredTimeOptions =
    date && isSameDay(date, now)
      ? timeOptions.filter((timeOption) => {
          const timeDate = parse(timeOption, "h:mm a", new Date());
          return isBefore(now, timeDate) || isSameDay(timeDate, now); // Only show future times if the date is today
        })
      : timeOptions;

  const formatDateTime = (date: Date | undefined, time: string | undefined) => {
    if (!date) return "Pick a date and time";
    const dateStr = format(date, "PPP");
    if (!time) return dateStr;
    const timeDate = parse(time, "h:mm a", new Date());
    const fullDate = set(date, {
      hours: timeDate.getHours(),
      minutes: timeDate.getMinutes(),
    });
    return format(fullDate, "PPP p");
  };

  function getTimeIcon(timeStr?: string) {
    if (!timeStr) return <></>;
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }

    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    const timeInMinutes = hours * 60 + minutes;

    if (timeInMinutes >= 480 && timeInMinutes <= 690) {
      return <Sunrise className="text-muted-foreground" size={16} />;
    } else if (timeInMinutes >= 720 && timeInMinutes <= 990) {
      return <Sun className="text-muted-foreground" size={16} />;
    } else {
      return <Moon className="text-muted-foreground" size={16} />;
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className="mr-2">{formatDateTime(date, time)}</span>
          {getTimeIcon(time)}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[600px]">
        <div className="flex flex-col sm:flex-row">
          <div className="border-b sm:border-r border-border sm:pr-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  // Prevent selecting past dates
                  setDate(selectedDate);
                }
              }}
              disabled={(selectedDate) =>
                isBefore(selectedDate, now.setHours(0, 0, 0, 0))
              } // Disable past dates
              initialFocus
            />
          </div>
          <div className="p-3 w-full sm:w-[200px]">
            <div className="text-sm font-medium mb-2">Select a time:</div>
            <ScrollArea className="h-[200px] sm:h-[300px] w-full rounded-md border">
              <div className="p-2">
                <div className="grid grid-cols-2 gap-2">
                  {/* Render "Send Now" button */}
                  <Button
                    variant="default"
                    size="sm"
                    className="text-xs bg-primary text-primary-foreground col-span-2"
                    onClick={() => {
                      setDate(now); // Set current date
                      setTime(format(now, "h:mm a")); // Set current time
                      setIsOpen(false);
                      setSendEmailNow(true);
                    }}
                  >
                    Send Now
                  </Button>
                  {filteredTimeOptions.map((timeOption) => (
                    <Button
                      key={timeOption}
                      variant={time === timeOption ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "text-xs",
                        time === timeOption &&
                          "bg-primary text-primary-foreground",
                      )}
                      onClick={() => {
                        setTime(timeOption);
                        setIsOpen(false);
                      }}
                    >
                      {timeOption}
                    </Button>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
