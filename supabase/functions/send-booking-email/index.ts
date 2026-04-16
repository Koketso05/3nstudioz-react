// @ts-nocheck

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
    const {
      serviceType,
      eventDate,
      fullName,
      phone,
      email,
      location,
      distance,
      eventType,
      duration,
      numberOfPeople,
      notes,
    } = await req.json();

    if (!serviceType || !fullName || !phone || !email || !location || !eventType || !duration) {
      return new Response(
        JSON.stringify({ error: "Missing required booking fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) throw new Error("RESEND_API_KEY is not set");

    const recipientEmail = Deno.env.get("RECIPIENT_EMAIL") ?? "3nstudioz@gmail.com";
    const fromEmail = Deno.env.get("FROM_EMAIL") ?? "onboarding@resend.dev";

    const safeNotes = notes ? escapeHtml(String(notes)).replaceAll("\n", "<br>") : "Not provided";

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: `3NStudioz Booking Form <${fromEmail}>`,
        to: [recipientEmail],
        reply_to: email,
        subject: `New Booking Request from ${fullName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 680px; margin: 0 auto;">
            <h2 style="color: #111;">New Booking Request</h2>
            <hr style="border: none; border-top: 1px solid #eee;" />
            <p><strong>Service Type:</strong> ${escapeHtml(String(serviceType))}</p>
            <p><strong>Event Date:</strong> ${escapeHtml(String(eventDate || "Not selected"))}</p>
            <p><strong>Full Name:</strong> ${escapeHtml(String(fullName))}</p>
            <p><strong>Phone:</strong> ${escapeHtml(String(phone))}</p>
            <p><strong>Email:</strong> <a href="mailto:${escapeHtml(String(email))}">${escapeHtml(String(email))}</a></p>
            <p><strong>Location:</strong> ${escapeHtml(String(location))}</p>
            <p><strong>Distance:</strong> ${escapeHtml(String(distance ?? 'Not provided'))}</p>
            <p><strong>Event Type:</strong> ${escapeHtml(String(eventType))}</p>
            <p><strong>Duration:</strong> ${escapeHtml(String(duration))}</p>
            <p><strong>Number of People:</strong> ${escapeHtml(String(numberOfPeople || "Not provided"))}</p>
            <p><strong>Additional Notes:</strong></p>
            <p style="background:#f9f9f9; padding:12px; border-left:4px solid #d4af37;">${safeNotes}</p>
            <hr style="border: none; border-top: 1px solid #eee;" />
            <p style="color:#888; font-size:12px;">Sent via 3NStudioz website booking form</p>
          </div>
        `,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      throw new Error(`Resend error: ${errText}`);
    }

    return new Response(JSON.stringify({ success: true }), {
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
