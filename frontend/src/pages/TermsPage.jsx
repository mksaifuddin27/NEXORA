import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
export const TermsPage = () => {
    return (<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition">
        <ArrowLeft className="w-4 h-4"/>
        <span>Return to Home</span>
      </Link>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-indigo-300 text-xs font-semibold">
          <FileText className="w-3.5 h-3.5 text-brand-secondary"/>
          <span>Legal Framework</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-400">
          Effective Date: Academic Year 2026 | Last Revised: October 12, 2026
        </p>
      </div>

      <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-2xl space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-secondary"/>
            <span>1. Platform Identity & Intermediary Role</span>
          </h2>
          <p>
            NEXORA is a Smart Local Service Discovery System that connects registered citizens with third-party service establishments across 5 core categories (Restaurants, Hotels, Healthcare, Pharmacies, Salons). <strong>NEXORA is a discovery and scheduling intermediary and does not directly deliver medical, culinary, lodging, or cosmetic services.</strong>
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-secondary"/>
            <span>2. User Account Obligations</span>
          </h2>
          <p>
            Users must register with legitimate credentials. Passwords are encrypted using irreversible BCrypt cryptographic hashing. Users are responsible for safeguarding authentication tokens. Public accounts are assigned standard Citizen USER privileges; unauthorized attempts to escalate role privileges are monitored and logged.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-secondary"/>
            <span>3. Service Provider Officer Responsibilities</span>
          </h2>
          <p>
            Service Provider Officers warrant that all uploaded establishment details, operational hours, medical or commercial certifications, and service prices represent genuine, active offerings. Officers may manage only their designated establishment and must honor confirmed bookings within configured capacities.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-secondary"/>
            <span>4. Slot Booking & Concurrency Protection</span>
          </h2>
          <p>
            Time slots reserved through the NEXORA booking engine are subject to real-time database locks (<code className="text-indigo-300">PESSIMISTIC_WRITE</code>) and verification against active provider capacities. Cancellation policies are enforced per business rules: bookings may be cancelled while in PENDING or CONFIRMED state.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-secondary"/>
            <span>5. Review Authenticity & Moderation</span>
          </h2>
          <p>
            Reviews and star ratings (1 to 5) must reflect genuine customer experiences. Under NEXORA integrity policies, duplicate reviews for the same completed booking are prohibited. System administrators reserve the right to audit, moderate, or remove fraudulent or abusive reviews.
          </p>
        </section>

        {/* Section 6 */}
        <div className="p-4 rounded-2xl bg-navy-950 border border-white/10 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5"/>
          <p className="text-xs text-slate-400">
            For academic demonstration purposes, demonstration accounts and demonstration providers are clearly flagged with <span className="text-indigo-300 font-semibold">[Demo]</span> tags to prevent confusion with genuine commercial entities.
          </p>
        </div>
      </div>
    </div>);
};
