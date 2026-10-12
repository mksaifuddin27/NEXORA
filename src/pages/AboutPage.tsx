import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ShieldCheck,
  Server,
  Database,
  Layers,
  Sparkles,
  CheckCircle2,
  Cpu,
  ArrowRight,
  Code2,
  Lock,
  MapPin,
  Star,
  Users,
  Award,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* 1. HERO HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-indigo-300 text-xs font-semibold shadow-glow-indigo">
          <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />
          <span>Capstone Project Dossier</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          About <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-brand-secondary">NEXORA</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Smart Local Service Discovery System — An enterprise-grade, full-stack architectural solution bridging urban citizens with verified local service providers.
        </p>
      </div>

      {/* 2. ACADEMIC CREDENTIALS & AUTHOR PROFILE */}
      <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/10 blur-[90px] rounded-full pointer-events-none" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-10">
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center shadow-glow-indigo">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Project Author</h2>
              <p className="text-lg font-extrabold text-brand-secondary">Mohammed Khaja Saifuddin</p>
            </div>
            <div className="space-y-1 text-xs text-slate-400">
              <p><span className="text-slate-300 font-semibold">Roll Number:</span> 24EG105P27</p>
              <p><span className="text-slate-300 font-semibold">Branch & Section:</span> Computer Science & Engineering (CSE – P)</p>
              <p><span className="text-slate-300 font-semibold">Academic Project:</span> NEXORA — Smart Local Service Discovery System</p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300">
              Problem Statement & Technical Motivation
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Traditional local directories suffer from fragmentation, deceptive review manipulation, stale operational hours, and a lack of direct slot reservation capabilities. Citizens are forced to juggle multiple unverified websites, phone calls, and outdated listings.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              <strong className="text-white">NEXORA</strong> solves this by centralizing 5 critical urban categories (Restaurants, Hotels, Healthcare, Pharmacies, Salons) under a single verified ecosystem. It integrates mathematical Haversine distance tracking, Bayesian weighted quality rankings, pessimistic concurrency booking locks, and role-based administrative moderation.
            </p>
          </div>
        </div>
      </div>

      {/* 3. SYSTEM ARCHITECTURE & TECH STACK */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-secondary mb-2">
            Enterprise Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Dual-Tier Decoupled Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Cleanly separated presentation, application, and persistence tiers built on industry best practices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Frontend Layer */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4 hover:border-brand-primary/40 transition">
            <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Client Presentation Tier</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>React 18 & TypeScript:</strong> Type-safe component tree</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Tailwind CSS:</strong> Rich dark-mode glassmorphic theme</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Leaflet & OpenStreetMap:</strong> Zero-cost geographic map preview</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>State Contexts:</strong> Location, Auth, and Multi-Provider Compare</span>
              </li>
            </ul>
          </div>

          {/* Backend Layer */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4 hover:border-brand-primary/40 transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Application & Security Tier</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Spring Boot 3.3.5 & Java 21:</strong> High-throughput REST engine</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Spring Security 6:</strong> Stateless JWT (HS512) authentication</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Layered Architecture:</strong> Controllers, Services, Repositories, DTOs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Spring Boot Actuator:</strong> Real-time health monitoring (`/api/health`)</span>
              </li>
            </ul>
          </div>

          {/* Database Layer */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4 hover:border-brand-primary/40 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Persistence & Concurrency Tier</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>MySQL 8.0:</strong> InnoDB engine with ACID transactions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Spring Data JPA:</strong> Hibernate ORM with relational mapping</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Pessimistic Concurrency:</strong> Slot locks prevent double bookings</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Seed Data Runner:</strong> Automated demonstration data initialization</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4. KEY ALGORITHMS & DISCOVERY LOGIC */}
      <div className="glass-card rounded-3xl p-8 border border-white/10 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-brand-secondary" />
          <span>Core Algorithms & Business Rules</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-navy-950/80 border border-white/10 space-y-2">
            <h4 className="text-sm font-bold text-indigo-300">1. Haversine Geographic Distance</h4>
            <p>
              Calculates the shortest great-circle distance over the Earth's curvature between user latitude/longitude and provider coordinates:
            </p>
            <div className="p-2.5 rounded bg-navy-900 font-mono text-[11px] text-amber-300">
              a = sin²(Δlat/2) + cos(lat1)·cos(lat2)·sin²(Δlng/2)<br />
              d = 2 · R · atan2(√a, √(1-a)) [R = 6371 km]
            </div>
            <p className="text-slate-400">
              Works seamlessly with both browser GPS permissions and 8 built-in metro city presets (Hyderabad, Bengaluru, Mumbai, Delhi, Chennai, Kolkata, Pune, Ahmedabad).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-950/80 border border-white/10 space-y-2">
            <h4 className="text-sm font-bold text-indigo-300">2. Transparent Bayesian Rating Ranking</h4>
            <p>
              Prevents providers with a single 5-star review from unfairly outranking well-established businesses with hundreds of genuine ratings:
            </p>
            <div className="p-2.5 rounded bg-navy-900 font-mono text-[11px] text-amber-300">
              Weighted Score = (v / (v + m)) · R + (m / (v + m)) · C<br />
              [v = review count, m = min threshold (3), C = platform prior (4.0)]
            </div>
            <p className="text-slate-400">
              Documented, mathematically sound, and avoids deceptive marketing claims.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-950/80 border border-white/10 space-y-2">
            <h4 className="text-sm font-bold text-indigo-300">3. Pessimistic Slot Booking Lock</h4>
            <p>
              Guarantees zero overlapping appointments or overbooking even under high concurrent demand:
            </p>
            <div className="p-2.5 rounded bg-navy-900 font-mono text-[11px] text-amber-300">
              @Lock(LockModeType.PESSIMISTIC_WRITE)<br />
              Availability findByIdWithLock(Long id);
            </div>
            <p className="text-slate-400">
              Acquires a database row lock during transaction execution, validating capacity and status before issuing unique references (e.g. <code className="text-white">NEX-20261012-ABC123</code>).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-950/80 border border-white/10 space-y-2">
            <h4 className="text-sm font-bold text-indigo-300">4. Role-Based Access Control (RBAC)</h4>
            <p>
              Enforces strict least-privilege security at both HTTP endpoint and service-layer levels:
            </p>
            <ul className="space-y-1 text-slate-400">
              <li>• <strong className="text-white">USER:</strong> Profile management, own bookings, review submissions.</li>
              <li>• <strong className="text-white">OFFICER:</strong> Strictly their own provider profile, services, slots, and bookings.</li>
              <li>• <strong className="text-white">ADMIN:</strong> Platform-wide provider vetting, category controls, user moderation.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5. DEMO ACCOUNTS QUICK REFERENCE */}
      <div className="glass-card rounded-3xl p-8 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Live Demonstration Accounts</h3>
            <p className="text-xs text-slate-400">Pre-seeded accounts ready for evaluator presentation</p>
          </div>
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-primaryHover transition flex items-center gap-1.5"
          >
            <span>Go to Login</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400">CITIZEN USER</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">Active</span>
            </div>
            <p><span className="text-slate-400">Email:</span> user@nexora.org</p>
            <p><span className="text-slate-400">Password:</span> User@123</p>
            <p className="text-[11px] text-slate-500 pt-1">Explore, book slots, compare, and submit reviews.</p>
          </div>

          <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-400">SERVICE OFFICER</span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px]">Active</span>
            </div>
            <p><span className="text-slate-400">Email:</span> officer@nexora.org</p>
            <p><span className="text-slate-400">Password:</span> Officer@123</p>
            <p className="text-[11px] text-slate-500 pt-1">Manage establishment profile, services, slots, bookings.</p>
          </div>

          <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400">ADMINISTRATOR</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px]">Superuser</span>
            </div>
            <p><span className="text-slate-400">Email:</span> admin@nexora.org</p>
            <p><span className="text-slate-400">Password:</span> Admin@123</p>
            <p className="text-[11px] text-slate-500 pt-1">Verify new establishments, moderate users and categories.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
