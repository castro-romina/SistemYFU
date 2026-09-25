import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../components/common/Button";
import TextField from "../../components/common/TextField";
import ModalAviso from "../../components/common/ModalAviso";
import { usePersistedState } from "../../hooks/usePersistedState";
import { logout } from "../../lib/auth";

interface Country {
  id: string;
  name: string;
}

export default function Onboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showOnboardingModal, setShowOnboardingModal] = useState(
    Boolean((location.state as { onboardingRequired?: boolean } | null)?.onboardingRequired)
  );

  const [fullName, setFullName] = usePersistedState("onboarding-fullName", "");
  const [birthDate, setBirthDate] = usePersistedState("onboarding-birthDate", "");
  const [country, setCountry] = usePersistedState("onboarding-country", "");
  const [phone, setPhone] = usePersistedState("onboarding-phone", "");
  const [city, setCity] = usePersistedState("onboarding-city", "");
  const [cityQuery, setCityQuery] = usePersistedState("onboarding-cityQuery", "");
  const [howHeard, setHowHeard] = usePersistedState("onboarding-howHeard", "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [searchingCities, setSearchingCities] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/location/countries`);
        if (!response.ok) throw new Error("Failed to fetch countries");
        const data = await response.json();
        setCountries(data);
      } catch (err) {
        console.error("Error fetching countries:", err);
        setError("Failed to load countries");
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, [API_BASE_URL]);

  // Debounce city search
  useEffect(() => {
    if (!cityQuery.trim() || !country) {
      setCitySuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchingCities(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/location/cities-search?query=${encodeURIComponent(cityQuery)}&country=${country}`
        );
        if (!response.ok) throw new Error("Failed to search cities");
        const data = await response.json();
        setCitySuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Error searching cities:", err);
        setCitySuggestions([]);
      } finally {
        setSearchingCities(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [cityQuery, country, API_BASE_URL]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountry(e.target.value);
    setCity("");
    setCityQuery("");
    setCitySuggestions([]);
  };

  const selectCity = (selectedCity: string) => {
    setCity(selectedCity);
    setCityQuery(selectedCity);
    setShowSuggestions(false);
  };

  const validatePhoneNumber = (phoneNumber: string, countryId: string): boolean => {
    const phoneRegex: Record<string, RegExp> = {
      AR: /^(\+54|0)?[1-9]\d{1,4}\d{6,8}$/,
      CL: /^(\+56|0)?[1-9]\d{8}$/,
      CO: /^(\+57)?[1-9]\d{9}$/,
      MX: /^(\+52)?[1-9]\d{9}$/,
      PE: /^(\+51)?[1-9]\d{8}$/
    };
    return phoneRegex[countryId]?.test(phoneNumber.replace(/\s/g, "")) || false;
  };

  const isAtLeast18 = (birthDate: string): boolean => {
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }
    if (!birthDate) {
      setError("Date of birth is required");
      return;
    }
    if (!isAtLeast18(birthDate)) {
      setError("You must be at least 18 years old to register as a volunteer");
      return;
    }
    if (!country) {
      setError("Country is required");
      return;
    }
    if (!phone.trim()) {
      setError("Phone number is required");
      return;
    }
    if (!validatePhoneNumber(phone, country)) {
      const countryName = countries.find(c => c.id === country)?.name;
      setError(`Invalid phone number format for ${countryName}`);
      return;
    }
    if (!city) {
      setError("City is required");
      return;
    }
    if (!howHeard) {
      setError("Please select how you heard about MatchVol");
      return;
    }

    setIsLoading(true);

    try {
      localStorage.setItem("onboarding-step1", JSON.stringify({
        fullName, birthDate, country, phone, city, howHeard
      }));
      navigate("/Onboarding/step2");
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingCountries) {
    return (
      <div className="auth-shell">
        <main className="auth-card">
          <p className="text-center">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      {showOnboardingModal && (
        <ModalAviso
         title="Complete your registration"
    message="Before you can use your account, you need to finish completing this form."
    onClose={() => setShowOnboardingModal(false)}
    />
      )}
      <main className="auth-card">
        <header className="auth-heading flex flex-col items-center mb-6">

          <button
    type="button"
    onClick={() => {
      logout();
      navigate("/login");
    }}
    className="text-xs text-gray-400 hover:text-gray-600 hover:underline self-end mb-2"
  >
    Sign out
  </button>
          <img src="/logofinal.png" alt="MatchVol" width="48" height="48" className="rounded-lg mb-3" />
          <h1 className="font-display font-bold text-2xl tracking-tight text-center">
            We're happy you're joining <span className="text-purple-600">Match</span><span className="text-pink-500">Vol</span>
          </h1>
          <p className="text-sm text-[#4B4560] text-center font-medium mt-2">Complete the form and start connecting</p>


        </header>

        <form onSubmit={handleSubmit} className="auth-form">
          <TextField
            id="fullName"
            label="Full name"
            type="text"
            placeholder="E.g.: John Smith"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <TextField
            id="birthDate"
            label="Date of birth"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />

          <select
            value={country}
            onChange={handleCountryChange}
            className="border border-gray-300 rounded-lg p-3 w-full"
            required
          >
            <option value="">Select your country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <TextField
            id="phone"
            label="Phone number"
            type="tel"
            placeholder="+54 11 1234 5678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <div className="relative">
            <TextField
              id="city"
              label="City"
              type="text"
              placeholder="Start typing your city..."
              value={cityQuery}
              onChange={(e) => setCityQuery(e.target.value)}
              onFocus={() => cityQuery && setShowSuggestions(true)}
              disabled={!country}
              required
            />

            {showSuggestions && citySuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10">
                {citySuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => selectCity(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-purple-100 border-b border-gray-200 last:border-b-0 transition"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {searchingCities && cityQuery && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 p-2 text-sm text-gray-500">
                Searching...
              </div>
            )}
          </div>

          <select
            value={howHeard}
            onChange={(e) => setHowHeard(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full"
            required
          >
            <option value="">How did you hear about MatchVol?</option>
            <option value="social_media">Social media</option>
            <option value="friend">A friend</option>
            <option value="event">An event</option>
            <option value="search">Search engine</option>
            <option value="other">Other</option>
          </select>

          {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

          <Button
            type="submit"
            disabled={isLoading}
            style={{ backgroundColor: '#ec4899', color: '#ffffff' }}
            className="hover:bg-pink-600 font-semibold rounded-lg transition duration-200 py-3 shadow-md w-full"
          >
            {isLoading ? "Saving..." : "Continue"}
          </Button>
        </form>
      </main>
    </div>
  );
}