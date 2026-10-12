import React, { useState, useEffect } from 'react';
import {
  Server,
  Database,
  CheckCircle2,
  RefreshCw,
  Code,
  Shield,
  Layers,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
} from 'lucide-react';
import { API_BASE_URL } from '../services/apiClient';

interface EndpointSpec {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  auth: 'Public' | 'USER' | 'OFFICER' | 'ADMIN';
  description: string;
  sampleBody?: string;
  sampleResponse?: string;
}

const ENDPOINTS: Record<string, EndpointSpec[]> = {
  'Health & System': [
    {
      method: 'GET',
      path: '/api/health',
      auth: 'Public',
      description: 'Liveness and database connectivity health probe',
      sampleResponse: '{\n  "status": "UP",\n  "framework": "Spring Boot 3.3.5",\n  "database": "MySQL 8.0"\n}',
    },
    {
      method: 'GET',
      path: '/actuator/health',
      auth: 'Public',
      description: 'Spring Boot Actuator standard health metric probe',
      sampleResponse: '{\n  "status": "UP"\n}',
    },
  ],
  'Authentication & Profiles': [
    {
      method: 'POST',
      path: '/api/auth/register',
      auth: 'Public',
      description: 'Register a new citizen user or officer account',
      sampleBody: '{\n  "fullName": "Sarah Jenkins",\n  "email": "sarah@example.com",\n  "password": "Password@123",\n  "role": "USER"\n}',
    },
    {
      method: 'POST',
      path: '/api/auth/login',
      auth: 'Public',
      description: 'Authenticate credentials and issue a signed JJWT token (HS512)',
      sampleBody: '{\n  "email": "user@nexora.org",\n  "password": "User@123"\n}',
    },
    {
      method: 'GET',
      path: '/api/auth/me',
      auth: 'USER',
      description: 'Retrieve current authenticated user profile',
    },
  ],
  'Categories & Providers': [
    {
      method: 'GET',
      path: '/api/categories',
      auth: 'Public',
      description: 'List all active urban categories (Restaurants, Hotels, Healthcare, Pharmacies, Salons)',
    },
    {
      method: 'GET',
      path: '/api/providers',
      auth: 'Public',
      description: 'Search & filter verified providers with Haversine distance and Bayesian ranking',
    },
    {
      method: 'GET',
      path: '/api/providers/{id}',
      auth: 'Public',
      description: 'Retrieve full provider profile with services, coordinates, and reviews',
    },
    {
      method: 'GET',
      path: '/api/providers/top-rated',
      auth: 'Public',
      description: 'Retrieve top-rated providers across all categories',
    },
  ],
  'Bookings & Availability': [
    {
      method: 'GET',
      path: '/api/providers/{id}/slots',
      auth: 'Public',
      description: 'Get available time slots for a provider',
    },
    {
      method: 'POST',
      path: '/api/bookings',
      auth: 'USER',
      description: 'Create a new appointment with pessimistic slot capacity locking',
      sampleBody: '{\n  "providerId": 1,\n  "serviceId": 1,\n  "slotId": 1,\n  "notes": "Table for 2 near window"\n}',
    },
    {
      method: 'GET',
      path: '/api/bookings/my-bookings',
      auth: 'USER',
      description: 'Fetch all appointments associated with the authenticated citizen',
    },
    {
      method: 'PATCH',
      path: '/api/bookings/{id}/cancel',
      auth: 'USER',
      description: 'Cancel an upcoming PENDING or CONFIRMED booking',
    },
  ],
  'Officer Portal': [
    {
      method: 'GET',
      path: '/api/officer/my-provider',
      auth: 'OFFICER',
      description: 'Retrieve the provider record assigned to the authenticated officer',
    },
    {
      method: 'PUT',
      path: '/api/officer/my-provider',
      auth: 'OFFICER',
      description: 'Update opening hours, address, phone, price range, and description',
    },
    {
      method: 'POST',
      path: '/api/officer/services',
      auth: 'OFFICER',
      description: 'Add a new catalog service with price and duration',
    },
    {
      method: 'POST',
      path: '/api/officer/slots',
      auth: 'OFFICER',
      description: 'Create new availability slots for booking',
    },
    {
      method: 'PATCH',
      path: '/api/officer/bookings/{id}/status',
      auth: 'OFFICER',
      description: 'Update booking status (CONFIRMED, REJECTED, COMPLETED)',
    },
  ],
  'Administrator Console': [
    {
      method: 'GET',
      path: '/api/admin/overview',
      auth: 'ADMIN',
      description: 'Platform KPIs: total users, providers, bookings, pending verifications',
    },
    {
      method: 'PATCH',
      path: '/api/admin/providers/{id}/verification',
      auth: 'ADMIN',
      description: 'Approve or reject newly registered provider verification',
    },
    {
      method: 'PATCH',
      path: '/api/admin/users/{id}/status',
      auth: 'ADMIN',
      description: 'Toggle citizen user account active/suspended status',
    },
  ],
};

