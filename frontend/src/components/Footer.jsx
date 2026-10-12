import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, MapPin } from 'lucide-react';
export const Footer = () => {
    return (<footer className="border-t border-white/10 bg-navy-950 text-slate-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Purpose */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Compass className="w-4 h-4 text-white"/>
              </div>
              <span className="text-lg font-bold text-white tracking-wider">NEXORA</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Smart Local Service Discovery System — Connecting citizens with verified restaurants, hotels, healthcare clinics, 24/7 pharmacies, and salons across urban centers.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy-900 border border-white/10 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400"/>
                Verified Establishments
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy-900 border border-white/10 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-red-400"/>
                Google Maps Integrated
              </span>
            </div>
          </div>

          {/* Core Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Categories</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/services?category=1" className="hover:text-white transition">Restaurants & Cafes</Link>
              </li>
              <li>
                <Link to="/services?category=2" className="hover:text-white transition">Hotels & Suites</Link>
              </li>
              <li>
                <Link to="/services?category=3" className="hover:text-white transition">Healthcare & Clinics</Link>
              </li>
              <li>
                <Link to="/services?category=4" className="hover:text-white transition">24/7 Pharmacies</Link>
              </li>
              <li>
                <Link to="/services?category=5" className="hover:text-white transition">Salons & Grooming</Link>
              </li>
            </ul>
          </div>

          {/* Discovery Features */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/services" className="hover:text-white transition">Explore Services</Link>
              </li>
              <li>
                <Link to="/services?mode=nearby" className="hover:text-white transition">Nearby Services</Link>
              </li>
              <li>
                <Link to="/services?mode=best-overall" className="hover:text-white transition">Top Rated</Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-white transition">My Bookings</Link>
              </li>
              <li>
                <Link to="/officer" className="hover:text-white transition">Officer Portal</Link>
              </li>
            </ul>
          </div>

          {/* Academic / Project Credits */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Project Dossier</h4>
            <div className="p-3 rounded-xl bg-navy-900 border border-white/10 text-xs space-y-1 text-slate-300">
              <p className="font-semibold text-white">Capstone Project</p>
              <p><span className="text-slate-400">Author:</span> Mohammed Khaja Saifuddin</p>
              <p><span className="text-slate-400">Roll No:</span> 24EG105P27</p>
              <p><span className="text-slate-400">Branch:</span> CSE – P</p>
              <div className="pt-2 border-t border-white/10">
                <Link to="/about" className="text-indigo-400 hover:text-indigo-300 font-semibold text-[11px] block">
                  View Full Academic Dossier →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NEXORA. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/about" className="hover:text-slate-300 transition">About</Link>
            <Link to="/contact" className="hover:text-slate-300 transition">Contact & FAQ</Link>
            <Link to="/terms" className="hover:text-slate-300 transition">Terms</Link>
            <Link to="/privacy" className="hover:text-slate-300 transition">Privacy</Link>
            <Link to="/api-docs" className="hover:text-slate-300 transition">API Docs</Link>
          </div>
        </div>
      </div>
    </footer>);
};
