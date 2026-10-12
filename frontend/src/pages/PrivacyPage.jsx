import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Lock, Eye, Database, CheckCircle2 } from 'lucide-react';
export const PrivacyPage = () => {
    return (<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition">
        <ArrowLeft className="w-4 h-4"/>
        <span>Return to Home</span>
      </Link>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-indigo-300 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5 text-brand-secondary"/>
          <span>Data Governance & Privacy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400">
          Commitment to user data security and location privacy | Updated October 2026
        </p>
      </div>

      <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-2xl space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400"/>
            <span>1. Information Collection & Storage</span>
          </h2>
          <p>
            NEXORA collects only essential profile information necessary to provide account services: your full name, unique email address, and encrypted password hash. Passwords are never saved in plain text or logged in server telemetry.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-brand-secondary"/>
            <span>2. Geolocation Privacy Standards</span>
          </h2>
          <p>
            NEXORA requests browser geolocation permissions strictly with explicit user consent. <strong>Your device GPS coordinates are processed transiently in your local browser runtime to execute the Haversine distance formula against verified providers.</strong> We do not store persistent location tracking breadcrumbs or sell citizen movements to third parties.
          </p>
          <p className="text-slate-400">
            Citizens may opt out of device geolocation at any time by selecting a city preset (e.g., Hyderabad, Bengaluru, Mumbai) from the location dropdown menu.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400"/>
            <span>3. Token Security & Session Handling</span>
          </h2>
          <p>
            Sessions are authorized using JSON Web Tokens (JJWT) signed with HMAC-SHA512. Authentication tokens carry the minimal required identity claims (user ID, email, role) and are transmitted over standard Bearer Authorization headers.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-secondary"/>
            <span>4. Third-Party Maps Integration</span>
          </h2>
          <p>
            Map views leverage OpenStreetMap cartography via Leaflet libraries. Tile rendering queries are made directly to public cartographic nodes without transmitting identifiable user credentials.
          </p>
        </section>
      </div>
    </div>);
};
