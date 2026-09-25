import { useState } from "react";
import { Link } from "react-router-dom";
import { getUser } from "../../lib/auth";
import {
  getOpportunities, getMyApplications, applyToOpportunity,
  getQuickProfile, calculateMatch, AREAS_OPTIONS, type Opportunity,
} from "../../lib/mockData";

export default function VolunteerDashboard() {
  const user = getUser();
  const profile = getQuickProfile();
  const [opportunities] = useState<Opportunity[]>(getOpportunities());
  const [myApplications, setMyApplications] = useState<string[]>(getMyApplications());
  const [areaFilter, setAreaFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState<"any" | "yes" | "no">("any");

  const handleApply = (id: string) => {
    applyToOpportunity(id);
    setMyApplications(getMyApplications());
  };

  const filtered = opportunities
    .filter((o) => (areaFilter ? o.areaTrabajo === areaFilter : true))
    .filter((o) => (locationFilter ? o.location.toLowerCase().includes(locationFilter.toLowerCase()) : true))
    .filter((o) => {
      if (experienceFilter === "any") return true;
      if (experienceFilter === "yes") return o.experienceRequired;
      return !o.experienceRequired;
    })
    .map((o) => ({ ...o, match: calculateMatch(profile, o) }))
    .sort((a, b) => b.match - a.match);

  return (
    <div className="min-h-screen bg-white">
      {/* Top nav */}
      <nav className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <span className="font-display font-bold text-lg">
          <span className="text-purple-600">Match</span><span className="text-pink-500">Vol</span>
        </span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden sm:inline">Hi, {user?.name}</span>
          <Link to="/settings" className="text-sm font-semibold text-purple-600 hover:underline">
            Settings
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="font-bold text-xl mb-1">Opportunities for you</h1>
        <p className="text-sm text-gray-500 mb-5">Sorted by how well they match your profile.</p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-sm"
          >
            <option value="">All areas</option>
            {AREAS_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>

          <input
            type="text"
            placeholder="Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-sm w-40"
          />

          <select
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value as "any" | "yes" | "no")}
            className="border border-gray-300 rounded-lg p-2 text-sm"
          >
            <option value="any">Any experience</option>
            <option value="no">No experience needed</option>
            <option value="yes">Experience required</option>
          </select>
        </div>

        {/* List */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-10">No opportunities match these filters.</p>
          )}

          {filtered.map((opp) => {
            const applied = myApplications.includes(opp.id);
            return (
              <div key={opp.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="text-xs text-gray-500">{opp.orgName}</p>
                    <h3 className="font-bold text-base">{opp.title}</h3>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                      opp.match >= 70 ? "bg-green-100 text-green-700"
                        : opp.match >= 40 ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {opp.match}% match
                  </span>
                </div>

                <p className="text-sm text-gray-600 my-2">{opp.description}</p>

                <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-3">
                  <span className="bg-gray-100 px-2 py-1 rounded-full">📍 {opp.location}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded-full">🎂 {opp.ageMin}-{opp.ageMax}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded-full">
                    {opp.experienceRequired ? "Experience required" : "No experience needed"}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded-full">⏱ {opp.commitment}</span>
                </div>

                <button
                  disabled={applied}
                  onClick={() => handleApply(opp.id)}
                  style={!applied ? { backgroundColor: "#ec4899", color: "#ffffff" } : {}}
                  className={`text-sm font-semibold rounded-lg py-2 px-5 transition ${
                    applied ? "bg-gray-100 text-gray-400 cursor-default" : "hover:bg-pink-600"
                  }`}
                >
                  {applied ? "✓ Applied" : "Apply"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}