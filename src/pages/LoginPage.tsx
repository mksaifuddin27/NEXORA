import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Mail, Lock, AlertCircle, ArrowRight, UserCheck, ShieldCheck, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    switchDemoRole(role);
    if (role === 'OFFICER') {
      navigate('/officer');
    } else if (role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center shadow-glow-indigo">
              <Compass className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <span className="text-2xl font-extrabold text-white tracking-wider">NEXORA</span>
          </Link>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400">
            Sign in to discover local services, manage slots, or view bookings
          </p>
        </div>

        {/* Quick Demo Logins Box (Very helpful for faculty / evaluation) */}
        <div className="p-4 rounded-2xl bg-navy-850/90 border border-brand-primary/30 shadow-xl space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center justify-between">
            <span>Instant Evaluation Logins</span>
            <span className="text-[10px] bg-indigo-500/20 px-2 py-0.5 rounded text-indigo-300">1-Click</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('USER')}
              className="py-2 px-2 rounded-xl bg-navy-800 hover:bg-navy-750 border border-white/10 text-[11px] font-medium text-slate-200 transition flex flex-col items-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Citizen</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('OFFICER')}
              className="py-2 px-2 rounded-xl bg-navy-800 hover:bg-navy-750 border border-white/10 text-[11px] font-medium text-slate-200 transition flex flex-col items-center gap-1"
            >
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <span>Officer</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('ADMIN')}
              className="py-2 px-2 rounded-xl bg-navy-800 hover:bg-navy-750 border border-white/10 text-[11px] font-medium text-slate-200 transition flex flex-col items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Traditional Form Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-850 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <span className="text-[11px] text-indigo-400 hover:underline cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-850 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 text-white font-bold text-xs shadow-glow-indigo hover:opacity-95 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to NEXORA</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-secondary hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
