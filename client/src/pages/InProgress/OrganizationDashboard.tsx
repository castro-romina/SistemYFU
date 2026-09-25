import { useState } from "react";
import { getUser } from "../../lib/auth";
import {
  getOpportunities, saveOpportunities, getApplicants, calculateMatch,
  SKILLS_OPTIONS, AREAS_OPTIONS, type Opportunity,
} from "../../lib/mockData";
import ChipSelect from "../../components/common/ChipSelect";
import DashboardLayout from "../../components/layout/DashboardLayout";
import type { NavItem } from "../../components/layout/Sidebar";

const emptyForm = {
  title: "", description: "", location: "", areaTrabajo: "",
  ageMin: 18, ageMax: 99, experienceRequired: false, skillsRequired: [] as string[],
  commitment: "Flexible" as "Part-time" | "Full-time" | "Flexible",
};

export default function OrganizationDashboard() {
  const user = getUser();
  const [opportunities, setOpportunities] = useState<Opportunity[]>(
    getOpportunities().filter((o) => o.orgName === user?.name)
  );
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [viewingApplicants, setViewingApplicants] = useState<Opportunity | null>(null);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const newOpp: Opportunity = {
      id: `op-${Date.now()}`,
      orgName: user?.name || "Your organization",
      title: form.title,
      description: form.description,
      location: form.location,
      areaTrabajo: form.areaTrabajo,
      ageMin: form.ageMin,
      ageMax: form.ageMax,
      experienceRequired: form.experienceRequired,
      skillsRequired: form.skillsRequired,
      commitment: form.commitment,
      date: new Date().toISOString().slice(0, 10),
    };

    const all = getOpportunities();
    const updated = [...all, newOpp];
    saveOpportunities(updated);
    setOpportunities(updated.filter((o) => o.orgName === user?.name));
    setForm(emptyForm);
    setShowForm(false);
  };

  return (
    <DashboardLayout title="Home">
      <div className="max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-500">Manage your open opportunities and applicants.</p>
          <button
            onClick={() => setShowForm(true)}
            style={{ backgroundColor: "#ec4899", color: "#ffffff" }}
            className="font-semibold rounded-lg py-2 px-4 hover:bg-pink-600 transition text-sm"
          >
            + Post opportunity
          </button>
        </div>

        {opportunities.length === 0 && (
          <div className="bg-white rounded-lg border p-8 text-center text-gray-500">
            You haven't posted any opportunities yet.
          </div>
        )}

        <div className="space-y-4">
          {opportunities.map((opp) => (
            <div key={opp.id} className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-bold text-lg">{opp.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{opp.description}</p>
              <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-600">
                <span className="bg-gray-100 px-2 py-1 rounded-full">📍 {opp.location}</span>
                <span className="bg-gray-100 px-2 py-1 rounded-full">🎂 {opp.ageMin}-{opp.ageMax}</span>
                <span className="bg-gray-100 px-2 py-1 rounded-full">{opp.areaTrabajo}</span>
                <span className="bg-gray-100 px-2 py-1 rounded-full">⏱ {opp.commitment}</span>
              </div>
              <button
                onClick={() => setViewingApplicants(opp)}
                className="text-sm font-semibold text-purple-600 hover:underline"
              >
                View matching volunteers →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Post opportunity modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <h2 className="font-bold text-lg mb-4">Post a new opportunity</h2>
            <form onSubmit={handlePublish} className="space-y-3">
              <input
                type="text" required placeholder="Title"
                value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 w-full text-sm"
              />
              <textarea
                required placeholder="Description" rows={3}
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 w-full text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text" required placeholder="Location"
                  value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2 w-full text-sm"
                />
                <select
                  required value={form.areaTrabajo}
                  onChange={(e) => setForm({ ...form, areaTrabajo: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2 w-full text-sm"
                >
                  <option value="">Area</option>
                  {AREAS_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium block mb-1">Min age</label>
                  <input
                    type="number" value={form.ageMin}
                    onChange={(e) => setForm({ ...form, ageMin: Number(e.target.value) })}
                    className="border border-gray-300 rounded-lg p-2 w-full text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Max age</label>
                  <input
                    type="number" value={form.ageMax}
                    onChange={(e) => setForm({ ...form, ageMax: Number(e.target.value) })}
                    className="border border-gray-300 rounded-lg p-2 w-full text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Commitment</label>
                <select
                  value={form.commitment}
                  onChange={(e) => setForm({ ...form, commitment: e.target.value as "Part-time" | "Full-time" | "Flexible" })}
                  className="border border-gray-300 rounded-lg p-2 w-full text-sm"
                >
                  <option value="Flexible">Flexible</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Full-time">Full-time</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox" checked={form.experienceRequired}
                  onChange={(e) => setForm({ ...form, experienceRequired: e.target.checked })}
                />
                Requires previous experience
              </label>
              <div>
                <label className="text-xs font-medium block mb-1">Skills needed</label>
                <ChipSelect
                  options={SKILLS_OPTIONS}
                  selected={form.skillsRequired}
                  onChange={(skills) => setForm({ ...form, skillsRequired: skills })}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-300 rounded-lg py-2 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: "#ec4899", color: "#ffffff" }}
                  className="flex-1 rounded-lg py-2 text-sm font-semibold hover:bg-pink-600"
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Applicants modal */}
      {viewingApplicants && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <h2 className="font-bold text-lg mb-1">Matching volunteers</h2>
            <p className="text-sm text-gray-500 mb-4">for "{viewingApplicants.title}"</p>
            <div className="space-y-3">
              {getApplicants().map((a) => {
                const match = calculateMatch(a, viewingApplicants);
                return (
                  <div key={a.id} className="border rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-sm">{a.name}</p>
                      <p className="text-xs text-gray-500">{a.city} · {a.age} years old</p>
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
                );
              })}
            </div>
            <button
              onClick={() => setViewingApplicants(null)}
              className="w-full mt-4 border border-gray-300 rounded-lg py-2 text-sm font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}