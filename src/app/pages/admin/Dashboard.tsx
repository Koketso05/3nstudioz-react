import { Calendar, TrendingUp, Users, DollarSign, Clock } from "lucide-react";

export function AdminDashboard() {
  const stats = [
    {
      icon: Calendar,
      label: "Upcoming Bookings",
      value: "12",
      change: "+3 this week",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      icon: Clock,
      label: "Pending Requests",
      value: "5",
      change: "Needs review",
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
    {
      icon: Users,
      label: "Total Clients",
      value: "248",
      change: "+15 this month",
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      icon: DollarSign,
      label: "Monthly Revenue",
      value: "R125,000",
      change: "+12% from last month",
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
  ];

  const recentBookings = [
    {
      id: 1,
      client: "Sarah & John",
      event: "Wedding",
      date: "2026-04-15",
      service: "Photography & Videography",
      status: "confirmed",
    },
    {
      id: 2,
      client: "Tech Corp Ltd",
      event: "Corporate Event",
      date: "2026-04-20",
      service: "Photography",
      status: "pending",
    },
    {
      id: 3,
      client: "Lisa Johnson",
      event: "Birthday Party",
      date: "2026-04-25",
      service: "Videography",
      status: "confirmed",
    },
    {
      id: 4,
      client: "Mike Anderson",
      event: "Portrait Session",
      date: "2026-04-30",
      service: "Photography",
      status: "pending",
    },
  ];

  const upcomingEvents = [
    { date: "Apr 10", event: "Wedding - Sarah & John", time: "2:00 PM" },
    { date: "Apr 15", event: "Corporate - Tech Summit", time: "9:00 AM" },
    { date: "Apr 20", event: "Birthday - Lisa Johnson", time: "5:00 PM" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-neutral-500/10 text-neutral-500 border-neutral-500/20";
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-neutral-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border border-neutral-200 p-6">
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
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-200 hover:border-neutral-300 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{booking.client}</h3>
                  <p className="text-sm text-neutral-600">
                    {booking.event} • {booking.service}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">{booking.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-xs border capitalize ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                  <button className="px-4 py-2 bg-black text-white hover:bg-neutral-800 transition-colors text-sm">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white border border-neutral-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="pb-4 border-b border-neutral-200 last:border-0 last:pb-0">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-400/10 border border-yellow-400/20 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-xs font-semibold text-yellow-600">
                      {event.date.split(" ")[0]}
                    </span>
                    <span className="text-lg font-bold text-yellow-600">
                      {event.date.split(" ")[1]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{event.event}</h4>
                    <p className="text-sm text-neutral-600">{event.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white border border-neutral-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button className="px-6 py-3 bg-black text-white hover:bg-neutral-800 transition-colors">
            Add New Booking
          </button>
          <button className="px-6 py-3 border border-neutral-300 hover:bg-neutral-50 transition-colors">
            Upload Photos
          </button>
          <button className="px-6 py-3 border border-neutral-300 hover:bg-neutral-50 transition-colors">
            Block Dates
          </button>
          <button className="px-6 py-3 border border-neutral-300 hover:bg-neutral-50 transition-colors">
            View Calendar
          </button>
        </div>
      </div>
    </div>
  );
}
