import { useState } from "react";
import {
  getOpportunities, getMyApplications, applyToOpportunity,
  getQuickProfile, calculateMatch, AREAS_OPTIONS, type Opportunity,
} from "../../lib/mockData";
import DashboardLayout from "../../components/layout/DashboardLayout";
import type { NavItem } from "../../components/layout/Sidebar";

const NAV_ITEMS: NavItem[] = [
  { label: "Home", to: "/InProgress", icon: "🏠" },
];

export default function VolunteerDashboard() {
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
    <DashboardLayout navItems={NAV_ITEMS} title="Home">
      <div className="max-w-3xl">
        <p className="text-sm text-gray-500 mb-5">Opportunities sorted by how well they match your profile.</p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-sm bg-white"
          >
            <option value="">All areas</option>
            {AREAS_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>

          <input
            type="text"
            placeholder="Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-sm w-40 bg-white"
          />

          <select
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value as "any" | "yes" | "no")}
            className="border border-gray-300 rounded-lg p-2 text-sm bg-white"
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
              <div key={opp.id} className="bg-white border border-gray-200 rounded-xl p-4">
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
    </DashboardLayout>
  );
}