import React from "react";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-gray-800 font-sans">
      {/* Link to return back to the Registration page */}
      <Link to="/register" className="text-purple-600 hover:text-purple-800 font-medium mb-8 inline-flex items-center gap-2 transition">
        ← Back to register
      </Link>
      
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Terms and Conditions of Use</h1>
      <p className="mb-8 text-sm text-gray-500">Last updated: September 2026</p>
      
      <div className="space-y-6 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-2">1. Purpose of the Platform</h2>
          <p>MatchVol is a technological platform designed exclusively to connect individuals interested in volunteering with non-profit organizations, foundations, and community social projects.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-2">2. Registration and Account Security</h2>
          <p>By creating an account on MatchVol, you agree to provide truthful, accurate, and up-to-date information. You are solely responsible for maintaining the confidentiality of your password and for all activities that occur under your profile.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-2">3. Code of Conduct</h2>
          <p>Both volunteers and organizations agree to interact within a framework of mutual respect, tolerance, and honesty. Using the platform for commercial, lucrative purposes, or distributing inappropriate or discriminatory content is strictly prohibited.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-2">4. Limitation of Liability</h2>
          <p>MatchVol acts solely as a communication bridge between parties. We are not responsible for internal agreements, the development of in-person or virtual activities, or the individual behavior of users during their volunteer service.</p>
        </section>
      </div>
    </div>
  );
}
