import { Link } from "react-router-dom";
import {
  CheckSquare,
  Building2,
  UserRound,
  Clock,
  Users,
  BarChart3,
  Calendar,
  Sparkles,
  Smartphone,
  UserPlus,
  ListChecks,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";

import "./Landing.css";
const steps = [
  {
    icon: UserPlus,
    title: "Create your profile",
    desc: "Tell us about yourself, your skills and interests.",
  },
  {
    icon: ListChecks,
    title: "Match a task",
    desc: "We find the best matches for you.",
  },
  {
    icon: CheckCircle2,
    title: "Choose and accept",
    desc: "Review the opportunities and join the ones you like.",
  },
  {
    icon: Lightbulb,
    title: "Make a real impact",
    desc: "Participate, collaborate, and help change the world.",
  },
];

const stats = [
  { icon: Users, label: "Active volunteers", value: "500+" },
  { icon: Building2, label: "Organizations", value: "120+" },
  { icon: ListChecks, label: "Tasks completed", value: "1,200+" },
  { icon: Sparkles, label: "Countries connected", value: "15+" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#fcfaff] text-[var(--color-text)]">
      {/* Navbar */}
      <header className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <img src="/logofinal.png" alt="MatchVol" width="40" height="40" className="rounded" />
          <span className="font-display font-bold text-xl">
            <span className="text-purple-600">Match</span>
            <span className="text-pink-500">Vol</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#4B4560]">
          <a href="#home" className="text-purple-600">Home</a>
          <a href="#how-it-works" className="hover:text-purple-600">How it works</a>
          <a href="#ngos" className="hover:text-purple-600">For NGOs</a>
          <a href="#volunteers" className="hover:text-purple-600">For Volunteers</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden sm:inline-block px-5 py-2 rounded-lg border border-purple-300 text-purple-700 text-sm font-semibold hover:bg-purple-50 transition"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 rounded-lg bg-pink-500 text-white text-sm font-semibold hover:bg-pink-600 transition"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="max-w-7xl mx-auto px-6 pt-10 pb-16 grid md:grid-cols-2 gap-5 items-center">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold leading-tight">
            The perfect match between{" "}
            <span className="text-purple-600">people</span> and{" "}
            <span className="text-pink-500">opportunities</span>
          </h1>
          <p className="mt-5 text-[#4B4560] text-lg max-w-md">
            MatchVol connects organizations with volunteers based on their
            skills, interests, and availability — to create real impact.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 mb-8">
            <Link
              to="/register"
              className="px-6 py-3 rounded-lg bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
            >
              Get Started
            </Link>
            <a
              href="#how-it-works"
              className="px-6 py-3 rounded-lg border border-purple-300 text-purple-700 font-semibold hover:bg-purple-50 transition"
            >
              See how it works
            </a>
          </div>
        </div>

        {/* Hero image on the right */}
        <div className="relative w-full max-w-md mx-auto">
          <img src="/img_landing/principal.png" alt="Volunteers" className="w-full rounded-2xl" />
        </div>
      </section>

      {/* Feature strip */}
      <section className="max-w-6xl mx-auto px-6 py-6">
        <div className="bg-purple-50 rounded-3xl px-8 py-8 flex flex-col sm:flex-row items-center sm:divide-x divide-gray-300">
          <div className="flex gap-6 flex-1 pb-8 sm:pb-0 sm:pr-8">
            <svg width="70" height="70" viewBox="0 0 70 70" className="shrink-0">
              <circle cx="35" cy="35" r="32" fill="none" stroke="#7C3AED" strokeWidth="3"/>
              <circle cx="35" cy="12" r="6" fill="#7C3AED"/>
              <circle cx="58" cy="22" r="6" fill="#7C3AED"/>
              <circle cx="58" cy="48" r="6" fill="#7C3AED"/>
              <circle cx="35" cy="58" r="6" fill="#7C3AED"/>
              <circle cx="12" cy="48" r="6" fill="#7C3AED"/>
              <circle cx="12" cy="22" r="6" fill="#7C3AED"/>
              <line x1="35" y1="35" x2="35" y2="12" stroke="#7C3AED" strokeWidth="2"/>
              <line x1="35" y1="35" x2="58" y2="22" stroke="#7C3AED" strokeWidth="2"/>
              <line x1="35" y1="35" x2="58" y2="48" stroke="#7C3AED" strokeWidth="2"/>
              <line x1="35" y1="35" x2="35" y2="58" stroke="#7C3AED" strokeWidth="2"/>
              <line x1="35" y1="35" x2="12" y2="48" stroke="#7C3AED" strokeWidth="2"/>
              <line x1="35" y1="35" x2="12" y2="22" stroke="#7C3AED" strokeWidth="2"/>
              <circle cx="35" cy="35" r="5" fill="#7C3AED"/>
            </svg>
            <div>
              <h3 className="font-display font-bold text-black">Automation</h3>
              <p className="text-sm text-black mt-1">
                Automatically find the ideal volunteers for every task.
              </p>
            </div>
          </div>
          
          <div className="flex gap-6 flex-1 pb-8 sm:pb-0 sm:px-8">
            <svg width="70" height="70" viewBox="0 0 70 70" className="shrink-0">
              <circle cx="35" cy="35" r="28" fill="#7C3AED" opacity="0.2"/>
              <g fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="35" cy="35" r="22"/>
                <path d="M 35 25 L 35 35 L 44 44"/>
              </g>
              <g fill="#EC4899">
                <path d="M 48 20 L 52 16 L 56 20 L 52 24 Z"/>
              </g>
            </svg>
            <div>
              <h3 className="font-display font-bold text-black">Efficient Matching</h3>
              <p className="text-sm text-black mt-1">
                Save time and organize your team intelligently.
              </p>
            </div>
          </div>
          
          <div className="flex gap-6 flex-1 sm:pl-8">
            <svg width="70" height="70" viewBox="0 0 70 70" className="shrink-0">
              <defs>
                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED"/>
                  <stop offset="100%" stopColor="#EC4899"/>
                </linearGradient>
              </defs>
              <path d="M 35 58 C 35 58 15 42 15 30 C 15 22 20 16 25 16 C 28 16 31 18 35 21 C 39 18 42 16 45 16 C 50 16 55 22 55 30 C 55 42 35 58 35 58 Z" 
                    fill="url(#heartGradient)" 
                    stroke="#7C3AED" 
                    strokeWidth="1.5"/>
            </svg>
            <div>
              <h3 className="font-display font-bold text-black">Greater Social Impact</h3>
              <p className="text-sm text-black mt-1">
                Our purpose is to help you make the biggest difference possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Audience cards */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8">
        <div id="ngos" className="rounded-3xl p-12" style={{ backgroundColor: "#f4f2f7" }}>
          <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center mb-6">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-display text-2xl font-bold text-purple-700 mb-3">
            For Organizations
          </h3>
          <p className="text-gray-700 mb-6">
            Manage your volunteers and tasks simply and effectively.
          </p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-gray-700">
              <Clock className="w-5 h-5 text-purple-600" />
              Improve volunteer management
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <Users className="w-5 h-5 text-purple-600" />
              Find qualified profiles
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Track and measure results
            </li>
          </ul>
          <Link
            to="/register?role=ngo"
            className="inline-block px-8 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
          >
            I'm an NGO
          </Link>
        </div>

        <div id="volunteers" className="rounded-3xl p-12" style={{ backgroundColor: "#fae5f3" }}>
          <div className="w-16 h-16 rounded-full bg-pink-500 flex items-center justify-center mb-6">
            <UserRound className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-display text-2xl font-bold text-pink-600 mb-3">
            For Volunteers
          </h3>
          <p className="text-gray-700 mb-6">
            Find opportunities that fit your interests and availability.
          </p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-gray-700">
              <Calendar className="w-5 h-5 text-pink-500" />
              Flexible scheduling
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <ListChecks className="w-5 h-5 text-pink-500" />
              Projects matched to your profile
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <Smartphone className="w-5 h-5 text-pink-500" />
              Grow personally and professionally
            </li>
          </ul>
          <Link
            to="/register?role=volunteer"
            className="inline-block px-8 py-3 rounded-lg bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
          >
            I Want to Volunteer
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="font-display text-3xl font-bold text-center mb-12">
          How It Works
        </h2>
        <div className="grid sm:grid-cols-4 gap-8 relative">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex flex-col items-center text-center relative">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center relative">
                  <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  <Icon className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="font-display font-bold mt-4">{step.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-8 left-[60%] w-full border-t-2 border-dotted border-purple-300" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats bar */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-purple-700 rounded-3xl px-8 py-8 grid sm:grid-cols-4 gap-6 text-white">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-display font-bold text-lg leading-none">
                    {stat.value}
                  </div>
                  <div className="text-xs text-purple-100 mt-1">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer*/}
      <div style={{ backgroundColor: "#ebd7f7" }} className="w-full py-10 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1.1fr_1.1fr_0.8fr] gap-8 items-center min-h-[160px]">

          <div className="text-left z-10">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-purple-950 leading-tight">
              Join the community <br />
              that <span className="text-pink-500">transforms</span>
            </h2>
            <p className="text-purple-900 mt-2 text-sm max-w-sm">
              Whether you're an organization or a volunteer, your next match can make a difference.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center text-center z-10">
            <div className="flex items-center gap-3">
              <img 
                src="/logofinal.png" 
                alt="MatchVol Icon" 
                width="50" 
                height="50" 
                className="w-15 h-15 object-contain" 
              />
              
              <span className="font-display font-bold text-3xl ">
                <span className="text-purple-600">Match</span>
                <span className="text-pink-500">Vol</span>
              </span>
            </div>
            
            {/* Subtexto del logo */}
            <p className="text-[10px] font-bold tracking-widest text-purple-800 mt-2 uppercase">
              CONNECT &bull; CONTRIBUTE &bull; TRANSFORM
            </p>
            
            {/* Líneas de colores decorativas inferiores */}
            <div className="flex gap-1 w-36 h-2 mt-3">
              <div className="flex-1 bg-purple-700"></div>
              <div className="flex-1 bg-pink-500"></div>
              <div className="flex-1 bg-white border border-purple-300"></div>
              <div className="flex-1 bg-gray-900"></div>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-1/3 pointer-events-none hidden md:block">
            
            {/* Círculo/Ovalo punteado de fondo */}
            <div className="absolute right-24 bottom-6 w-24 h-24 border-2 border-dashed border-gray-900 rounded-full opacity-40"></div>
            
            {/* Óvalo / Forma Rosa (Base inferior) */}
            <div className="absolute -right-8 -bottom-10 w-44 h-28 bg-pink-500 rounded-full rotate-[12deg]"></div>
            
            {/* Óvalo / Forma Morada (Encima de la rosa, cortando la esquina) */}
            <div className="absolute -right-6 -top-6 w-36 h-48 bg-purple-700 rounded-full -rotate-[25deg]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}