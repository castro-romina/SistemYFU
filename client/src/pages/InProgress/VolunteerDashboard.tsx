import { useState, useEffect } from "react";
import { getUser } from "../../lib/auth";
import {
  getOpportunities, getMyApplications, applyToOpportunity,
  getQuickProfile, saveQuickProfile, calculateMatch,
  SKILLS_OPTIONS, AREAS_OPTIONS, type Opportunity,
} from "../../lib/mockData";
import ChipSelect from "../../components/common/ChipSelect";

export default function VolunteerDashboard() {
  const user = getUser();
  const [opportunities] = useState<Opportunity[]>(getOpportunities());
  const [myApplications, setMyApplications] = useState<string[]>(getMyApplications());
  const [profile, setProfile] = useState(getQuickProfile());
  const [areaFilter, setAreaFilter] = useState<string>("");
  const [cvFileName, setCvFileName] = useState<string>("");

  useEffect(() => {
    saveQuickProfile(profile);
  }, [profile]);

  const filtered = areaFilter
    ? opportunities.filter((o) => o.areaTrabajo === areaFilter)
    : opportunities;

  const handleApply = (id: string) => {
    applyToOpportunity(id);
    setMyApplications(getMyApplications());
  };

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCvFileName(file.name);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-bold text-2xl mb-1">
          Hi, <span className="text-pink-500">{user?.name}</span> 👋
        </h1>
        <p className="text-gray-600 mb-6">Here are opportunities that could match with you.</p>

        {/* Quick profile for matching */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <h2 className="font-semibold mb-3">Your quick match profile</h2>
          <p className="text-xs text-gray-500 mb-3">
            This helps us show you a match score. (Demo only — not yet connected to your full profile.)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-sm font-medium block mb-1">City</label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                placeholder="e.g. Buenos Aires"
                className="border border-gray-300 rounded-lg p-2 w-full text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Age</label>
              <input
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                className="border border-gray-300 rounded-lg p-2 w-full text-sm"
              />
            </div>
          </div>
          <label className="text-sm font-medium block mb-1">Skills</label>
          <ChipSelect
            options={SKILLS_OPTIONS}
            selected={profile.skills}
            onChange={(skills) => setProfile({ ...profile, skills })}
          />
        </div>

        {/* CV upload */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <h2 className="font-semibold mb-2">Resume / CV</h2>
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvUpload} className="text-sm" />
          {cvFileName && <p className="text-xs text-green-600 mt-2">✓ {cvFileName} selected</p>}
          <p className="text-xs text-gray-500 mt-2">Upload storage coming soon — this is a visual preview for now.</p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm font-medium">Area:</label>
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-sm"
          >
            <option value="">All areas</option>
            {AREAS_OPTIONS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Opportunities list */}
        <div className="space-y-4">
          {filtered.map((opp) => {
            const match = calculateMatch(profile, opp);
            const applied = myApplications.includes(opp.id);
            return (
              <div key={opp.id} className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-xs text-gray-500">{opp.orgName}</p>
                    <h3 className="font-bold text-lg">{opp.title}</h3>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      match >= 70 ? "bg-green-100 text-green-700"
                        : match >= 40 ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {match}% match
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{opp.description}</p>
                <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-600">
                  <span className="bg-gray-100 px-2 py-1 rounded-full">📍 {opp.location}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded-full">🎂 {opp.ageMin}-{opp.ageMax}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded-full">
                    {opp.experienceRequired ? "Experience required" : "No experience needed"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {opp.skillsRequired.map((s) => (
                    <span key={s} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{s}</span>
                  ))}
                </div>
                <button
                  disabled={applied}
                  onClick={() => handleApply(opp.id)}
                  style={!applied ? { backgroundColor: "#ec4899", color: "#ffffff" } : {}}
                  className={`text-sm font-semibold rounded-lg py-2 px-5 transition ${
                    applied ? "bg-gray-200 text-gray-500 cursor-default" : "hover:bg-pink-600"
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