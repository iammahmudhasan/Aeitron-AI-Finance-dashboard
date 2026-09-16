import { useState, useEffect, useRef } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function RealtimeCalendarPicker({ onDateSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Today real-time date
  const [today, setToday] = useState(() => new Date());

  // Currently selected date
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  // Browsing month/year view in calendar
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());

  // Real-time ticking clock
  const [currentTime, setCurrentTime] = useState(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });

  // Ticking timer for real-time clock & date
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setToday(now);
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Format date for button display: e.g. "16 Sept 2026"
  const formattedButtonDate = selectedDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Navigate month
  const prevMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const jumpToToday = (e) => {
    e?.stopPropagation();
    const now = new Date();
    setSelectedDate(now);
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    onDateSelect?.(now);
  };

  // Generate calendar days
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun, 1 = Mon...
  const prevMonthDaysCount = new Date(viewYear, viewMonth, 0).getDate();

  const handleSelectDay = (day, isCurrentMonth = true) => {
    if (!isCurrentMonth) return;
    const newDate = new Date(viewYear, viewMonth, day);
    setSelectedDate(newDate);
    onDateSelect?.(newDate);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button matching screenshot */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3.5 py-2 bg-bg-card border rounded-xl text-xs font-semibold text-text shadow-xs transition-all cursor-pointer select-none active:scale-95 ${
          isOpen ? 'border-accent ring-2 ring-accent/20 bg-bg-hover' : 'border-border hover:border-accent/40'
        }`}
        title="Click to view real-time calendar"
      >
        <CalendarIcon size={14} className="text-accent shrink-0" />
        <span className="font-semibold text-text">{formattedButtonDate}</span>
      </button>

      {/* Interactive Calendar Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 w-72 bg-bg-card border border-border shadow-2xl rounded-2xl p-4 animate-fade-in text-text">
          {/* Calendar Header: Month & Year Navigator */}
          <div className="flex items-center justify-between pb-3 border-b border-border/80 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-text">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={jumpToToday}
                className="px-2 py-0.5 text-[10px] font-semibold text-accent hover:bg-accent/10 rounded-md transition-colors"
                title="Jump to Today"
              >
                Today
              </button>
              <button
                type="button"
                onClick={prevMonth}
                className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-bg transition-colors"
                title="Previous Month"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-bg transition-colors"
                title="Next Month"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
            {WEEKDAYS.map((wd) => (
              <span key={wd} className="text-[10px] font-bold text-text-muted/70 py-1">
                {wd}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Previous month padding days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => {
              const dayNum = prevMonthDaysCount - firstDayIndex + i + 1;
              return (
                <div
                  key={`prev-${i}`}
                  className="py-1.5 text-xs text-text-muted/30 font-medium rounded-lg select-none"
                >
                  {dayNum}
                </div>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const isToday =
                today.getFullYear() === viewYear &&
                today.getMonth() === viewMonth &&
                today.getDate() === dayNum;

              const isSelected =
                selectedDate.getFullYear() === viewYear &&
                selectedDate.getMonth() === viewMonth &&
                selectedDate.getDate() === dayNum;

              return (
                <button
                  key={`day-${dayNum}`}
                  type="button"
                  onClick={() => handleSelectDay(dayNum, true)}
                  className={`
                    py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer relative
                    ${isSelected
                      ? 'bg-accent text-white shadow-sm font-bold scale-105'
                      : isToday
                      ? 'bg-accent/15 text-accent font-bold hover:bg-accent/25'
                      : 'text-text hover:bg-bg hover:text-accent'
                    }
                  `}
                >
                  <span>{dayNum}</span>
                  {isToday && !isSelected && (
                    <span className="w-1 h-1 bg-accent rounded-full absolute bottom-1 left-1/2 -translate-x-1/2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Live Real-Time Clock Footer */}
          <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between text-[11px] text-text-muted">
            <div className="flex items-center gap-1.5 font-mono text-text">
              <Clock size={12} className="text-accent animate-pulse" />
              <span>{currentTime}</span>
            </div>

            <button
              type="button"
              onClick={jumpToToday}
              className="flex items-center gap-1 text-[11px] font-semibold text-accent hover:underline cursor-pointer"
            >
              <RotateCcw size={11} />
              <span>Real-Time Today</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
