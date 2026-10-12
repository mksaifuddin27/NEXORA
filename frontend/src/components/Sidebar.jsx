import React, { useState } from 'react';
import { Link, useLocation as useRouterLocation, useNavigate } from 'react-router-dom';
import { Compass, MapPin, CalendarCheck, ShieldAlert, Briefcase, LogOut, Sparkles, Search, ChevronDown, Info, HelpCircle, Code, Utensils, Hotel, Stethoscope, Pill, Scissors, LayoutDashboard, CheckCircle2, X, } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { GoogleMapsLocationModal } from './GoogleMapsLocationModal';
export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
    const { user, role, isAuthenticated, logout, switchDemoRole } = useAuth();
    const { userLocation } = useLocation();
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
    const routerLocation = useRouterLocation();
    const navigate = useNavigate();
    const handleRoleSelect = (newRole) => {
        switchDemoRole(newRole);
        setRoleDropdownOpen(false);
        if (newRole === 'OFFICER') {
            navigate('/officer');
        }
        else if (newRole === 'ADMIN') {
            navigate('/admin');
        }
        else {
            navigate('/dashboard');
        }
    };
    const isActive = (path, exact = false) => {
        if (exact)
            return routerLocation.pathname === path;
        return routerLocation.pathname.startsWith(path);
    };
    const navItemClass = (active) => `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition group ${active
        ? 'bg-indigo-600/20 text-white font-bold border border-indigo-500/40 shadow-sm'
        : 'text-slate-300 hover:text-white hover:bg-white/5'}`;
    const sidebarContent = (<div className="flex flex-col h-full justify-between">
      {/* Top: Brand & Location */}
      <div className="space-y-4">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-1">
          <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
              <Compass className="w-5 h-5 text-white stroke-[2.2]"/>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-wider text-white">
                NEXORA
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Local Service Discovery
              </span>
            </div>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Google Maps Location Search Pill */}
        <div className="pt-1">
          <button onClick={() => setIsLocationModalOpen(true)} className="w-full flex items-center justify-between p-2.5 rounded-xl bg-navy-900 border border-white/10 hover:border-indigo-500/50 hover:bg-navy-850 transition text-left group">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                <MapPin className="w-3.5 h-3.5"/>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Google Maps Location
                </div>
                <div className="text-xs font-semibold text-white truncate max-w-[150px]">
                  {userLocation?.cityName || 'Set Location'}
                </div>
              </div>
            </div>
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 shrink-0"/>
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-2"/>

        {/* Navigation Sections */}
        <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-330px)] pr-1">
          {/* Section 1: Discovery */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Discovery
            </div>
            <Link to="/services" onClick={() => setMobileOpen(false)} className={navItemClass(routerLocation.pathname === '/services' && !routerLocation.search)}>
              <Compass className="w-4 h-4 text-indigo-400 shrink-0"/>
              <span>Explore Services</span>
            </Link>
            <Link to="/services?mode=nearby" onClick={() => setMobileOpen(false)} className={navItemClass(routerLocation.search.includes('mode=nearby'))}>
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0"/>
              <span>Nearby Services</span>
            </Link>
            <Link to="/services?mode=best-overall" onClick={() => setMobileOpen(false)} className={navItemClass(routerLocation.search.includes('mode=best-overall'))}>
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0"/>
              <span>Top Rated</span>
            </Link>
          </div>

          {/* Section 2: Categories */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Categories
            </div>
            <Link to="/services?category=1" onClick={() => setMobileOpen(false)} className={navItemClass(routerLocation.search.includes('category=1'))}>
              <Utensils className="w-4 h-4 text-rose-400 shrink-0"/>
              <span>Restaurants</span>
            </Link>
            <Link to="/services?category=2" onClick={() => setMobileOpen(false)} className={navItemClass(routerLocation.search.includes('category=2'))}>
              <Hotel className="w-4 h-4 text-amber-400 shrink-0"/>
              <span>Hotels</span>
            </Link>
            <Link to="/services?category=3" onClick={() => setMobileOpen(false)} className={navItemClass(routerLocation.search.includes('category=3'))}>
              <Stethoscope className="w-4 h-4 text-sky-400 shrink-0"/>
              <span>Healthcare</span>
            </Link>
            <Link to="/services?category=4" onClick={() => setMobileOpen(false)} className={navItemClass(routerLocation.search.includes('category=4'))}>
              <Pill className="w-4 h-4 text-emerald-400 shrink-0"/>
              <span>Pharmacies</span>
            </Link>
            <Link to="/services?category=5" onClick={() => setMobileOpen(false)} className={navItemClass(routerLocation.search.includes('category=5'))}>
              <Scissors className="w-4 h-4 text-purple-400 shrink-0"/>
              <span>Salons</span>
            </Link>
          </div>

          {/* Section 3: Portals & Account */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Management
            </div>
            {isAuthenticated ? (<>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className={navItemClass(isActive('/dashboard', true))}>
                  <LayoutDashboard className="w-4 h-4 text-blue-400 shrink-0"/>
                  <span>My Dashboard</span>
                </Link>
                <Link to="/my-bookings" onClick={() => setMobileOpen(false)} className={navItemClass(isActive('/my-bookings', true))}>
                  <CalendarCheck className="w-4 h-4 text-indigo-400 shrink-0"/>
                  <span>My Bookings</span>
                </Link>
              </>) : null}

            <Link to="/officer" onClick={() => setMobileOpen(false)} className={navItemClass(isActive('/officer'))}>
              <Briefcase className="w-4 h-4 text-amber-400 shrink-0"/>
              <span>Officer Portal</span>
            </Link>

            <Link to="/admin" onClick={() => setMobileOpen(false)} className={navItemClass(isActive('/admin'))}>
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0"/>
              <span>Admin Console</span>
            </Link>
          </div>

          {/* Section 4: Project Info */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              System Info
            </div>
            <Link to="/about" onClick={() => setMobileOpen(false)} className={navItemClass(isActive('/about', true))}>
              <Info className="w-4 h-4 text-indigo-300 shrink-0"/>
              <span>About NEXORA</span>
            </Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)} className={navItemClass(isActive('/contact', true))}>
              <HelpCircle className="w-4 h-4 text-sky-400 shrink-0"/>
              <span>Help & FAQ</span>
            </Link>
            <Link to="/api-docs" onClick={() => setMobileOpen(false)} className={navItemClass(isActive('/api-docs', true))}>
              <Code className="w-4 h-4 text-emerald-400 shrink-0"/>
              <span>API Explorer</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Profile & Role Switcher */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        {/* Role Switcher Pill */}
        <div className="relative">
          <button onClick={() => setRoleDropdownOpen(!roleDropdownOpen)} className="w-full flex items-center justify-between p-2 rounded-xl bg-navy-900 border border-white/10 hover:border-white/20 text-xs transition">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"/>
              <span className="text-slate-400 text-[11px]">Role:</span>
              <span className="font-bold text-white text-[11px] uppercase truncate">{role}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0"/>
          </button>

          {roleDropdownOpen && (<div className="absolute bottom-12 left-0 right-0 p-2 bg-navy-900 border border-white/15 rounded-xl shadow-2xl z-50 space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Test Role
              </div>
              <button onClick={() => handleRoleSelect('USER')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition ${role === 'USER' ? 'bg-indigo-600/30 text-white' : 'text-slate-300 hover:bg-navy-800'}`}>
                <span>Citizen User</span>
                {role === 'USER' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400"/>}
              </button>
              <button onClick={() => handleRoleSelect('OFFICER')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition ${role === 'OFFICER' ? 'bg-indigo-600/30 text-white' : 'text-slate-300 hover:bg-navy-800'}`}>
                <span>Officer (Provider)</span>
                {role === 'OFFICER' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400"/>}
              </button>
              <button onClick={() => handleRoleSelect('ADMIN')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition ${role === 'ADMIN' ? 'bg-indigo-600/30 text-white' : 'text-slate-300 hover:bg-navy-800'}`}>
                <span>Administrator</span>
                {role === 'ADMIN' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400"/>}
              </button>
            </div>)}
        </div>

        {/* User Card */}
        {isAuthenticated ? (<div className="flex items-center justify-between p-2 rounded-xl bg-navy-900 border border-white/10">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate max-w-[110px]">
                  {user?.full_name || 'User'}
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[110px]">
                  {user?.email}
                </div>
              </div>
            </div>
            <button onClick={logout} title="Logout" className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition">
              <LogOut className="w-4 h-4"/>
            </button>
          </div>) : (<div className="grid grid-cols-2 gap-2">
            <Link to="/login" onClick={() => setMobileOpen(false)} className="py-2 text-center text-xs font-semibold text-slate-300 hover:text-white bg-navy-900 border border-white/10 rounded-xl hover:bg-navy-850 transition">
              Sign In
            </Link>
            <Link to="/register" onClick={() => setMobileOpen(false)} className="py-2 text-center text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition shadow-sm">
              Register
            </Link>
          </div>)}
      </div>

      {/* Google Maps Location Modal Instance */}
      <GoogleMapsLocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)}/>
    </div>);
    return (<>
      {/* Desktop Persistent Left Sidebar */}
      <aside className="hidden lg:flex w-64 xl:w-72 bg-navy-950 border-r border-white/10 h-screen sticky top-0 flex-col p-4 z-40 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-in Drawer */}
      {mobileOpen && (<div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)}/>
          <div className="fixed inset-y-0 left-0 w-72 bg-navy-950 border-r border-white/10 p-4 shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>)}
    </>);
};
