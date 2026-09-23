import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";

export default function OnboardingStep3() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [experience, setExperience] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [availability, setAvailability] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const availableSkills = [
    "Communication",
    "Graphic design",
    "Social media",
    "Organization",
    "Excel",
    "Translation",
    "Photography",
    "Administration",
    "Marketing",
    "Project management",
    "Leadership",
    "Teamwork",
    "Problem solving",
    "Public speaking",
    "Event planning",
    "Content writing",
    "Video editing",
    "Web design",
    "Coding",
    "Other"
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const timeSlots = ["9am-12pm", "1pm-5pm", "6pm-9pm"];

  const toggleAvailability = (day: string, time: string) => {
    const slot = `${day} ${time}`;
    setAvailability(prev =>
      prev.includes(slot)
        ? prev.filter(s => s !== slot)
        : [...prev, slot]
    );
  };

  const isAvailable = (day: string, time: string) => {
    return availability.includes(`${day} ${time}`);
  };

  const toggleSkill = (skill: string) => {
    setSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !skills.includes(customSkill)) {
      setSkills(prev => [...prev, customSkill]);
      setCustomSkill("");
    }
  };

  const removeCustomSkill = (skill: string) => {
    if (!availableSkills.includes(skill)) {
      setSkills(prev => prev.filter(s => s !== skill));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      localStorage.setItem("onboarding-step3", JSON.stringify({
        skills,
        experience,
        hoursPerWeek,
        availability
      }));
      navigate("/Onboarding/step4");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <main className="auth-card">
        <header className="auth-heading flex flex-col items-center mb-6">
          <div className="flex justify-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm">✓</div>
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm">✓</div>
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm">3</div>
            <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm">4</div>
          </div>
          <h1 className="font-bold text-xl text-center">Availability and experience</h1>
          <p className="text-sm text-gray-600 text-center mt-2">Help us understand your availability and skills</p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form space-y-4">
          <div className="border rounded-lg p-4">
            <label className="block font-semibold mb-2">Skills</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {availableSkills.map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition ${
                    skills.includes(skill)
                      ? "bg-purple-600 text-white"
                      : "border border-purple-300 text-purple-600"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            
            {skills.includes("Other") && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <label htmlFor="customSkill" className="block text-sm font-semibold mb-2">Add custom skill</label>
                <div className="flex gap-2">
                  <input
                    id="customSkill"
                    type="text"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addCustomSkill()}
                    placeholder="Type a skill and press Add"
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
                {skills.filter(s => !availableSkills.includes(s)).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-purple-200">
                    <p className="text-xs text-gray-600 mb-2">Your custom skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {skills.filter(s => !availableSkills.includes(s)).map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => removeCustomSkill(skill)}
                          className="px-3 py-2 bg-purple-600 text-white rounded-full text-sm font-medium hover:bg-purple-700 transition flex items-center gap-2"
                        >
                          {skill}
                          <span>✕</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border rounded-lg p-4">
            <label className="block font-semibold mb-2">Previous experience</label>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Share relevant volunteer or work experience"
              className="w-full border rounded-lg p-2 text-sm"
              rows={4}
            />
          </div>

          <div className="border rounded-lg p-4">
            <label htmlFor="hoursPerWeek" className="block font-semibold mb-2">Hours available per week</label>
            <select
              id="hoursPerWeek"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
              required
            >
              <option value="">Select hours per week</option>
              <option value="1-5">1-5 hours</option>
              <option value="5-10">5-10 hours</option>
              <option value="10-15">10-15 hours</option>
              <option value="15+">15+ hours</option>
            </select>
          </div>

          <div className="border rounded-lg p-4">
            <label className="block font-semibold mb-3">Time availability</label>
            <p className="text-xs text-gray-500 mb-4">Click on the time slots when you're available</p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-center text-sm">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="pb-2 font-semibold text-gray-700"></th>
                    {days.map(day => (
                      <th key={day} className="pb-2 font-semibold text-gray-700 px-1">
                        {day.slice(0, 3)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map(time => (
                    <tr key={time} className="border-b border-gray-200">
                      <td className="py-2 font-semibold text-gray-700 pr-2 text-right">{time}</td>
                      {days.map(day => (
                        <td key={`${day}-${time}`} className="py-2 px-1">
                          <button
                            type="button"
                            onClick={() => toggleAvailability(day, time)}
                            className={`w-8 h-8 rounded-lg transition flex items-center justify-center mx-auto ${
                              isAvailable(day, time)
                                ? "bg-purple-600 text-white shadow-md"
                                : "bg-gray-100 border border-gray-300 hover:bg-gray-200"
                            }`}
                          >
                            {isAvailable(day, time) && "✓"}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate("/Onboarding/step2")}
              className="flex-1 border border-purple-600 text-purple-600 font-semibold rounded-lg py-3"
            >
              Back
            </button>
            <Button
              type="submit"
              disabled={isLoading}
              style={{ backgroundColor: '#ec4899', color: '#ffffff' }}
              className="flex-1 hover:bg-pink-600 font-semibold rounded-lg transition duration-200 py-3"
            >
              {isLoading ? "Saving..." : "Continue"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}