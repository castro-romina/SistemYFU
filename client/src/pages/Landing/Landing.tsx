import { Link } from "react-router-dom";
import {
  CheckSquare,
  Settings,
  Share2,
  Heart,
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
    <div className="min-h-screen bg-[var(--color-page-bg)] text-[var(--color-text)]">
      {/* Navbar */}
      <header className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <img src="/public/matchVol.jpeg" alt="MatchVol" width="40" height="40" className="rounded-lg" />
          <span className="font-display font-bold text-xl">MatchVol</span>
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
            className="hidden sm:inline-block px-5 py-2 rounded-full border border-purple-300 text-purple-700 text-sm font-semibold hover:bg-purple-50 transition"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 rounded-full bg-pink-500 text-white text-sm font-semibold hover:bg-pink-600 transition"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="max-w-7xl mx-auto px-6 pt-10 pb-16 grid md:grid-cols-2 gap-12 items-center">
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
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="px-6 py-3 rounded-full bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
            >
              Get Started
            </Link>
            <a
              href="#how-it-works"
              className="px-6 py-3 rounded-full border border-purple-300 text-purple-700 font-semibold hover:bg-purple-50 transition"
            >
              See how it works
            </a>
          </div>
        </div>

        {/* Decorative circle graphic (no stock photo, built with icons) */}
        <div className="relative w-full aspect-square max-w-md mx-auto">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-200 via-purple-100 to-pink-100" />
          <div className="absolute inset-6 rounded-full border-2 border-dashed border-purple-300" />
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const radius = 42; // percent
            const top = 50 - radius * Math.cos(rad);
            const left = 50 + radius * Math.sin(rad);
            const colors = [
              "bg-purple-600",
              "bg-pink-500",
              "bg-purple-400",
              "bg-pink-400",
              "bg-purple-500",
              "bg-pink-300",
            ];
            return (
              <div
                key={i}
                className={`hero-orbit-avatar ${colors[i]}`}
                style={{ top: `${top}%`, left: `${left}%`, transform: "translate(-50%, -50%)" }}
              >
                <Users className="w-5 h-5 text-white" />
              </div>
            );
          })}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="hero-badge">
              <CheckSquare className="w-10 h-10 text-purple-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="bg-purple-50 rounded-3xl px-8 py-8 grid sm:grid-cols-3 gap-8 sm:divide-x divide-purple-200">
          <div className="flex gap-4">
            <Settings className="w-9 h-9 text-purple-600 shrink-0" />
            <div>
              <h3 className="font-display font-bold">Automation</h3>
              <p className="text-sm text-[#4B4560] mt-1">
                Automatically find the ideal volunteers for every task.
              </p>
            </div>
          </div>
          <div className="flex gap-4 sm:pl-8">
            <Share2 className="w-9 h-9 text-purple-600 shrink-0" />
            <div>
              <h3 className="font-display font-bold">Efficient Matching</h3>
              <p className="text-sm text-[#4B4560] mt-1">
                Save time and organize your team intelligently.
              </p>
            </div>
          </div>
          <div className="flex gap-4 sm:pl-8">
            <Heart className="w-9 h-9 text-pink-500 shrink-0" />
            <div>
              <h3 className="font-display font-bold">Greater Social Impact</h3>
              <p className="text-sm text-[#4B4560] mt-1">
                Our purpose is to help you make the biggest difference possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Audience cards */}
      <section className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-6">
        <div id="ngos" className="bg-purple-100 rounded-3xl p-8">
          <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center mb-4">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h3 className="font-display text-xl font-bold text-purple-800">
            For Organizations
          </h3>
          <p className="text-[#4B4560] mt-2">
            Manage your volunteers and tasks simply and effectively.
          </p>
          <ul className="mt-5 space-y-3">
            <li className="flex items-center gap-3 text-sm">
              <Clock className="w-5 h-5 text-purple-600" />
              Improve volunteer management
            </li>
            <li className="flex items-center gap-3 text-sm">
              <Users className="w-5 h-5 text-purple-600" />
              Find qualified profiles
            </li>
            <li className="flex items-center gap-3 text-sm">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Track and measure results
            </li>
          </ul>
          <Link
            to="/register?role=ngo"
            className="inline-block mt-6 px-6 py-3 rounded-full bg-purple-700 text-white font-semibold hover:bg-purple-800 transition"
          >
            I'm an NGO
          </Link>
        </div>

        <div id="volunteers" className="bg-pink-50 rounded-3xl p-8">
          <div className="w-14 h-14 rounded-full bg-pink-500 flex items-center justify-center mb-4">
            <UserRound className="w-7 h-7 text-white" />
          </div>
          <h3 className="font-display text-xl font-bold text-pink-600">
            For Volunteers
          </h3>
          <p className="text-[var(--color-text-muted)]mt-2">
            Find opportunities that fit your interests and availability.
          </p>
          <ul className="mt-5 space-y-3">
            <li className="flex items-center gap-3 text-sm">
              <Calendar className="w-5 h-5 text-pink-500" />
              Flexible scheduling
            </li>
            <li className="flex items-center gap-3 text-sm">
              <ListChecks className="w-5 h-5 text-pink-500" />
              Projects matched to your profile
            </li>
            <li className="flex items-center gap-3 text-sm">
              <Smartphone className="w-5 h-5 text-pink-500" />
              Grow personally and professionally
            </li>
          </ul>
          <Link
            to="/register?role=volunteer"
            className="inline-block mt-6 px-6 py-3 rounded-full bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
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

      {/* Footer CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold">
          Join the community that{" "}
          <span className="text-pink-500">transforms</span>
        </h2>
        <p className="text-[var(--color-text-muted)] mt-3 max-w-lg mx-auto">
          Whether you're an organization or a volunteer, your next match can
          make a difference.
        </p>
        <div className="flex items-center justify-center gap-2 mt-8">
          <CheckSquare className="w-6 h-6 text-purple-600" />
          <span className="font-display font-bold text-lg">MatchVol</span>
        </div>
        <p className="text-xs tracking-widest text-[var(--color-text-faint)] mt-1">
          CONNECT &bull; CONTRIBUTE &bull; TRANSFORM
        </p>
      </section>
    </div>
  );
}