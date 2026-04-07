import { useState, useEffect } from "react";
import { Search, Filter, Calendar, Mail, Phone, MapPin, Clock, Users, Check, X, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { supabase } from "../../../lib/supabase";

interface Booking {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string;
  location: string;
  service_type: string;
  duration: string;
  number_of_people: string;
  confirmed: boolean;
  notes: string;
  created_at: string;
}

export function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (!auth) {
      navigate("/admin/login");
      return;
    }
    fetchBookings();
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setBookings(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: number, confirmed: boolean) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ confirmed })
        .eq('id', bookingId);

      if (error) throw error;

      // Update local state
      setBookings(bookings.map(booking =>
        booking.id === bookingId ? { ...booking, confirmed } : booking
      ));
    } catch (err) {
      console.error('Error updating booking:', err);
      setError(err instanceof Error ? err.message : 'Failed to update booking');
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.event_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "confirmed" && booking.confirmed) ||
      (statusFilter === "pending" && !booking.confirmed);
    return matchesSearch && matchesStatus;
  });

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  const getStatusColor = (confirmed: boolean) => {
    return confirmed
      ? "bg-green-500/10 text-green-600 border-green-500/20"
      : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-neutral-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Bookings Management</h1>
          <p className="text-neutral-600">View and manage all booking requests</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-200 hover:bg-neutral-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 mb-6">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-neutral-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name or event type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 focus:outline-none focus:border-black"
            />
          </div>
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
            </select>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="grid gap-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white border border-neutral-200 p-8 text-center">
            <p className="text-neutral-600">No bookings found</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white border border-neutral-200 p-6 hover:border-neutral-300 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{booking.full_name}</h3>
                  <p className="text-neutral-600">
                    {booking.event_type.charAt(0).toUpperCase() + booking.event_type.slice(1)}
                  </p>
                </div>
                <span className={`px-4 py-2 border text-sm self-start font-medium ${getStatusColor(booking.confirmed)}`}>
                  {booking.confirmed ? "Confirmed" : "Pending"}
                </span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-neutral-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-neutral-600">Event Date</div>
                    <div className="font-medium">
                      {new Date(booking.event_date).toLocaleDateString("en-ZA")}
                    </div>
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
                    <div className="font-medium text-sm">{booking.location}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-neutral-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-neutral-600">Guests</div>
                    <div className="font-medium">{booking.number_of_people || "N/A"}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-neutral-600">Service</div>
                  <div className="font-medium text-sm">{booking.service_type}</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-neutral-200">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-neutral-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-neutral-600">Email</div>
                    <a href={`mailto:${booking.email}`} className="font-medium text-blue-600 hover:underline">
                      {booking.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-neutral-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-neutral-600">Phone</div>
                    <a href={`tel:${booking.phone}`} className="font-medium text-blue-600 hover:underline">
                      {booking.phone}
                    </a>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <div className="mb-4 p-4 bg-neutral-50 border border-neutral-200">
                  <p className="text-sm text-neutral-600 mb-1">Notes:</p>
                  <p className="text-sm">{booking.notes}</p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => updateBookingStatus(booking.id, true)}
                  disabled={booking.confirmed}
                  className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 transition-colors ${
                    booking.confirmed
                      ? "bg-green-500/10 text-green-600 border border-green-500/20"
                      : "bg-green-500/20 text-green-700 border border-green-500/40 hover:bg-green-500/30"
                  }`}
                >
                  <Check className="w-4 h-4" />
                  Confirm
                </button>
                <button
                  onClick={() => updateBookingStatus(booking.id, false)}
                  disabled={!booking.confirmed}
                  className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 transition-colors ${
                    !booking.confirmed
                      ? "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20"
                      : "bg-red-500/20 text-red-700 border border-red-500/40 hover:bg-red-500/30"
                  }`}
                >
                  <X className="w-4 h-4" />
                  {booking.confirmed ? "Pending" : "Already Pending"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
