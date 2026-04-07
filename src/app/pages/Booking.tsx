import { useState } from "react";
import { Calendar, Clock, MapPin, Users, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Calendar as CalendarComponent } from "../components/Calendar";
import { supabase } from "../../lib/supabase";

interface BookingFormData {
  serviceType: string;
  eventDate: Date | undefined;
  fullName: string;
  phone: string;
  email: string;
  location: string;
  eventType: string;
  duration: string;
  numberOfPeople: string;
  notes: string;
}

export function Booking() {
  const [formData, setFormData] = useState<BookingFormData>({
    serviceType: "",
    eventDate: undefined,
    fullName: "",
    phone: "",
    email: "",
    location: "",
    eventType: "",
    duration: "",
    numberOfPeople: "",
    notes: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const emailTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const emailPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const sendBookingNotificationEmail = async (bookingData: BookingFormData) => {
    if (!emailServiceId || !emailTemplateId || !emailPublicKey) {
      throw new Error("Missing EmailJS configuration");
    }

    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: emailServiceId,
        template_id: emailTemplateId,
        user_id: emailPublicKey,
        template_params: {
          to_email: "3nstudioz@gmail.com",
          service_type: bookingData.serviceType,
          event_date: bookingData.eventDate
            ? bookingData.eventDate.toLocaleDateString("en-ZA", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Not selected",
          full_name: bookingData.fullName,
          phone: bookingData.phone,
          email: bookingData.email,
          location: bookingData.location,
          event_type: bookingData.eventType,
          duration: bookingData.duration,
          number_of_people: bookingData.numberOfPeople,
          notes: bookingData.notes,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Email send failed: ${response.status} ${errorBody}`);
    }
  };

  // Mock booked dates (in production, this would come from backend)
  const bookedDates = [
    new Date(2026, 3, 10),
    new Date(2026, 3, 15),
    new Date(2026, 3, 20),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
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
            event_type: formData.eventType,
            duration: formData.duration,
            number_of_people: formData.numberOfPeople,
            notes: formData.notes,
          }
        ]);

      if (error) {
        throw error;
      }

      await sendBookingNotificationEmail(formData);
      setIsSubmitted(true);

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
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => updateFormData("location", e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-white/20 text-white focus:outline-none focus:border-yellow-400"
                placeholder="Venue name or address"
              />
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

              <p className="text-xs text-white/50 mt-4 text-center">
                By submitting, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
