import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, User, Mail, Lock, AlertCircle, ArrowRight, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export const RegisterPage = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('USER');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
            setError('Please fill in all required fields.');
            return;
        }
        if (password.length < 6) {
            setError('Password must contain at least 6 characters.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match. Please verify your entries.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await register(fullName.trim(), email.trim(), password, selectedRole);
            if (selectedRole === 'OFFICER') {
                navigate('/officer');
            }
            else {
                navigate('/dashboard');
            }
        }
        catch (err) {
            setError(err?.message || 'Registration failed.');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center shadow-glow-indigo">
              <Compass className="w-5 h-5 text-white stroke-[2.2]"/>
            </div>
            <span className="text-2xl font-extrabold text-white tracking-wider">NEXORA</span>
          </Link>
          <h2 className="text-2xl font-bold text-white">Create Your Account</h2>
          <p className="text-xs text-slate-400">
            Join the smart local service discovery ecosystem
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-5">
          {error && (<div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0"/>
              <span>{error}</span>
            </div>)}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Type Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                I am registering as:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setSelectedRole('USER')} className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${selectedRole === 'USER'
            ? 'border-brand-primary bg-indigo-500/20 text-white shadow-sm'
            : 'border-white/10 bg-navy-850 text-slate-300 hover:bg-navy-800'}`}>
                  <User className="w-4 h-4 text-blue-400"/>
                  <span>Citizen User</span>
                </button>
                <button type="button" onClick={() => setSelectedRole('OFFICER')} className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${selectedRole === 'OFFICER'
            ? 'border-brand-primary bg-indigo-500/20 text-white shadow-sm'
            : 'border-white/10 bg-navy-850 text-slate-300 hover:bg-navy-800'}`}>
                  <Briefcase className="w-4 h-4 text-indigo-400"/>
                  <span>Service Officer</span>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Mohammed Khaja" required className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-850 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"/>
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-850 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"/>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" required className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-850 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"/>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" required className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-850 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"/>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 text-white font-bold text-xs shadow-glow-indigo hover:opacity-95 disabled:opacity-50 transition flex items-center justify-center gap-2">
              {isLoading ? (<span>Creating Account...</span>) : (<>
                  <span>Create NEXORA Account</span>
                  <ArrowRight className="w-4 h-4"/>
                </>)}
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-secondary hover:underline">
              Sign In Instead
            </Link>
          </div>
        </div>
      </div>
    </div>);
};
