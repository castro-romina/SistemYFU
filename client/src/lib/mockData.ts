export const SKILLS_OPTIONS = [
  "Communication", "Graphic design", "Social media", "Organization",
  "Translation", "Photography", "Administration", "Marketing",
  "Leadership", "Teamwork", "Event planning", "Coding", "Animal care",
];

export const AREAS_OPTIONS = [
  "Animal rescue", "Education", "Health", "Environment", "Food and hunger",
  "Housing", "Human rights", "Children and youth", "Elderly care",
  "Culture and arts", "Sports", "Disaster relief",
];

export interface Opportunity {
  id: string;
  orgName: string;
  title: string;
  description: string;
  location: string;
  areaTrabajo: string;
  ageMin: number;
  ageMax: number;
  experienceRequired: boolean;
  skillsRequired: string[];
  date: string;
}

export interface Applicant {
  id: string;
  name: string;
  city: string;
  age: number;
  skills: string[];
}

export interface VolunteerQuickProfile {
  city: string;
  age: number;
  skills: string[];
}

const SEED_OPPORTUNITIES: Opportunity[] = [
  {
    id: "op1",
    orgName: "Fundación Patitas",
    title: "Volunteer dog walker",
    description: "Help walk and socialize rescued dogs at our shelter on weekends.",
    location: "Buenos Aires",
    areaTrabajo: "Animal rescue",
    ageMin: 18,
    ageMax: 60,
    experienceRequired: false,
    skillsRequired: ["Animal care", "Teamwork"],
    date: "2026-10-05",
  },
  {
    id: "op2",
    orgName: "Educar Futuro",
    title: "Reading tutor for kids",
    description: "Support children aged 8-12 with reading comprehension, twice a week.",
    location: "Buenos Aires",
    areaTrabajo: "Education",
    ageMin: 18,
    ageMax: 45,
    experienceRequired: true,
    skillsRequired: ["Communication", "Organization"],
    date: "2026-10-10",
  },
  {
    id: "op3",
    orgName: "Verde Vivo",
    title: "Community garden coordinator",
    description: "Coordinate volunteers planting and maintaining a community garden.",
    location: "Córdoba",
    areaTrabajo: "Environment",
    ageMin: 20,
    ageMax: 55,
    experienceRequired: false,
    skillsRequired: ["Leadership", "Event planning"],
    date: "2026-10-15",
  },
  {
    id: "op4",
    orgName: "Voces Unidas",
    title: "Social media volunteer",
    description: "Manage our Instagram account and design promotional graphics.",
    location: "Remote",
    areaTrabajo: "Human rights",
    ageMin: 18,
    ageMax: 65,
    experienceRequired: false,
    skillsRequired: ["Social media", "Graphic design"],
    date: "2026-10-20",
  },
];

const SEED_APPLICANTS: Applicant[] = [
  { id: "a1", name: "Lucía Fernández", city: "Buenos Aires", age: 24, skills: ["Animal care", "Teamwork"] },
  { id: "a2", name: "Martín Gómez", city: "Córdoba", age: 31, skills: ["Leadership", "Communication"] },
  { id: "a3", name: "Sofía Ramírez", city: "Buenos Aires", age: 22, skills: ["Social media", "Graphic design"] },
];

const OPP_KEY = "demo-org-opportunities";
const APPLICATIONS_KEY = "demo-volunteer-applications";
const PROFILE_KEY = "demo-volunteer-profile";

export function getOpportunities(): Opportunity[] {
  const stored = localStorage.getItem(OPP_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(OPP_KEY, JSON.stringify(SEED_OPPORTUNITIES));
  return SEED_OPPORTUNITIES;
}

export function saveOpportunities(opps: Opportunity[]) {
  localStorage.setItem(OPP_KEY, JSON.stringify(opps));
}

export function getApplicants(): Applicant[] {
  return SEED_APPLICANTS;
}

export function getMyApplications(): string[] {
  return JSON.parse(localStorage.getItem(APPLICATIONS_KEY) || "[]");
}

export function applyToOpportunity(id: string) {
  const current = getMyApplications();
  if (!current.includes(id)) {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify([...current, id]));
  }
}

export function getQuickProfile(): VolunteerQuickProfile {
  const stored = localStorage.getItem(PROFILE_KEY);
  return stored ? JSON.parse(stored) : { city: "", age: 25, skills: [] };
}

export function saveQuickProfile(profile: VolunteerQuickProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

// Heurística simple de matching para la demo (0-100%)
export function calculateMatch(
  profile: { city: string; age: number; skills: string[] },
  opp: { location: string; ageMin: number; ageMax: number; skillsRequired: string[] }
): number {
  let score = 0;
  const maxScore = 100;

  // Ubicación: 35 pts
  if (opp.location === "Remote" || profile.city.toLowerCase() === opp.location.toLowerCase()) {
    score += 35;
  }

  // Edad: 25 pts
  if (profile.age >= opp.ageMin && profile.age <= opp.ageMax) {
    score += 25;
  }

  // Habilidades: 40 pts, proporcional a la intersección
  if (opp.skillsRequired.length > 0) {
    const matched = opp.skillsRequired.filter((s) => profile.skills.includes(s)).length;
    score += Math.round((matched / opp.skillsRequired.length) * 40);
  } else {
    score += 40;
  }

  return Math.min(score, maxScore);
}