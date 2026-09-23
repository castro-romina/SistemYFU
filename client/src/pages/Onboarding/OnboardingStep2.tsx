import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";

export default function OnboardingStep2() {
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [aboutYou, setAboutYou] = useState("");
  const [career, setCareer] = useState("");
  const [otherCareer, setOtherCareer] = useState("");
  const [gender, setGender] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const careers = [
    "Information Technology / Computer Science",
    "Software Engineering",
    "Data Science / Data Analytics",
    "Cybersecurity",
    "Web Development",
    "Mobile Development",
    "Artificial Intelligence / Machine Learning",
    "Systems Engineering",
    "Network Engineering",
    "Database Administration",
    "Civil Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Chemical Engineering",
    "Industrial Engineering",
    "Aerospace Engineering",
    "Environmental Engineering",
    "Biomedical Engineering",
    "Agricultural Engineering",
    "Geology / Geosciences",
    "Physics",
    "Chemistry",
    "Mathematics",
    "Biology",
    "Biotechnology",
    "Microbiology",
    "Medicine",
    "Dentistry",
    "Pharmacy",
    "Nursing",
    "Healthcare Administration",
    "Public Health",
    "Psychology",
    "Social Work",
    "Sociology",
    "Anthropology",
    "Education",
    "Special Education",
    "Early Childhood Education",
    "Business Administration",
    "Finance",
    "Accounting",
    "Economics",
    "Marketing",
    "International Business",
    "Entrepreneurship",
    "Management",
    "Human Resources",
    "Operations Management",
    "Supply Chain Management",
    "Law",
    "Criminal Justice",
    "Political Science",
    "Public Administration",
    "International Relations",
    "Diplomacy",
    "Communications",
    "Journalism",
    "Media Studies",
    "Public Relations",
    "Broadcasting",
    "Arts",
    "Fine Arts",
    "Graphic Design",
    "Digital Design",
    "Interior Design",
    "Architecture",
    "Landscape Architecture",
    "Fashion Design",
    "Industrial Design",
    "Music",
    "Music Production",
    "Performance Arts",
    "Theater",
    "Dance",
    "Film and Video Production",
    "Animation",
    "Photography",
    "Culinary Arts",
    "Hospitality Management",
    "Tourism Management",
    "Sports Management",
    "Sports Science",
    "Physical Education",
    "Recreation Management",
    "Library Science",
    "Information Science",
    "Archaeology",
    "History",
    "Geography",
    "Environmental Science",
    "Sustainability",
    "Energy Engineering",
    "Renewable Energy",
    "Urban Planning",
    "Veterinary Medicine",
    "Animal Science",
    "Forestry",
    "Marine Biology",
    "Linguistics",
    "Foreign Languages",
    "Translation / Interpretation",
    "Philosophy",
    "Theology / Religious Studies",
    "Other"
  ];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPhotoError("");

    if (!file) return;

    if (file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
      setPhotoError("SVG files are not allowed for security reasons. Please use JPG or PNG.");
      setProfilePhoto(null);
      setPreviewUrl("");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("File size must be less than 5MB");
      setProfilePhoto(null);
      setPreviewUrl("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please upload an image file (JPG, PNG)");
      setProfilePhoto(null);
      setPreviewUrl("");
      return;
    }

    setProfilePhoto(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const careerToSave = career === "Other" ? otherCareer : career;
      
      localStorage.setItem("onboarding-step2", JSON.stringify({
        profilePhoto,
        aboutYou,
        career: careerToSave,
        gender,
        linkedIn
      }));
      navigate("/Onboarding/step3");
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
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm">2</div>
            <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm">3</div>
            <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm">4</div>
          </div>
          <h1 className="font-bold text-xl text-center">Profile and education</h1>
          <p className="text-sm text-gray-600 text-center mt-2">Tell us more about yourself to connect with ideal opportunities</p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form space-y-4">
          <div className="border rounded-lg p-4">
            <label className="block font-semibold mb-2">Profile photo</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-full bg-purple-200 flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-purple-300 transition overflow-hidden"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover" />
              ) : (
                <span>📸</span>
              )}
            </button>
            {profilePhoto && (
              <p className="text-sm text-green-600 text-center mb-2">✓ {profilePhoto.name}</p>
            )}
            {photoError && (
              <p className="text-sm text-red-600 text-center mb-2">{photoError}</p>
            )}
            <p className="text-xs text-gray-500 mt-2 text-center">Formats: JPG, PNG, MAX. 5MB (SVG not allowed)</p>
          </div>

          <div className="border rounded-lg p-4">
            <label className="block font-semibold mb-2">About you</label>
            <textarea
              value={aboutYou}
              onChange={(e) => setAboutYou(e.target.value)}
              placeholder="Write a brief introduction about yourself"
              className="w-full border rounded-lg p-2 text-sm"
              rows={3}
              maxLength={300}
            />
            <p className="text-xs text-gray-500 mt-1">{aboutYou.length}/300</p>
          </div>

          <div className="border rounded-lg p-4">
            <label htmlFor="career" className="block font-semibold mb-2">Career / Field of Study</label>
            <select
              id="career"
              value={career}
              onChange={(e) => setCareer(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
              required
            >
              <option value="">Select your career</option>
              {careers.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {career === "Other" && (
              <input
                type="text"
                value={otherCareer}
                onChange={(e) => setOtherCareer(e.target.value)}
                placeholder="Please specify your career"
                className="w-full border border-gray-300 rounded-lg p-3 mt-2"
                required
              />
            )}
          </div>

          <div className="border rounded-lg p-4">
            <label htmlFor="gender" className="block font-semibold mb-2">Gender</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
              required
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-say">Prefer not to say</option>
            </select>
          </div>

          <div className="border rounded-lg p-4">
            <label htmlFor="linkedin" className="block font-semibold mb-2">LinkedIn profile (optional)</label>
            <input
              id="linkedin"
              type="url"
              value={linkedIn}
              onChange={(e) => setLinkedIn(e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
            <p className="text-xs text-gray-500 mt-2">Share your LinkedIn profile to showcase your professional experience</p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate("/Onboarding")}
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