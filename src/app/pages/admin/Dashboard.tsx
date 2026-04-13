import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Calendar, Users, Clock, Ban } from "lucide-react";
import { supabase } from "../../../lib/supabase";

interface Booking {
  id: number;
  full_name: string;
  event_type: string;
  event_date: string;
  service_type: string;
  confirmed: boolean;
  status?: "pending" | "confirmed" | "rejected";
  created_at: string;
}

interface BlockedDate {
  id: number;
  blocked_date: string;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [bookingsResponse, blockedDatesResponse] = await Promise.all([
          supabase
            .from("bookings")
            .select("id, full_name, event_type, event_date, service_type, confirmed, status, created_at")
            .order("created_at", { ascending: false }),
          supabase.from("blocked_dates").select("id, blocked_date"),
        ]);

        if (bookingsResponse.error) throw bookingsResponse.error;
        if (blockedDatesResponse.error) throw blockedDatesResponse.error;

        setBookings((bookingsResponse.data as Booking[]) ?? []);
        setBlockedDates((blockedDatesResponse.data as BlockedDate[]) ?? []);
        setError(null);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getBookingStatus = (booking: Booking) => booking.status ?? (booking.confirmed ? "confirmed" : "pending");

  const upcomingBookingsCount = bookings.filter((booking) => {
    const bookingDate = new Date(booking.event_date);
    const status = getBookingStatus(booking);
    return bookingDate >= today && status === "confirmed";
  }).length;

  const pendingRequestsCount = bookings.filter((booking) => getBookingStatus(booking) === "pending").length;
  const totalClientsCount = new Set(bookings.map((booking) => booking.full_name.trim().toLowerCase())).size;
  const blockedDatesCount = blockedDates.length;

  const stats = [
    {
      icon: Calendar,
      label: "Upcoming Bookings",
      value: String(upcomingBookingsCount),
      change: "Confirmed future bookings",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      icon: Clock,
      label: "Pending Requests",
      value: String(pendingRequestsCount),
      change: "Needs review",
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
    {
      icon: Users,
      label: "Total Clients",
      value: String(totalClientsCount),
      change: "Unique booking clients",
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      icon: Ban,
      label: "Blocked Dates",
      value: String(blockedDatesCount),
      change: "Unavailable days on calendar",
      color: "text-red-400",
      bg: "bg-red-400/10",
    },
  ];

  const recentBookings = bookings.slice(0, 5);

  const upcomingEvents = bookings
    .filter((booking) => new Date(booking.event_date) >= today)
    .sort((first, second) => new Date(first.event_date).getTime() - new Date(second.event_date).getTime())
    .slice(0, 3);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-neutral-500/10 text-neutral-500 border-neutral-500/20";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-neutral-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-neutral-600">Welcome back! Here's what's happening today.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-600 p-4">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-neutral-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-neutral-600 mb-2">{stat.label}</div>
              <div className="text-xs text-neutral-500">{stat.change}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
          {recentBookings.length === 0 ? (
            <p className="text-neutral-600">No bookings yet.</p>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => {
                const status = getBookingStatus(booking);

                return (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-200 hover:border-neutral-300 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{booking.full_name}</h3>
                      <p className="text-sm text-neutral-600">
                        {booking.event_type} • {booking.service_type}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {new Date(booking.event_date).toLocaleDateString("en-ZA")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 text-xs border capitalize ${getStatusColor(status)}`}
                      >
                        {status}
                      </span>
                      <button
                        type="button"
                        onClick={() => navigate("/admin/bookings")}
                        className="px-4 py-2 bg-black text-white hover:bg-neutral-800 transition-colors text-sm"
                      >
                        View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="bg-white border border-neutral-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <p className="text-neutral-600">No upcoming events scheduled.</p>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => {
                const eventDate = new Date(event.event_date);

                return (
                  <div key={event.id} className="pb-4 border-b border-neutral-200 last:border-0 last:pb-0">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-yellow-400/10 border border-yellow-400/20 rounded-lg flex flex-col items-center justify-center">
                        <span className="text-xs font-semibold text-yellow-600">
                          {eventDate.toLocaleDateString("en-ZA", { month: "short" })}
                        </span>
                        <span className="text-lg font-bold text-yellow-600">
                          {eventDate.getDate()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">
                          {event.event_type} - {event.full_name}
                        </h4>
                        <p className="text-sm text-neutral-600">{event.service_type}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white border border-neutral-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/bookings")}
            className="px-6 py-3 bg-black text-white hover:bg-neutral-800 transition-colors"
          >
            Add New Booking
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/portfolio")}
            className="px-6 py-3 border border-neutral-300 hover:bg-neutral-50 transition-colors"
          >
            Upload Photos
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/bookings")}
            className="px-6 py-3 border border-neutral-300 hover:bg-neutral-50 transition-colors"
          >
            Block Dates
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/calendar")}
            className="px-6 py-3 border border-neutral-300 hover:bg-neutral-50 transition-colors"
          >
            View Calendar
          </button>
        </div>
      </div>
    </div>
  );
}
