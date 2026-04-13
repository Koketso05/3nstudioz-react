import { useState, useEffect } from "react";
import { Search, Filter, Calendar, Mail, Phone, MapPin, Clock, Users, Check, X, Pencil, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { supabase } from "../../../lib/supabase";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

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

interface BlockedDate {
  id: number;
  blocked_date: string;
  reason: string | null;
}

export function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [activeTab, setActiveTab] = useState<"bookings" | "blocked-dates">("bookings");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();
  const [editingBlockedDateId, setEditingBlockedDateId] = useState<number | null>(null);
  const [blockedDateForm, setBlockedDateForm] = useState({ blocked_date: "", reason: "" });
  const [isAddingBlockedDate, setIsAddingBlockedDate] = useState(false);
  const [newBlockedDateForm, setNewBlockedDateForm] = useState({ blocked_date: "", reason: "" });

  useEffect(() => {
    fetchBookings();

    // Listen for auth state changes to redirect if logged out
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/admin/login");
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const [bookingsResponse, blockedDatesResponse] = await Promise.all([
        supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('blocked_dates')
          .select('id, blocked_date, reason')
          .order('blocked_date', { ascending: true }),
      ]);

      if (bookingsResponse.error) throw bookingsResponse.error;
      if (blockedDatesResponse.error) throw blockedDatesResponse.error;

      setBookings((bookingsResponse.data as Booking[]) || []);
      setBlockedDates((blockedDatesResponse.data as BlockedDate[]) || []);
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

  const startEditingBlockedDate = (blockedDate: BlockedDate) => {
    setEditingBlockedDateId(blockedDate.id);
    setBlockedDateForm({
      blocked_date: blockedDate.blocked_date ? blockedDate.blocked_date.split("T")[0] : "",
      reason: blockedDate.reason ?? "",
    });
  };

  const cancelEditingBlockedDate = () => {
    setEditingBlockedDateId(null);
    setBlockedDateForm({ blocked_date: "", reason: "" });
  };

  const saveBlockedDate = async (id: number) => {
    try {
      const { error: updateError } = await supabase
        .from("blocked_dates")
        .update({
          blocked_date: blockedDateForm.blocked_date,
          reason: blockedDateForm.reason.trim() || null,
        })
        .eq("id", id);

      if (updateError) throw updateError;

      setBlockedDates((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                blocked_date: blockedDateForm.blocked_date,
                reason: blockedDateForm.reason.trim() || null,
              }
            : item
        )
      );

      cancelEditingBlockedDate();
    } catch (err) {
      console.error("Error updating blocked date:", err);
      setError(err instanceof Error ? err.message : "Failed to update blocked date");
    }
  };

  const deleteBlockedDate = async (id: number) => {
    try {
      const { error: deleteError } = await supabase.from("blocked_dates").delete().eq("id", id);
      if (deleteError) throw deleteError;

      setBlockedDates((current) => current.filter((item) => item.id !== id));
      if (editingBlockedDateId === id) {
        cancelEditingBlockedDate();
      }
    } catch (err) {
      console.error("Error deleting blocked date:", err);
      setError(err instanceof Error ? err.message : "Failed to delete blocked date");
    }
  };

  const addBlockedDate = async () => {
    try {
      if (!newBlockedDateForm.blocked_date) {
        setError("Please select a date to block");
        return;
      }

      const alreadyExists = blockedDates.some(
        (item) => item.blocked_date.split("T")[0] === newBlockedDateForm.blocked_date
      );

      if (alreadyExists) {
        setError("That date is already blocked");
        return;
      }

      const { data, error: insertError } = await supabase
        .from("blocked_dates")
        .insert([
          {
            blocked_date: newBlockedDateForm.blocked_date,
            reason: newBlockedDateForm.reason.trim() || null,
          },
        ])
        .select("id, blocked_date, reason")
        .single();

      if (insertError) throw insertError;

      setBlockedDates((current) => [...current, data as BlockedDate].sort((a, b) =>
        a.blocked_date.localeCompare(b.blocked_date)
      ));
      setIsAddingBlockedDate(false);
      setNewBlockedDateForm({ blocked_date: "", reason: "" });
      setError(null);
    } catch (err) {
      console.error("Error adding blocked date:", err);
      setError(err instanceof Error ? err.message : "Failed to add blocked date");
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
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 mb-6">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border border-neutral-200 p-2 mb-6 inline-flex gap-2">
        <Button
          variant="outline"
          onClick={() => setActiveTab("bookings")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "bookings"
              ? "bg-black text-white"
              : "border border-neutral-300 hover:bg-neutral-50"
          }`}
        >
          Bookings
        </Button>
        <Button
          variant="outline"
          onClick={() => setActiveTab("blocked-dates")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "blocked-dates"
              ? "bg-black text-white"
              : "border border-neutral-300 hover:bg-neutral-50"
          }`}
        >
          Blocked Dates
        </Button>
      </div>

      {/* Filters */}
      {activeTab === "bookings" && (
        <div className="bg-white border border-neutral-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search by name or event type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 focus:outline-none focus:border-black h-12"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="pl-10 pr-8 py-3 border border-neutral-300 focus:outline-none focus:border-black bg-white min-w-[180px] h-12 data-[size=default]:h-12">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {activeTab === "blocked-dates" && (
        <div className="bg-white border border-neutral-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Blocked Dates</h2>
            <Button
              onClick={() => setIsAddingBlockedDate((current) => !current)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-neutral-800"
            >
              <Plus className="w-4 h-4" />
              {isAddingBlockedDate ? "Cancel" : "Add Blocked Date"}
            </Button>
          </div>

          {isAddingBlockedDate && (
            <div className="grid gap-3 md:grid-cols-2 mb-4 border border-neutral-200 bg-neutral-50 p-4">
              <Input
                type="date"
                value={newBlockedDateForm.blocked_date}
                onChange={(e) =>
                  setNewBlockedDateForm((prev) => ({ ...prev, blocked_date: e.target.value }))
                }
                className="w-full px-3 py-2 border border-neutral-300 bg-white text-neutral-900"
              />
              <Input
                type="text"
                value={newBlockedDateForm.reason}
                onChange={(e) =>
                  setNewBlockedDateForm((prev) => ({ ...prev, reason: e.target.value }))
                }
                placeholder="Reason (optional)"
                className="w-full px-3 py-2 border border-neutral-300 bg-white text-neutral-900"
              />
              <div className="md:col-span-2 flex justify-end">
                <Button
                  onClick={addBlockedDate}
                  className="px-4 py-2 bg-black text-white hover:bg-neutral-800"
                >
                  Save Blocked Date
                </Button>
              </div>
            </div>
          )}

          {blockedDates.length === 0 ? (
            <p className="text-neutral-600">No blocked dates set.</p>
          ) : (
            <div className="grid gap-3">
              {blockedDates.map((blockedDate) => (
                <div
                  key={blockedDate.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border border-red-200 bg-red-50 p-4"
                >
                  <div className="flex-1">
                    {editingBlockedDateId === blockedDate.id ? (
                      <div className="grid gap-3 md:grid-cols-2">
                        <Input
                          type="date"
                          value={blockedDateForm.blocked_date}
                          onChange={(e) =>
                            setBlockedDateForm((prev) => ({ ...prev, blocked_date: e.target.value }))
                          }
                          className="w-full px-3 py-2 border border-neutral-300 bg-white text-neutral-900"
                        />
                        <Input
                          type="text"
                          value={blockedDateForm.reason}
                          onChange={(e) =>
                            setBlockedDateForm((prev) => ({ ...prev, reason: e.target.value }))
                          }
                          placeholder="Reason (optional)"
                          className="w-full px-3 py-2 border border-neutral-300 bg-white text-neutral-900"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-700">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">
                          {new Date(blockedDate.blocked_date).toLocaleDateString("en-ZA", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {editingBlockedDateId === blockedDate.id ? null : (
                    <p className="text-sm text-red-700 flex-1 md:text-right">
                      {blockedDate.reason || "No reason provided"}
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    {editingBlockedDateId === blockedDate.id ? (
                      <>
                        <Button
                          onClick={() => saveBlockedDate(blockedDate.id)}
                          className="px-3 py-2 bg-black text-white hover:bg-neutral-800"
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={cancelEditingBlockedDate}
                          className="px-3 py-2 border border-neutral-300 bg-white hover:bg-neutral-100"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => startEditingBlockedDate(blockedDate)}
                          className="p-2 border border-neutral-300 bg-white hover:bg-neutral-100"
                          aria-label="Edit blocked date"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => deleteBlockedDate(blockedDate.id)}
                          className="p-2"
                          aria-label="Delete blocked date"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "bookings" && (
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
                <Button
                  variant="outline"
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
                </Button>
                <Button
                  variant="outline"
                  onClick={() => updateBookingStatus(booking.id, false)}
                  disabled={!booking.confirmed}
                  className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 transition-colors ${
                    booking.confirmed
                      ? "bg-red-500/20 text-red-700 border border-red-500/40 hover:bg-red-500/30"
                      : "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20"
                  }`}
                >
                  <X className="w-4 h-4" />
                  {booking.confirmed ? "Pending" : "Already Pending"}
                </Button>
              </div>
            </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