export const ApiDocsPage: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState<string>('Health & System');
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const pingHealth = async () => {
    setIsPinging(true);
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      const data = await res.json();
      setHealthStatus(data);
    } catch (err: any) {
      setHealthStatus({ status: 'DOWN', error: err.message });
    } finally {
      setIsPinging(false);
    }
  };

  useEffect(() => {
    pingHealth();
  }, []);

  const copyToClipboard = (text: string, path: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-indigo-300 text-xs font-semibold shadow-glow-indigo">
          <Code className="w-3.5 h-3.5 text-brand-secondary" />
          <span>Spring Boot 3.3.5 REST Specification</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          NEXORA API Explorer
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Comprehensive REST API endpoints powering authentication, geographic discovery, slot management, and administrative moderation.
        </p>
      </div>

      {/* Live Server Health Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Live Spring Boot Backend</h3>
                {healthStatus?.success ? (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    ONLINE (200 OK)
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Checking...
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Endpoint: <code className="text-slate-300">{API_BASE_URL}/health</code>
              </p>
            </div>
          </div>

          {healthStatus && (
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-brand-secondary" />
                DB: <strong className="text-white">{healthStatus.data?.database || 'MySQL 8.0'}</strong>
              </span>
              <span>
                Framework: <strong className="text-white">{healthStatus.data?.framework || 'Spring Boot 3.3.5'}</strong>
              </span>
              <span>
                Status: <strong className="text-emerald-400">{healthStatus.data?.status || 'UP'}</strong>
              </span>
            </div>
          )}
        </div>

        <button
          onClick={pingHealth}
          disabled={isPinging}
          className="px-5 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-750 text-white font-bold text-xs border border-white/15 transition flex items-center gap-2 shrink-0 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
          <span>{isPinging ? 'Pinging...' : 'Re-check Health'}</span>
        </button>
      </div>

      {/* API Endpoints Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-1.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            API Modules
          </div>
          {Object.keys(ENDPOINTS).map((group) => (
            <button
              key={group}
              onClick={() => setActiveGroup(group)}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                activeGroup === group
                  ? 'bg-brand-primary text-white shadow-glow-indigo font-bold'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{group}</span>
              <span className="text-[11px] opacity-70">({ENDPOINTS[group].length})</span>
            </button>
          ))}
        </div>

        {/* Endpoints Table / Cards */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">{activeGroup}</h2>
            <span className="text-xs text-slate-400">
              Base URL: <code className="text-brand-secondary">{API_BASE_URL}</code>
            </span>
          </div>

          <div className="space-y-4">
            {ENDPOINTS[activeGroup]?.map((ep, idx) => {
              const curlCommand = `curl -X ${ep.method} "${API_BASE_URL}${ep.path.replace('{id}', '1')}" ${
                ep.sampleBody ? `-H "Content-Type: application/json" -d '${ep.sampleBody.replace(/\n/g, '')}'` : ''
              }`;

              return (
                <div
                  key={idx}
                  className="glass-card rounded-2xl p-5 border border-white/10 space-y-3 hover:border-brand-primary/40 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold tracking-wider ${
                          ep.method === 'GET'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : ep.method === 'POST'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : ep.method === 'PATCH'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : ep.method === 'PUT'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {ep.method}
                      </span>
                      <code className="text-xs sm:text-sm font-mono text-white font-semibold">
                        {ep.path}
                      </code>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ep.auth === 'Public'
                            ? 'bg-slate-700/50 text-slate-300'
                            : ep.auth === 'USER'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : ep.auth === 'OFFICER'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {ep.auth === 'Public' ? 'PUBLIC' : `ROLE: ${ep.auth}`}
                      </span>

                      <button
                        onClick={() => copyToClipboard(curlCommand, ep.path)}
                        className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 text-xs transition flex items-center gap-1"
                        title="Copy cURL Command"
                      >
                        {copiedPath === ep.path ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span className="text-[10px] hidden sm:inline">cURL</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{ep.description}</p>

                  {ep.sampleBody && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Request Body:
                      </span>
                      <pre className="p-3 rounded-xl bg-navy-950 border border-white/10 text-[11px] font-mono text-slate-300 overflow-x-auto">
                        {ep.sampleBody}
                      </pre>
                    </div>
                  )}

                  {ep.sampleResponse && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Sample Response (200 OK):
                      </span>
                      <pre className="p-3 rounded-xl bg-navy-950 border border-white/10 text-[11px] font-mono text-emerald-300/90 overflow-x-auto">
                        {ep.sampleResponse}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
