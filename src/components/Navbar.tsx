import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  MapPin,
  CalendarCheck,
  User as UserIcon,
  ShieldAlert,
  Briefcase,
  LogOut,
  Menu,
  X,
  Layers,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation as useAppLocation } from '../context/LocationContext';
import { POPULAR_CITIES } from '../utils/geo';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const { user, role, isAuthenticated, logout, switchDemoRole } = useAuth();
  const { userLocation, requestCurrentLocation, selectCityPreset, isLoading: isLocLoading } = useAppLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locDropdownOpen, setLocDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const routerLocation = useLocation();
  const navigate = useNavigate();

  const handleRoleSelect = (newRole: UserRole) => {
    switchDemoRole(newRole);
    setRoleDropdownOpen(false);
    if (newRole === 'OFFICER') {
      navigate('/officer');
    } else if (newRole === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-navy-950/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-primary via-indigo-500 to-brand-secondary flex items-center justify-center shadow-glow-indigo transition-transform group-hover:scale-105">
            <Compass className="w-6 h-6 text-white stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
                NEXORA
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded">
                PRO
              </span>
            </div>
            <span className="text-[10px] tracking-wider text-slate-400 font-medium hidden sm:block">
              SMART LOCAL DISCOVERY
            </span>
          </div>
        </Link>

        {/* Location Picker Pill */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setLocDropdownOpen(!locDropdownOpen)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-850/80 border border-white/10 text-xs font-medium text-slate-200 hover:border-brand-primary/50 hover:bg-navy-800 transition"
          >
            <MapPin className={`w-3.5 h-3.5 ${userLocation?.source === 'gps' ? 'text-emerald-400' : 'text-brand-secondary'}`} />
            <span className="max-w-[150px] truncate">
              {userLocation?.cityName || 'Set Location'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {locDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 p-3 bg-navy-900 border border-white/15 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="text-xs font-semibold text-slate-400 mb-2 px-1">
                CHOOSE DISCOVERY AREA
              </div>
              <button
                onClick={() => {
                  requestCurrentLocation();
                  setLocDropdownOpen(false);
                }}
                disabled={isLocLoading}
                className="w-full mb-3 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 text-white text-xs font-semibold hover:opacity-95 transition shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5" />
                {isLocLoading ? 'Locating device...' : 'Use My GPS Location'}
              </button>

              <div className="text-[11px] font-medium text-slate-400 mb-1 px-1">
                Popular Metro Hubs:
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {POPULAR_CITIES.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => {
                      selectCityPreset(city);
                      setLocDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                      userLocation?.cityName === city.name
                        ? 'bg-brand-primary/20 text-brand-secondary font-semibold'
                        : 'text-slate-300 hover:bg-navy-800'
                    }`}
                  >
                    <span>{city.name}</span>
                    <span className="text-[10px] text-slate-500">{city.state}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <Link
            to="/services"
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition ${
              routerLocation.pathname === '/services'
                ? 'text-white bg-white/10'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Explore Services
          </Link>
          <Link
            to="/services?mode=nearby"
            className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-brand-secondary" />
            Nearby
          </Link>
          <Link
            to="/services?mode=best-overall"
            className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Top Rated
          </Link>

          <Link
            to="/about"
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition ${
              routerLocation.pathname === '/about'
                ? 'text-white bg-white/10'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition ${
              routerLocation.pathname === '/contact'
                ? 'text-white bg-white/10'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Help & FAQ
          </Link>

          {isAuthenticated && (
            <Link
              to="/my-bookings"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
                routerLocation.pathname === '/my-bookings'
                  ? 'text-white bg-white/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-indigo-400" />
              My Bookings
            </Link>
          )}

          {/* Role specific portals */}
          {role === 'OFFICER' && (
            <Link
              to="/officer"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 transition flex items-center gap-1"
            >
              <Briefcase className="w-3.5 h-3.5" />
              Officer Portal
            </Link>
          )}
          {role === 'ADMIN' && (
            <Link
              to="/admin"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition flex items-center gap-1"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Admin Console
            </Link>
          )}
        </nav>

        {/* Right Action & Demo Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Role Switcher (Crucial for evaluation/demonstrations) */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-navy-850 border border-brand-primary/30 text-xs font-medium text-indigo-300 hover:border-brand-primary transition"
              title="Switch demo role to test different portals"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="hidden sm:inline text-slate-400">Role:</span>
              <span className="font-bold text-white uppercase">{role}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 p-2 bg-navy-900 border border-white/15 rounded-xl shadow-2xl z-50">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Test User Roles
                </div>
                <button
                  onClick={() => handleRoleSelect('USER')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                    role === 'USER' ? 'bg-indigo-600/30 text-white font-semibold' : 'text-slate-300 hover:bg-navy-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-3.5 h-3.5 text-blue-400" />
                    <span>Citizen User</span>
                  </div>
                  {role === 'USER' && <span className="text-[10px] text-indigo-400">Active</span>}
                </button>
                <button
                  onClick={() => handleRoleSelect('OFFICER')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                    role === 'OFFICER' ? 'bg-indigo-600/30 text-white font-semibold' : 'text-slate-300 hover:bg-navy-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Officer (Provider)</span>
                  </div>
                  {role === 'OFFICER' && <span className="text-[10px] text-indigo-400">Active</span>}
                </button>
                <button
                  onClick={() => handleRoleSelect('ADMIN')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                    role === 'ADMIN' ? 'bg-indigo-600/30 text-white font-semibold' : 'text-slate-300 hover:bg-navy-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    <span>Administrator</span>
                  </div>
                  {role === 'ADMIN' && <span className="text-[10px] text-rose-400">Active</span>}
                </button>
              </div>
            )}
          </div>

          {/* User Account / Login */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-navy-850 hover:bg-navy-800 border border-white/10 text-xs text-slate-200 transition"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-[10px] font-bold text-white">
                  {user?.full_name.charAt(0)}
                </div>
                <span className="font-semibold max-w-[100px] truncate">{user?.full_name.split(' ')[0]}</span>
              </Link>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-white/5 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 text-xs font-semibold text-white shadow-glow-indigo hover:opacity-95 transition"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-navy-900/95 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-navy-800"
          >
            Explore All Services
          </Link>
          <Link
            to="/services?mode=nearby"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-navy-800"
          >
            Nearby Services
          </Link>
          <Link
            to="/services?mode=best-overall"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-navy-800"
          >
            Top Rated Providers
          </Link>
          {isAuthenticated && (
            <Link
              to="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-navy-800"
            >
              My Bookings
            </Link>
          )}
          {role === 'OFFICER' && (
            <Link
              to="/officer"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-indigo-300 bg-indigo-500/10"
            >
              Officer Portal
            </Link>
          )}
          {role === 'ADMIN' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-rose-300 bg-rose-500/10"
            >
              Admin Console
            </Link>
          )}
          <div className="pt-2 border-t border-white/10 space-y-1">
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-navy-800"
            >
              About System Dossier
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-navy-800"
            >
              Help & FAQ
            </Link>
            <Link
              to="/api-docs"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-navy-800"
            >
              API Docs & Live Status
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
