import React, { useEffect, useState } from "react";
import TextField from "./TextField";

export interface LocationValue {
  country: string;
  phone: string;
  city: string;
}

interface Country {
  id: string;
  name: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

const PHONE_REGEX: Record<string, RegExp> = {
  AR: /^(\+54|0)?[1-9]\d{1,4}\d{6,8}$/,
  CL: /^(\+56|0)?[1-9]\d{8}$/,
  CO: /^(\+57)?[1-9]\d{9}$/,
  MX: /^(\+52)?[1-9]\d{9}$/,
  PE: /^(\+51)?[1-9]\d{8}$/,
};

export const validatePhoneNumber = (phone: string, countryId: string): boolean =>
  PHONE_REGEX[countryId]?.test(phone.replace(/\s/g, "")) || false;

interface Props {
  value: LocationValue;
  onChange: (value: LocationValue) => void;
}

export default function LocationFields({ value, onChange }: Props) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadError, setLoadError] = useState("");
  const [cityQuery, setCityQuery] = useState(value.city);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/location/countries`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setCountries)
      .catch(() => setLoadError("Failed to load countries"));
  }, []);

  useEffect(() => {
    if (!cityQuery.trim() || !value.country || cityQuery === value.city) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const r = await fetch(
          `${API_BASE_URL}/api/location/cities-search?query=${encodeURIComponent(cityQuery)}&country=${value.country}`
        );
        if (!r.ok) throw new Error();
        setSuggestions(await r.json());
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [cityQuery, value.country, value.city]);

  const changeCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCityQuery("");
    onChange({ ...value, country: e.target.value, city: "" });
  };

  const typeCity = (text: string) => {
    setCityQuery(text);
    onChange({ ...value, city: "" }); // la ciudad solo cuenta cuando se elige de la lista
  };

  const selectCity = (city: string) => {
    setCityQuery(city);
    onChange({ ...value, city });
    setShowSuggestions(false);
  };

  return (
    <>
      <select
        value={value.country}
        onChange={changeCountry}
        className="border border-gray-300 rounded-lg p-3 w-full"
        required
      >
        <option value="">{countries.length || loadError ? "Select your country" : "Loading countries..."}</option>
        {countries.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {loadError && <p className="text-red-500 text-sm font-semibold">{loadError}</p>}

      <TextField
        id="phone"
        label="Phone number"
        type="tel"
        placeholder="+54 11 1234 5678"
        value={value.phone}
        onChange={(e) => onChange({ ...value, phone: e.target.value })}
        required
      />

      <div className="relative">
        <TextField
          id="city"
          label="City"
          type="text"
          placeholder="Start typing your city..."
          value={cityQuery}
          onChange={(e) => typeCity(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          disabled={!value.country}
          required
        />

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => selectCity(s)}
                className="w-full text-left px-4 py-2 hover:bg-purple-100 border-b border-gray-200 last:border-b-0 transition"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {searching && cityQuery && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 p-2 text-sm text-gray-500">
            Searching...
          </div>
        )}
      </div>
    </>
  );
}