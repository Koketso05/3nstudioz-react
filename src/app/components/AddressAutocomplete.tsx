import React from "react";

type Suggestion = {
  id: string;
  label: string;
  lat?: number;
  lng?: number;
  placeId?: string;
};

type Props = {
  value?: string;
  onSelect: (address: string, lat?: number, lng?: number) => void;
  placeholder?: string;
};

const GOOGLE_KEY = (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

function loadGooglePlaces(apiKey: string) {
  return new Promise<void>((resolve, reject) => {
    if ((window as any).google && (window as any).google.maps && (window as any).google.maps.places) {
      resolve();
      return;
    }
    const id = `gmaps-js`;
    if (document.getElementById(id)) {
      // wait for existing script to load
      const check = () => {
        if ((window as any).google && (window as any).google.maps && (window as any).google.maps.places) resolve();
        else setTimeout(check, 50);
      };
      check();
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
}

export default function AddressAutocomplete({ value = "", onSelect, placeholder }: Props) {
  const [query, setQuery] = React.useState<string>(value);
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [activeIndex, setActiveIndex] = React.useState<number>(-1);
  const [open, setOpen] = React.useState(false);
  const abortRef = React.useRef<number | null>(null);
  const requestIdRef = React.useRef(0);
  const suppressRef = React.useRef(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    setQuery(value);
  }, [value]);

  // Debounced lookup
  React.useEffect(() => {
    if (suppressRef.current) {
      // ignore this search because it was triggered by a recent selection
      return;
    }

    if (!query || query.trim().length < 1) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const handle = window.setTimeout(async () => {
      // bump request id for this lookup so we can ignore stale responses
      requestIdRef.current += 1;
      const thisRequestId = requestIdRef.current;
      try {
        if (GOOGLE_KEY) {
          await loadGooglePlaces(GOOGLE_KEY);
          const service = new (window as any).google.maps.places.AutocompleteService();
          // Restrict predictions to South Africa
          service.getPlacePredictions({ input: query, componentRestrictions: { country: 'za' } }, (predictions: any[], status: string) => {
            if (status !== (window as any).google.maps.places.PlacesServiceStatus.OK || !predictions) {
              setSuggestions([]);
              setOpen(false);
              return;
            }
            const items: Suggestion[] = predictions.map((p: any) => ({
              id: p.place_id,
              label: p.description,
              placeId: p.place_id,
            }));
            // only set suggestions if this response is the latest
            if (thisRequestId === requestIdRef.current) {
              setSuggestions(items.slice(0, 7));
              setOpen(true);
            }
          });
        } else {
          // Nominatim fallback
          // Limit Nominatim results to South Africa using countrycodes=za
          const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&countrycodes=za&limit=7`;
          const res = await fetch(url);
          if (!res.ok) {
            setSuggestions([]);
            setOpen(false);
            return;
          }
          const data = await res.json();
          const items: Suggestion[] = data.map((d: any) => ({
            id: d.place_id || d.osm_id,
            label: d.display_name,
            lat: parseFloat(d.lat),
            lng: parseFloat(d.lon),
          }));
          if (thisRequestId === requestIdRef.current) {
            setSuggestions(items);
            setOpen(true);
          }
        }
      } catch (err) {
        setSuggestions([]);
        setOpen(false);
      }
    }, 300);

    return () => {
      clearTimeout(handle);
      // invalidate any in-flight responses
      requestIdRef.current += 1;
      if (abortRef.current) {
        window.clearTimeout(abortRef.current);
        abortRef.current = null;
      }
    };
  }, [query]);

  // When selecting a suggestion, resolve lat/lng (Google via geocoder, Nominatim already provides coords)
  const selectSuggestion = async (s: Suggestion) => {
    // selecting a suggestion should invalidate any pending lookups
    requestIdRef.current += 1;
    // suppress subsequent automatic lookups for a short time
    suppressRef.current = true;
    window.setTimeout(() => { suppressRef.current = false; }, 500);
    if (s.placeId && GOOGLE_KEY) {
      try {
        const geocoder = new (window as any).google.maps.Geocoder();
        geocoder.geocode({ placeId: s.placeId }, (results: any[], status: string) => {
            if (status === (window as any).google.maps.GeocoderStatus.OK && results && results[0]) {
              const loc = results[0].geometry.location;
              const lat = loc.lat();
              const lng = loc.lng();
              setQuery(s.label);
              setOpen(false);
              setSuggestions([]);
              setActiveIndex(-1);
              onSelect(s.label, lat, lng);
              // remove focus so the input doesn't immediately reopen suggestions
              inputRef.current?.blur();
          } else {
              setQuery(s.label);
              setOpen(false);
              setSuggestions([]);
              setActiveIndex(-1);
              onSelect(s.label);
              inputRef.current?.blur();
          }
        });
      } catch (err) {
        setQuery(s.label);
        setOpen(false);
        setSuggestions([]);
        setActiveIndex(-1);
        onSelect(s.label);
      }
    } else {
      setQuery(s.label);
      setOpen(false);
      setSuggestions([]);
      setActiveIndex(-1);
      onSelect(s.label, s.lat, s.lng);
      inputRef.current?.blur();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) selectSuggestion(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          // inform parent immediate value (no coords yet)
          onSelect(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => { if (suggestions.length) setOpen(true); }}
        onBlur={() => { setOpen(false); }}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-neutral-900 border border-white/20 text-white focus:outline-none focus:border-yellow-400"
        aria-autocomplete="list"
        aria-expanded={open}
      />

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-neutral-900 border border-white/10 max-h-60 overflow-auto rounded shadow-lg">
          {suggestions.map((s, idx) => (
            <li
              key={s.id}
              onMouseDown={(e) => { e.preventDefault(); selectSuggestion(s); }}
              className={`px-3 py-2 cursor-pointer ${idx === activeIndex ? 'bg-white/5' : ''}`}
            >
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
