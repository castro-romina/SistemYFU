import React from "react";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-gray-800 font-sans">
      {/* Link to return back to the Registration page */}
      <Link to="/register" className="text-purple-600 hover:text-purple-800 font-medium mb-8 inline-flex items-center gap-2 transition">
        ← Back to register
      </Link>
      
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="mb-8 text-sm text-gray-500">Last updated: September 2026</p>
      
      <div className="space-y-6 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-2">1. Information We Collect</h2>
          <p>To provide you with a personalized experience, we collect minimal personal data that you provide directly during registration, such as: your full name or organization name, email address, encrypted password, and the selected role (volunteer or organization).</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-2">2. How We Use Your Information</h2>
          <p>We use the collected information for the sole purpose of managing your profile, validating your login credentials, and enabling the correct matching between volunteer opportunities and available profiles.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-2">3. Protection and Confidentiality</h2>
          <p>We are committed to protecting your data using industry-standard technical security measures. Under no circumstances will MatchVol sell, rent, or share your personal information with third parties for advertising or commercial purposes.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-2">4. Your Rights</h2>
          <p>As a user, you have the right to access, rectify, update, or request the permanent deletion of your personal data from our database at any time. To exercise these rights, you may contact our technical support team.</p>
        </section>
      </div>
    </div>
  );
}
