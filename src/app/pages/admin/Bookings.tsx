import { useState } from "react";
import { Search, Filter, Calendar, Mail, Phone, MapPin, Clock, Users } from "lucide-react";

interface Booking {
  id: number;
  client: string;
  email: string;
  phone: string;
  event: string;
  eventType: string;
  date: string;
  location: string;
  service: string;
  duration: string;
  numberOfPeople: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes: string;
  createdAt: string;
}

export function AdminBookings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const bookings: Booking[] = [
    {
      id: 1,
      client: "Sarah & John Smith",
      email: "sarah@example.com",
      phone: "+27 123 456 789",
      event: "Wedding Ceremony",
      eventType: "wedding",
      date: "2026-05-15",
      location: "The Grand Hotel, Johannesburg",
      service: "Photography & Videography",
      duration: "Full day (8+ hours)",
      numberOfPeople: "150-200",
      status: "confirmed",
      notes: "Need drone footage for outdoor ceremony",
      createdAt: "2026-03-20",
    },
    {
      id: 2,
      client: "Tech Corp Ltd",
      email: "events@techcorp.com",
      phone: "+27 987 654 321",
      event: "Annual Conference",
      eventType: "corporate",
      date: "2026-04-20",
      location: "Convention Center, Cape Town",
      service: "Photography",
      duration: "6-8 hours",
      numberOfPeople: "500+",
      status: "pending",
      notes: "Need photos for marketing materials",
      createdAt: "2026-04-01",
    },
    {
      id: 3,
      client: "Lisa Johnson",
      email: "lisa.j@email.com",
      phone: "+27 555 123 456",
      event: "30th Birthday Party",
      eventType: "birthday",
      date: "2026-06-10",
      location: "Private Residence, Pretoria",
      service: "Videography",
      duration: "4-6 hours",
      numberOfPeople: "50-80",
      status: "confirmed",
      notes: "Want highlights reel for social media",
      createdAt: "2026-03-15",
    },
    {
      id: 4,
      client: "Mike Anderson",
      email: "mike.anderson@company.com",
      phone: "+27 111 222 333",
      event: "Executive Portrait Session",
      eventType: "portrait",
      date: "2026-04-05",
      location: "3NStudioz Studio",
      service: "Photography",
      duration: "1-2 hours",
      numberOfPeople: "1",
      status: "completed",
      notes: "Need professional headshots for LinkedIn",
      createdAt: "2026-03-01",
    },
  ];

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.event.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-neutral-500/10 text-neutral-600 border-neutral-500/20";
    }
  };

  const updateStatus = (bookingId: number, newStatus: Booking["status"]) => {
    console.log(`Update booking ${bookingId} to ${newStatus}`);
    // In production, this would update the backend
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bookings Management</h1>
        <p className="text-neutral-600">View and manage all booking requests</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-neutral-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by client name or event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 focus:outline-none focus:border-black"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-neutral-300 focus:outline-none focus:border-black appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="grid gap-4">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="bg-white border border-neutral-200 p-6 hover:border-neutral-300 transition-colors">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-1">{booking.client}</h3>
                <p className="text-neutral-600">{booking.event}</p>
              </div>
              <span className={`px-4 py-2 border capitalize text-sm self-start ${getStatusColor(booking.status)}`}>
                {booking.status}
              </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-neutral-400 mt-0.5" />
                <div>
                  <div className="text-sm text-neutral-600">Event Date</div>
                  <div className="font-medium">{new Date(booking.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-neutral-400 mt-0.5" />
                <div>
                  <div className="text-sm text-neutral-600">Duration</div>
                  <div className="font-medium">{booking.duration}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-neutral-400 mt-0.5" />
                <div>
                  <div className="text-sm text-neutral-600">Location</div>
                  <div className="font-medium">{booking.location}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-neutral-400 mt-0.5" />
                <div>
                  <div className="text-sm text-neutral-600">Guests</div>
                  <div className="font-medium">{booking.numberOfPeople}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <a href={`mailto:${booking.email}`} className="flex items-center gap-2 text-sm text-neutral-600 hover:text-black">
                <Mail className="w-4 h-4" />
                {booking.email}
              </a>
              <a href={`tel:${booking.phone}`} className="flex items-center gap-2 text-sm text-neutral-600 hover:text-black">
                <Phone className="w-4 h-4" />
                {booking.phone}
              </a>
            </div>

            {booking.notes && (
              <div className="mb-4 p-3 bg-neutral-50 border border-neutral-200">
                <div className="text-sm text-neutral-600 mb-1">Notes:</div>
                <p className="text-sm">{booking.notes}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {booking.status === "pending" && (
                <>
                  <button
                    onClick={() => updateStatus(booking.id, "confirmed")}
                    className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors text-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateStatus(booking.id, "cancelled")}
                    className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors text-sm"
                  >
                    Reject
                  </button>
                </>
              )}
              {booking.status === "confirmed" && (
                <button
                  onClick={() => updateStatus(booking.id, "completed")}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm"
                >
                  Mark Completed
                </button>
              )}
              <button className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 transition-colors text-sm">
                View Details
              </button>
              <button className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 transition-colors text-sm">
                Send Message
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="bg-white border border-neutral-200 p-12 text-center">
          <p className="text-neutral-600">No bookings found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
