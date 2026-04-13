import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Plus } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { Button } from "../../components/ui/button";

interface CalendarEvent {
  id: number;
  title: string;
  client: string;
  date: Date;
  type: "wedding" | "event" | "portrait" | "corporate";
  status: "confirmed" | "pending" | "blocked";
}

export function AdminCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blockDate, setBlockDate] = useState('');
  const [blockReason, setBlockReason] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('event_date', { ascending: true });

      if (bookingsError) {
        throw bookingsError;
      }

      // Fetch blocked dates
      const { data: blockedData, error: blockedError } = await supabase
        .from('blocked_dates')
        .select('*')
        .order('blocked_date', { ascending: true });

      if (blockedError) {
        console.warn('Error fetching blocked dates:', blockedError);
        // Don't throw here, just log the warning
      }

      // Transform booking data to CalendarEvent format
      const bookingEvents: CalendarEvent[] = (bookingsData || []).map((booking) => ({
        id: booking.id,
        title: `${booking.service_type} - ${booking.full_name}`,
        client: booking.full_name,
        date: new Date(booking.event_date),
        type: mapServiceTypeToEventType(booking.service_type),
        status: booking.confirmed ? 'confirmed' : 'pending',
      }));

      // Transform blocked dates to CalendarEvent format
      const blockedEvents: CalendarEvent[] = (blockedData || []).map((blocked) => ({
        id: blocked.id,
        title: `Blocked - ${blocked.reason || 'No reason provided'}`,
        client: 'N/A',
        date: new Date(blocked.blocked_date),
        type: 'event',
        status: 'blocked' as const,
      }));

      // Combine both arrays
      setEvents([...bookingEvents, ...blockedEvents]);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const mapServiceTypeToEventType = (serviceType: string): "wedding" | "event" | "portrait" | "corporate" => {
    const type = serviceType.toLowerCase();
    if (type.includes('wedding')) return 'wedding';
    if (type.includes('corporate') || type.includes('business')) return 'corporate';
    if (type.includes('portrait') || type.includes('photo')) return 'portrait';
    return 'event'; // default for birthday, party, etc.
  };

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

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(event.date, date));
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getEventColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "blocked":
        return "bg-red-500";
      default:
        return "bg-neutral-500";
    }
  };

  const handleBlockDate = async () => {
    if (!blockDate) {
      alert('Please select a date to block');
      return;
    }

    const selectedDateTime = new Date(blockDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validate date is not in the past
    if (selectedDateTime < today) {
      alert('Cannot block dates in the past');
      return;
    }

    // Check if date is already booked or blocked
    const existingEvents = getEventsForDate(selectedDateTime);
    if (existingEvents.length > 0) {
      alert('This date already has bookings or is blocked');
      return;
    }

    try {
      // Save to database
      const { data, error } = await supabase
        .from('blocked_dates')
        .insert([
          {
            blocked_date: blockDate,
            reason: blockReason || null,
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Create blocked event for local state
      const blockedEvent: CalendarEvent = {
        id: data.id,
        title: `Blocked - ${blockReason || 'No reason provided'}`,
        client: 'N/A',
        date: selectedDateTime,
        type: 'event',
        status: 'blocked',
      };

      // Add to events array
      setEvents(prevEvents => [...prevEvents, blockedEvent]);

      // Close modal and reset form
      setShowBlockModal(false);
      setBlockDate('');
      setBlockReason('');

    } catch (err) {
      console.error('Error blocking date:', err);
      alert('Failed to block date. Please try again.');
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Calendar View</h1>
          <p className="text-neutral-600">Manage bookings and blocked dates</p>
        </div>
        <Button
          onClick={() => setShowBlockModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Block Date
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700">
          Error loading bookings: {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-neutral-600">Loading calendar...</div>
        </div>
      ) : (
        <>
          {/* Calendar Controls */}
          <div className="bg-white border border-neutral-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-neutral-100 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-semibold">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-neutral-100 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500"></div>
                <span>Confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500"></div>
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500"></div>
                <span>Blocked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-50 border border-blue-200"></div>
                <span>Today</span>
              </div>
            </div>

            {/* Day Labels */}
            <div className="grid grid-cols-7 gap-0 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-semibold p-2 bg-neutral-100">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0 border border-neutral-200">
              {(() => {
                const days = [];
                const totalDays = daysInMonth(currentMonth);
                const firstDay = firstDayOfMonth(currentMonth);

                for (let i = 0; i < firstDay; i++) {
                  days.push(<div key={`empty-${i}`} className="min-h-24 bg-neutral-50"></div>);
                }

                for (let day = 1; day <= totalDays; day++) {
                  const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                  const dayEvents = getEventsForDate(date);
                  const isToday = isSameDay(date, new Date());

                  days.push(
                    <div
                      key={day}
                      className={`min-h-24 p-2 border border-neutral-200 hover:bg-neutral-50 ${
                        isToday ? "bg-blue-50" : "bg-white"
                      }`}
                    >
                      <div className={`text-sm mb-1 ${isToday ? "font-bold text-blue-600" : ""}`}>
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs px-2 py-1 ${getEventColor(event.status)} text-white truncate`}
                          >
                            {event.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                return days;
              })()}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            <div className="space-y-3">
              {events
                .filter((e) => e.date >= new Date())
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 ${getEventColor(event.status)}`}></div>
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-neutral-600">
                          {event.date.toLocaleDateString()} • {event.client}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-neutral-200 text-neutral-700 text-xs uppercase">
                      {event.status}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}

      {/* Block Date Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Block Date</h3>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowBlockModal(false);
                  setBlockDate('');
                  setBlockReason('');
                }}
                className="p-1 hover:bg-neutral-100"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="block-date" className="block text-sm mb-2">Date</label>
                <input
                  id="block-date"
                  type="date"
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label htmlFor="block-reason" className="block text-sm mb-2">Reason (Optional)</label>
                <input
                  id="block-reason"
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="e.g., Personal event, Holiday, etc."
                  className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-black"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowBlockModal(false);
                    setBlockDate('');
                    setBlockReason('');
                  }}
                  className="flex-1 py-3 border border-neutral-300 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleBlockDate}
                  className="flex-1 py-3 bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Block Date
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
