// @ts-nocheck

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify authenticated user from JWT
    const userClient = createClient(supabaseUrl, anonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { bookingId, status } = await req.json();
    if (!bookingId || !status || !["confirmed", "rejected"].includes(status)) {
      return new Response(JSON.stringify({ error: "Invalid bookingId or status" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: bookingData, error: bookingError } = await adminClient
      .from("bookings")
      .select("id, full_name, email, event_date, event_type, service_type, duration, location")
      .eq("id", bookingId)
      .single();

    if (bookingError || !bookingData) {
      throw new Error(bookingError?.message || "Booking not found");
    }

    const { error: updateError } = await adminClient
      .from("bookings")
      .update({
        confirmed: status === "confirmed",
        status,
      })
      .eq("id", bookingId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    let emailSent = false;

    if (status === "confirmed") {
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (!resendApiKey) {
        throw new Error("RESEND_API_KEY is not set");
      }

      const fromEmail = Deno.env.get("FROM_EMAIL") ?? "onboarding@resend.dev";

      const eventDateText = bookingData.event_date
        ? new Date(bookingData.event_date).toLocaleDateString("en-ZA", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "To be confirmed";

      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: `3NStudioz Bookings <${fromEmail}>`,
          to: [bookingData.email],
          subject: "Your booking has been confirmed - 3NStudioz",
          html: `
            <div style="font-family: sans-serif; max-width: 640px; margin: 0 auto;">
              <h2 style="color: #111;">Booking Confirmed</h2>
              <p>Hi ${escapeHtml(String(bookingData.full_name || "there"))},</p>
              <p>Great news. Your booking request has been <strong>confirmed</strong>.</p>
              <hr style="border: none; border-top: 1px solid #eee;" />
              <p><strong>Service:</strong> ${escapeHtml(String(bookingData.service_type || "N/A"))}</p>
              <p><strong>Event Type:</strong> ${escapeHtml(String(bookingData.event_type || "N/A"))}</p>
              <p><strong>Date:</strong> ${escapeHtml(eventDateText)}</p>
              <p><strong>Duration:</strong> ${escapeHtml(String(bookingData.duration || "N/A"))}</p>
              <p><strong>Location:</strong> ${escapeHtml(String(bookingData.location || "N/A"))}</p>
              <hr style="border: none; border-top: 1px solid #eee;" />
              <p>We look forward to capturing your moment.</p>
              <p>Regards,<br />3NStudioz Team</p>
            </div>
          `,
        }),
      });

      if (!emailRes.ok) {
        const errText = await emailRes.text();
        throw new Error(`Failed to send confirmation email: ${errText}`);
      }

      emailSent = true;
    }

    return new Response(JSON.stringify({ success: true, emailSent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
