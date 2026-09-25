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
  commitment: "Part-time" | "Full-time" | "Flexible";
  date: string;
}