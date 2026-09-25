import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import TextField from "../../components/common/TextField";
import { getMyProfile, completeOnboarding } from "../../lib/api";

const AVAILABLE_SKILLS = [
  "Communication", "Graphic design", "Social media", "Organization", "Excel",
  "Translation", "Photography", "Administration", "Marketing", "Project management",
  "Leadership", "Teamwork", "Problem solving", "Public speaking", "Event planning",
  "Content writing", "Video editing", "Web design", "Coding",
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIME_SLOTS = ["9am-12pm", "1pm-5pm", "6pm-9pm"];

export default function Settings() {
  const [form, setForm] = useState({
    fullName: "", fechaNacimiento: "", pais: "", telefono: "", ciudad: "",
    acercaDe: "", carrera: "", genero: "", linkedin: "",
    habilidades: [] as string[], experiencia: "", horasPorSemana: "",
    disponibilidad: [] as string[],
  });
  const [customSkill, setCustomSkill] = useState("");
  const [cvFileName, setCvFileName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyProfile()
      .then((data) => {
        setForm({
          fullName: data.nombre || "",
          fechaNacimiento: data.fechaNacimiento ? data.fechaNacimiento.slice(0, 10) : "",
          pais: data.pais || "",
          telefono: data.telefono || "",
          ciudad: data.ciudad || "",
          acercaDe: data.acercaDe || "",
          carrera: data.carrera || "",
          genero: data.genero || "",
          linkedin: data.linkedin || "",
          habilidades: data.habilidades || [],
          experiencia: data.experiencia || "",
          horasPorSemana: data.horasPorSemana || "",
          disponibilidad: data.disponibilidad || [],
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await completeOnboarding(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCvFileName(file.name);
  };

  const toggleSkill = (skill: string) => {
    setForm((f) => ({
      ...f,
      habilidades: f.habilidades.includes(skill)
        ? f.habilidades.filter((s) => s !== skill)
        : [...f.habilidades, skill],
    }));
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !form.habilidades.includes(customSkill)) {
      setForm((f) => ({ ...f, habilidades: [...f.habilidades, customSkill] }));
      setCustomSkill("");
    }
  };

  const toggleAvailability = (day: string, time: string) => {
    const slot = `${day} ${time}`;
    setForm((f) => ({
      ...f,
      disponibilidad: f.disponibilidad.includes(slot)
        ? f.disponibilidad.filter((s) => s !== slot)
        : [...f.disponibilidad, slot],
    }));
  };

  const customSkills = form.habilidades.filter((s) => !AVAILABLE_SKILLS.includes(s));

  if (loading) {
    return (
      <DashboardLayout title="Settings">
        <p className="text-sm text-gray-500">Loading...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-lg space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="font-semibold mb-3">Personal information</h2>
          <div className="space-y-3">
            <TextField
              id="fullName" label="Full name" type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <TextField
              id="fechaNacimiento" label="Date of birth" type="date"
              value={form.fechaNacimiento}
              onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
            />
            <TextField
              id="telefono" label="Phone number" type="tel"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            />
            <TextField
              id="ciudad" label="City" type="text"
              value={form.ciudad}
              onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="font-semibold mb-3">Profile</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium block mb-1">About you</label>
              <textarea
                value={form.acercaDe}
                onChange={(e) => setForm({ ...form, acercaDe: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                rows={3}
                maxLength={300}
              />
            </div>
            <TextField
              id="carrera" label="Career / Field of study" type="text"
              value={form.carrera}
              onChange={(e) => setForm({ ...form, carrera: e.target.value })}
            />
            <select
              value={form.genero}
              onChange={(e) => setForm({ ...form, genero: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 w-full text-sm"
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-say">Prefer not to say</option>
            </select>
            <TextField
              id="linkedin" label="LinkedIn (optional)" type="url"
              value={form.linkedin}
              onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="font-semibold mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {AVAILABLE_SKILLS.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition ${
                  form.habilidades.includes(skill)
                    ? "bg-purple-600 text-white"
                    : "border border-purple-300 text-purple-600"
                }`}
              >
                {skill}
              </button>
            ))}
            {customSkills.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className="px-3 py-2 bg-purple-600 text-white rounded-full text-sm font-medium flex items-center gap-2"
              >
                {skill} <span>✕</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSkill())}
              placeholder="Add another skill"
              className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
            />
            <button
              type="button"
              onClick={addCustomSkill}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
            >
              Add
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="font-semibold mb-3">Experience & availability</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium block mb-1">Previous experience</label>
              <textarea
                value={form.experiencia}
                onChange={(e) => setForm({ ...form, experiencia: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                rows={3}
              />
            </div>
            <select
              value={form.horasPorSemana}
              onChange={(e) => setForm({ ...form, horasPorSemana: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm"
            >
              <option value="">Select hours per week</option>
              <option value="1-5">1-5 hours</option>
              <option value="5-10">5-10 hours</option>
              <option value="10-15">10-15 hours</option>
              <option value="15+">15+ hours</option>
            </select>

            <div className="overflow-x-auto pt-1">
              <table className="w-full text-center text-sm">
                <thead>
                  <tr>
                    <th></th>
                    {DAYS.map((day) => (
                      <th key={day} className="pb-2 text-xs font-semibold text-gray-700 px-1">
                        {day.slice(0, 3)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map((time) => (
                    <tr key={time}>
                      <td className="text-xs font-semibold text-gray-700 pr-2 text-right whitespace-nowrap">{time}</td>
                      {DAYS.map((day) => (
                        <td key={`${day}-${time}`} className="py-1 px-1">
                          <button
                            type="button"
                            onClick={() => toggleAvailability(day, time)}
                            className={`w-7 h-7 rounded-lg transition flex items-center justify-center mx-auto text-xs ${
                              form.disponibilidad.includes(`${day} ${time}`)
                                ? "bg-purple-600 text-white"
                                : "bg-gray-100 border border-gray-300 hover:bg-gray-200"
                            }`}
                          >
                            {form.disponibilidad.includes(`${day} ${time}`) && "✓"}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="font-semibold mb-3">Resume / CV</h2>
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvUpload} className="text-sm" />
          {cvFileName && <p className="text-xs text-green-600 mt-2">✓ {cvFileName} selected</p>}
          <p className="text-xs text-gray-400 mt-2">Storage coming soon.</p>
        </div>

        {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          style={{ backgroundColor: "#ec4899", color: "#ffffff" }}
          className="w-full rounded-lg py-2.5 text-sm font-semibold hover:bg-pink-600 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save changes"}
        </button>
      </div>
    </DashboardLayout>
  );
}