import { useState } from "react";
import { Link } from "react-router-dom";
import { getUser } from "../../lib/auth";
import { getQuickProfile, saveQuickProfile, SKILLS_OPTIONS } from "../../lib/mockData";
import ChipSelect from "../../components/common/ChipSelect";

export default function Settings() {
  const user = getUser();
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
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <span className="font-display font-bold text-lg">
          <span className="text-purple-600">Match</span><span className="text-pink-500">Vol</span>
        </span>
        <Link to="/InProgress" className="text-sm font-semibold text-purple-600 hover:underline">
          Back to opportunities
        </Link>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-6">
        <h1 className="font-bold text-xl mb-1">Settings</h1>
        <p className="text-sm text-gray-500 mb-6">Hi, {user?.name}. Manage your profile here.</p>

        <div className="border border-gray-200 rounded-xl p-4 mb-4">
          <h2 className="font-semibold mb-3">Resume / CV</h2>
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvUpload} className="text-sm" />
          {cvFileName && <p className="text-xs text-green-600 mt-2">✓ {cvFileName} selected</p>}
          <p className="text-xs text-gray-400 mt-2">Storage coming soon.</p>
        </div>

        <div className="border border-gray-200 rounded-xl p-4 mb-4">
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
    </div>
  );
}