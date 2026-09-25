import { useState } from "react";
import { getQuickProfile, saveQuickProfile, SKILLS_OPTIONS } from "../../lib/mockData";
import ChipSelect from "../../components/common/ChipSelect";
import DashboardLayout from "../../components/layout/DashboardLayout";
import type { NavItem } from "../../components/layout/Sidebar";

const NAV_ITEMS: NavItem[] = [
  { label: "Home", to: "/InProgress", icon: "🏠" },
];

export default function Settings() {
  const [profile, setProfile] = useState(getQuickProfile());
  const [cvFileName, setCvFileName] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveQuickProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCvFileName(file.name);
  };

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Settings">
      <div className="max-w-lg">
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
          <h2 className="font-semibold mb-3">Resume / CV</h2>
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvUpload} className="text-sm" />
          {cvFileName && <p className="text-xs text-green-600 mt-2">✓ {cvFileName} selected</p>}
          <p className="text-xs text-gray-400 mt-2">Storage coming soon.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
          <h2 className="font-semibold mb-3">Matching profile</h2>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs font-medium block mb-1">City</label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 w-full text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Age</label>
              <input
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                className="border border-gray-300 rounded-lg p-2 w-full text-sm"
              />
            </div>
          </div>
          <label className="text-xs font-medium block mb-1">Skills</label>
          <ChipSelect
            options={SKILLS_OPTIONS}
            selected={profile.skills}
            onChange={(skills) => setProfile({ ...profile, skills })}
          />
        </div>

        <button
          onClick={handleSave}
          style={{ backgroundColor: "#ec4899", color: "#ffffff" }}
          className="w-full rounded-lg py-2.5 text-sm font-semibold hover:bg-pink-600 transition"
        >
          {saved ? "Saved ✓" : "Save changes"}
        </button>
      </div>
    </DashboardLayout>
  );
}