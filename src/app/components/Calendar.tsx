import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface CalendarProps {
  selected?: Date;
  onSelect: (date: Date) => void;
  bookedDates?: Date[];
}

export function Calendar({ selected, onSelect, bookedDates = [] }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isBooked = (date: Date) => {
    return bookedDates.some((bookedDate) => isSameDay(bookedDate, date));
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const days = [];
  const totalDays = daysInMonth(currentMonth);
  const firstDay = firstDayOfMonth(currentMonth);

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
  }

  // Add cells for each day of the month
  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const isSelectedDay = selected && isSameDay(date, selected);
    const isBookedDay = isBooked(date);
    const isPastDay = isPast(date);
    const isDisabled = isPastDay || isBookedDay;

    days.push(
      <button
        key={day}
        type="button"
        onClick={() => !isDisabled && onSelect(date)}
        disabled={isDisabled}
        className={`aspect-square flex items-center justify-center text-sm transition-colors ${
          isSelectedDay
            ? "bg-yellow-400 text-black font-semibold"
            : isBookedDay
            ? "bg-red-500/20 border border-red-500/40 text-red-400 cursor-not-allowed"
            : isPastDay
            ? "text-white/20 cursor-not-allowed"
            : "hover:bg-white/10 text-white"
        }`}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="w-full">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={previousMonth}
          className="p-2 hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 hover:bg-white/10 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs text-white/50 font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">{days}</div>
    </div>
  );
}
