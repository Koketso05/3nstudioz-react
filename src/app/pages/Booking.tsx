import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Calendar, Clock, MapPin, Users, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Calendar as CalendarComponent } from "../components/Calendar";
import AddressAutocomplete from "../components/AddressAutocomplete";
import { supabase } from "../../lib/supabase";

interface BookingFormData {
  serviceType: string;
  eventDate: Date | undefined;
  fullName: string;
  phone: string;
  email: string;
  location: string;
  locationLat?: number | undefined;
  locationLng?: number | undefined;
  distanceKm?: number | undefined;
  eventType: string;
  duration: string;
  numberOfPeople: string;
  notes: string;
}

interface BookingPrefillState {
  prefill?: {
    serviceType?: string;
    duration?: string;
    notes?: string;
  };
}

export function Booking() {
  const location = useLocation();
  const bookingState = location.state as BookingPrefillState | null;

  const [formData, setFormData] = useState<BookingFormData>({
    serviceType: "",
    eventDate: undefined,
    fullName: "",
    phone: "",
    email: "",
    location: "",
    locationLat: undefined,
    locationLng: undefined,
    distanceKm: undefined,
    eventType: "",
    duration: "",
    numberOfPeople: "",
    notes: "",
  });
  // Studio coordinates can be provided via env vars VITE_STUDIO_LAT and VITE_STUDIO_LNG
  const STUDIO_LAT = parseFloat((import.meta as any).env.VITE_STUDIO_LAT) || 0;
  const STUDIO_LNG = parseFloat((import.meta as any).env.VITE_STUDIO_LNG) || 0;

  const computeDistanceKm = (lat1?: number, lon1?: number, lat2?: number, lon2?: number) => {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return 0;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);

  useEffect(() => {
    const prefill = bookingState?.prefill;
    if (!prefill) return;

    setFormData((prev) => ({
      ...prev,
      serviceType: prefill.serviceType ?? prev.serviceType,
      duration: prefill.duration ?? prev.duration,
      notes: prefill.notes ?? prev.notes,
    }));
  }, [bookingState]);

  useEffect(() => {
    const fetchUnavailableDates = async () => {
      try {
        // Fetch confirmed bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('event_date')
          .not('event_date', 'is', null)
          .eq('confirmed', true);

        if (bookingsError) {
          console.error('Error fetching booked dates:', bookingsError);
        } else if (bookingsData) {
          const booked = bookingsData
            .map(booking => booking.event_date ? new Date(booking.event_date) : null)
            .filter(date => date !== null) as Date[];
          setBookedDates(booked);
        }

        // Fetch blocked dates
        const { data: blockedData, error: blockedError } = await supabase
          .from('blocked_dates')
          .select('blocked_date');

        if (blockedError) {
          console.error('Error fetching blocked dates:', blockedError);
        } else if (blockedData) {
          const blocked = blockedData
            .map(blocked => blocked.blocked_date ? new Date(blocked.blocked_date) : null)
            .filter(date => date !== null) as Date[];
          setBlockedDates(blocked);
        }
      } catch (err) {
        console.error('Error fetching unavailable dates:', err);
      }
    };

    fetchUnavailableDates();
  }, []);

  const sendBookingNotificationEmail = async (bookingData: BookingFormData) => {
    // Use the function's public URL with the anon key to avoid forwarding ES256 user JWTs
    const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL as string;
    const projectRef = supabaseUrl?.replace(/^https?:\/\//, '')?.split('.')?.[0];
    const fnUrl = `https://${projectRef}.functions.supabase.co/send-booking-email`;
    const anonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY as string;

    const payload = {
      serviceType: bookingData.serviceType,
      eventDate: bookingData.eventDate
        ? bookingData.eventDate.toLocaleDateString('en-ZA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'Not selected',
      fullName: bookingData.fullName,
      phone: bookingData.phone,
      email: bookingData.email,
      location: bookingData.location,
      distance: bookingData.distanceKm != null ? `${bookingData.distanceKm} km` : undefined,
      eventType: bookingData.eventType,
      duration: bookingData.duration,
      numberOfPeople: bookingData.numberOfPeople,
      notes: bookingData.notes,
    };

    const resp = await fetch(fnUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`send-booking-email function error: ${resp.status} ${txt}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate that selected date is not blocked
      if (formData.eventDate) {
        const isDateBlocked = blockedDates.some(blockedDate =>
          blockedDate.toDateString() === formData.eventDate!.toDateString()
        );
        if (isDateBlocked) {
          throw new Error('Selected date is not available for booking');
        }
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            service_type: formData.serviceType,
            event_date: formData.eventDate?.toISOString(),
            full_name: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            location: formData.location,
            location_lat: formData.locationLat ?? null,
            location_lng: formData.locationLng ?? null,
            distance_km: formData.distanceKm ?? null,
            event_type: formData.eventType,
            duration: formData.duration,
            number_of_people: formData.numberOfPeople,
            status: 'pending',
            notes: formData.notes,
          }
        ]);

      if (error) {
        throw error;
      }

      await sendBookingNotificationEmail(formData);
      setIsSubmitted(true);

      // Refresh booked dates to include the new booking
      const { data: updatedData } = await supabase
        .from('bookings')
        .select('event_date')
        .not('event_date', 'is', null)
        .eq('confirmed', true);

      if (updatedData) {
        const dates = updatedData
          .map(booking => booking.event_date ? new Date(booking.event_date) : null)
          .filter(date => date !== null) as Date[];
        setBookedDates(dates);
      }

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          serviceType: "",
          eventDate: undefined,
          fullName: "",
          phone: "",
          email: "",
          location: "",
            locationLat: undefined,
            locationLng: undefined,
            distanceKm: undefined,
          eventType: "",
          duration: "",
          numberOfPeople: "",
          notes: "",
        });
      }, 3000);
    } catch (err) {
      console.error('Error submitting booking:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while submitting your booking');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof BookingFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl mb-4">Booking Received!</h2>
          <p className="text-white/70 mb-8">
            Thank you for your booking request. We'll review your details and get back to you within 24 hours.
          </p>
          <p className="text-sm text-white/50">
            Your booking request has been sent to our team at 3NStudioz.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl mb-4">Book Your Session</h1>
          <p className="text-white/60 text-lg">
            Fill out the form below and we'll get back to you within 24 hours
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Service Type */}
            <div>
              <label className="block text-sm mb-2">
                Service Type <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.serviceType}
                onChange={(e) => updateFormData("serviceType", e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-white/20 text-white focus:outline-none focus:border-yellow-400"
              >
                <option value="">Select a service</option>
                <option value="photography">Photography Only</option>
                <option value="videography">Videography Only</option>
                <option value="both">Photography & Videography</option>
              </select>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => updateFormData("fullName", e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-white/20 text-white focus:outline-none focus:border-yellow-400"
                placeholder="John Doe"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => updateFormData("phone", e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-white/20 text-white focus:outline-none focus:border-yellow-400"
                placeholder="+27 123 456 789"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-white/20 text-white focus:outline-none focus:border-yellow-400"
                placeholder="john@example.com"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Event Location <span className="text-red-500">*</span>
              </label>
              <AddressAutocomplete
                value={formData.location}
                onSelect={(address: string, lat?: number, lng?: number) => {
                  updateFormData("location", address);
                  updateFormData("locationLat", lat ?? undefined);
                  updateFormData("locationLng", lng ?? undefined);
                  if (lat != null && lng != null && STUDIO_LAT && STUDIO_LNG) {
                    // compute straight-line distance immediately
                    const d = computeDistanceKm(lat, lng, STUDIO_LAT, STUDIO_LNG);
                    updateFormData("distanceKm", Number(d.toFixed(2)));

                    // request Google driving distance via Supabase Edge Function
                    (async () => {
                      try {
                        // Call the deployed Edge Function via its public URL and supply the anon key
                        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
                        const projectRef = supabaseUrl?.replace(/^https?:\/\//, '')?.split('.')?.[0];
                        const fnUrl = `https://${projectRef}.functions.supabase.co/get-distance`;

                        const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
                        const resp = await fetch(fnUrl, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'apikey': anonKey,
                            'Authorization': `Bearer ${anonKey}`,
                          },
                          body: JSON.stringify({ origin: `${STUDIO_LAT},${STUDIO_LNG}`, destination: `${lat},${lng}` }),
                        });

                        if (resp.ok) {
                          const data = await resp.json();
                          if (data && data.distance_meters != null) {
                            const km = Number((data.distance_meters / 1000).toFixed(2));
                            updateFormData('distanceKm', km);
                          }
                        } else {
                          const txt = await resp.text();
                          console.error('get-distance function error:', resp.status, txt);
                        }
                      } catch (err) {
                        console.error('Error fetching driving distance', err);
                      }
                    })();
                  } else {
                    updateFormData("distanceKm", undefined);
                  }
                }}
                placeholder="Venue name or address"
              />

              {formData.locationLat != null && formData.locationLng != null && STUDIO_LAT && STUDIO_LNG && (
                <p className="text-sm text-white/70 mt-2">
                  Distance from 3nstudioz: {computeDistanceKm(formData.locationLat, formData.locationLng, STUDIO_LAT, STUDIO_LNG).toFixed(1)} km
                  {formData.distanceKm != null && (
                    <span> — stored: {formData.distanceKm} km</span>
                  )}
                </p>
              )}
            </div>

            {/* Event Type */}
            <div>
              <label className="block text-sm mb-2">
                Event Type <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.eventType}
                onChange={(e) => updateFormData("eventType", e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-white/20 text-white focus:outline-none focus:border-yellow-400"
              >
                <option value="">Select event type</option>
                <option value="wedding">Wedding</option>
                <option value="birthday">Birthday Party</option>
                <option value="corporate">Corporate Event</option>
                <option value="conference">Conference</option>
                <option value="portrait">Portrait Session</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Expected Duration <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.duration}
                onChange={(e) => updateFormData("duration", e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-white/20 text-white focus:outline-none focus:border-yellow-400"
              >
                <option value="">Select duration</option>
                <option value="1-2">1-2 hours</option>
                <option value="2-4">2-4 hours</option>
                <option value="4-6">4-6 hours</option>
                <option value="6-8">6-8 hours</option>
                <option value="full-day">Full day (8+ hours)</option>
              </select>
            </div>

            {/* Number of People */}
            <div>
              <label className="block text-sm mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Approximate Number of People
              </label>
              <input
                type="text"
                value={formData.numberOfPeople}
                onChange={(e) => updateFormData("numberOfPeople", e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-white/20 text-white focus:outline-none focus:border-yellow-400"
                placeholder="e.g., 50-100"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Additional Notes / Special Requests
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => updateFormData("notes", e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-neutral-900 border border-white/20 text-white focus:outline-none focus:border-yellow-400 resize-none"
                placeholder="Tell us about any special requirements or requests..."
              />
            </div>
          </div>

          {/* Right Column - Calendar */}
          <div>
            <div className="bg-neutral-900 border border-white/10 p-6 sticky top-24">
              <label className="block text-sm mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Select Event Date <span className="text-red-500">*</span>
              </label>
              <CalendarComponent
                selected={formData.eventDate}
                onSelect={(date) => updateFormData("eventDate", date)}
                bookedDates={bookedDates}
                blockedDates={blockedDates}
              />

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                  <span className="text-white/70">Selected date</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500/20 border border-red-500/40 rounded"></div>
                  <span className="text-white/70">Already booked</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-500/20 border border-gray-500/40 rounded"></div>
                  <span className="text-white/70">Blocked / Unavailable</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-white/5 border border-white/20 rounded"></div>
                  <span className="text-white/70">Available</span>
                </div>
              </div>

              {formData.eventDate && (
                <div className="mt-6 p-4 bg-yellow-400/10 border border-yellow-400/20">
                  <p className="text-sm text-yellow-400">
                    Selected: {formData.eventDate.toLocaleDateString("en-ZA", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 py-4 bg-yellow-400 text-black hover:bg-yellow-500 disabled:bg-yellow-400/50 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit Booking Request"
                )}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              )}

              <div className="mt-4 p-3 bg-yellow-400/10 border border-yellow-400/20 text-center">
                <p className="text-xs text-yellow-300">
                  Please note: A 60% non-refundable deposit is required for all Premium Packages before 3NStudioz can provide photography or videography services.
                </p>
              </div>

              <p className="text-xs text-white/50 mt-4 text-center">
                By submitting, you agree to our {" "}
                <Link to="/terms-and-conditions" className="text-yellow-400 hover:text-yellow-300 underline">
                  terms and conditions
                </Link>
                .
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
