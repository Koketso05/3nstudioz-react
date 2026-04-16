-- Migration: add distance_km to bookings
-- Run with the provided script or in Supabase SQL Editor

ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS distance_km double precision;
