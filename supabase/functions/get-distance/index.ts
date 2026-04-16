// @ts-nocheck

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { origin, destination } = await req.json();
    if (!origin || !destination) {
      return new Response(JSON.stringify({ error: 'Missing origin or destination' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!apiKey) throw new Error('GOOGLE_MAPS_API_KEY not set');

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}&units=metric`;

    const resp = await fetch(url);
    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Distance Matrix API error: ${txt}`);
    }

    const json = await resp.json();
    if (json.status !== 'OK') {
      throw new Error(`Distance Matrix status: ${json.status}`);
    }

    const element = json.rows?.[0]?.elements?.[0];
    if (!element) throw new Error('No distance element');
    if (element.status !== 'OK') {
      return new Response(JSON.stringify({ error: `element status ${element.status}` }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const distance_meters = element.distance?.value ?? null;
    const distance_text = element.distance?.text ?? null;
    const duration_seconds = element.duration?.value ?? null;
    const duration_text = element.duration?.text ?? null;

    return new Response(JSON.stringify({ distance_meters, distance_text, duration_seconds, duration_text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
