import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getMyProfile, completeOnboarding } from "../../lib/api";

const AVAILABLE_SKILLS = [
  "Communication", "Graphic design", "Social media", "Organization", "Excel",
  "Translation", "Photography", "Administration", "Marketing", "Project management",
  "Leadership", "Teamwork", "Problem solving", "Public speaking", "Event planning",
  "Content writing", "Video editing", "Web design", "Coding",
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIME_SLOTS = ["9am-12pm", "1pm-5pm", "6pm-9pm"];

// ---- Shared field components (match the lavender-fill design) ----

function Field({
  label, id, type = "text", value, onChange,
}: {
  label: string; id: string; type?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-gray-900 mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg bg-indigo-50 border-0 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
      />
    </div>
  );
}

function TextAreaField({
  label, value, onChange, rows = 3, maxLength,
}: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number; maxLength?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-900 mb-2">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        maxLength={maxLength}
        className="w-full rounded-lg bg-indigo-50 border-0 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
      />
    </div>
  );
}

function SelectField({
  label, value, onChange, children,
}: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-900 mb-2">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
        >
          {children}
        </select>
        <svg
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

// ---- Main page ----

export default function Settings() {
  const [form, setForm] = useState({
    fullName: "", fechaNacimiento: "", pais: "", telefono: "", ciudad: "",
    acercaDe: "", carrera: "", genero: "", linkedin: "",
    habilidades: [] as string[], experiencia: "", horasPorSemana: "",
    disponibilidad: [] as string[], photoUrl: "", role: "", memberSince: "",
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
          photoUrl: data.fotoPerfil || "",
          role: data.role || "Volunteer",
          memberSince: data.createdAt ? new Date(data.createdAt).getFullYear().toString() : "",
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setForm((f) => ({ ...f, photoUrl: url }));
      // TODO: upload to storage and set the returned URL on save
    }
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
      <div className="max-w-4xl mx-auto space-y-6 pb-10">
        {/* Profile header */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <img
              src={form.photoUrl || "/avatar-default.png"}
              alt="Profile photo"
              className="w-16 h-16 rounded-xl object-cover bg-gray-200"
            />
            <div>
              <h2 className="font-semibold text-gray-900">{form.fullName || "No name"}</h2>
              <p className="text-xs text-gray-500">
                {form.role}{form.memberSince && ` · Member since ${form.memberSince}`}
              </p>
              <label className="text-xs font-semibold text-purple-600 mt-1 inline-block cursor-pointer">
                Change profile photo
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Personal information */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Personal information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <Field
              id="fullName" label="Full name" type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <Field
              id="fechaNacimiento" label="Date of birth" type="date"
              value={form.fechaNacimiento}
              onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
            />
            <Field
              id="telefono" label="Phone number" type="tel"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            />
            <Field
              id="ciudad" label="City" type="text"
              value={form.ciudad}
              onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
            />
          </div>
        </div>

        {/* Profile */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Profile</h2>
          <div className="space-y-5">
            <TextAreaField
              label="About you"
              value={form.acercaDe}
              onChange={(e) => setForm({ ...form, acercaDe: e.target.value })}
              rows={3}
              maxLength={300}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <Field
                id="carrera" label="Career / Field of study" type="text"
                value={form.carrera}
                onChange={(e) => setForm({ ...form, carrera: e.target.value })}
              />
              <SelectField
                label="Gender"
                value={form.genero}
                onChange={(e) => setForm({ ...form, genero: e.target.value })}
              >
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-say">Prefer not to say</option>
              </SelectField>
            </div>
            <Field
              id="linkedin" label="LinkedIn (optional)" type="url"
              value={form.linkedin}
              onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
            />
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Skills</h2>
          <div className="flex flex-wrap gap-2 mb-4">
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
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSkill())}
              placeholder="Add another skill"
              className="flex-1 rounded-lg bg-indigo-50 border-0 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
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

        {/* Experience & availability */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Experience & availability</h2>
          <div className="space-y-5">
            <TextAreaField
              label="Previous experience"
              value={form.experiencia}
              onChange={(e) => setForm({ ...form, experiencia: e.target.value })}
              rows={3}
            />
            <div className="max-w-xs">
              <SelectField
                label="Hours per week"
                value={form.horasPorSemana}
                onChange={(e) => setForm({ ...form, horasPorSemana: e.target.value })}
              >
                <option value="">Select hours per week</option>
                <option value="1-5">1-5 hours</option>
                <option value="5-10">5-10 hours</option>
                <option value="10-15">10-15 hours</option>
                <option value="15+">15+ hours</option>
              </SelectField>
            </div>

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
                            className={`w-8 h-8 rounded-lg transition flex items-center justify-center mx-auto text-xs ${
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

        {/* Resume / CV */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Resume / CV</h2>
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvUpload} className="text-sm" />
          {cvFileName && <p className="text-xs text-green-600 mt-2">✓ {cvFileName} selected</p>}
          <p className="text-xs text-gray-400 mt-2">Storage coming soon.</p>
        </div>

        {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          style={{ backgroundColor: "#ec4899", color: "#ffffff" }}
          className="w-full sm:w-auto sm:px-10 rounded-lg py-2.5 text-sm font-semibold hover:bg-pink-600 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save changes"}
        </button>
      </div>
    </DashboardLayout>
  );
}