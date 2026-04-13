// @ts-nocheck

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const createJsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return createJsonResponse({ error: "Missing Authorization header" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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
      return createJsonResponse({ error: "Unauthorized" }, 401);
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { action, serviceId, payload } = await req.json();

    if (!action) {
      return createJsonResponse({ error: "Missing action" }, 400);
    }

    if (action === "create") {
      const { data, error } = await adminClient
        .from("services")
        .insert([payload])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return createJsonResponse({ success: true, service: data });
    }

    if (action === "update") {
      if (!serviceId) {
        return createJsonResponse({ error: "Missing serviceId" }, 400);
      }

      const { data, error } = await adminClient
        .from("services")
        .update(payload)
        .eq("id", serviceId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return createJsonResponse({ success: true, service: data });
    }

    if (action === "delete") {
      if (!serviceId) {
        return createJsonResponse({ error: "Missing serviceId" }, 400);
      }

      const { error } = await adminClient.from("services").delete().eq("id", serviceId);
      if (error) throw new Error(error.message);
      return createJsonResponse({ success: true });
    }

    if (action === "toggle-active") {
      if (!serviceId || typeof payload?.is_active !== "boolean") {
        return createJsonResponse({ error: "Missing serviceId or is_active" }, 400);
      }

      const { data, error } = await adminClient
        .from("services")
        .update({ is_active: payload.is_active })
        .eq("id", serviceId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return createJsonResponse({ success: true, service: data });
    }

    return createJsonResponse({ error: "Invalid action" }, 400);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return createJsonResponse({ error: message }, 500);
  }
});
