import React, { useState } from 'react';
import { HelpCircle, Mail, MapPin, Send, CheckCircle2, ChevronDown, ChevronUp, AlertCircle, Clock, ShieldCheck, Compass, } from 'lucide-react';
const FAQS = [
    {
        category: 'Discovery & Location',
        question: 'How does NEXORA calculate physical distance from providers?',
        answer: 'NEXORA uses the mathematical Haversine spherical formula, taking the latitude and longitude of your selected location (via browser GPS or one of our metro city presets) and computing the great-circle physical distance in kilometers to the registered provider coordinates.',
    },
    {
        category: 'Discovery & Location',
        question: 'Do I have to grant browser location permission?',
        answer: 'No. While browser GPS allows instant pinpoint proximity, you can freely choose any supported urban hub (such as Hyderabad, Bengaluru, Mumbai, Delhi, etc.) from the location picker in the navigation bar at any time without sharing GPS coordinates.',
    },
    {
        category: 'Rankings & Ratings',
        question: 'How does the "Best Nearby" and "Best Overall" ranking work?',
        answer: 'We use a transparent Bayesian weighted score that combines the average rating with the total count of verified customer reviews, balanced against a platform prior. This ensures a business with 1 review of 5.0 does not outrank a consistently exceptional provider with 150 verified reviews.',
    },
    {
        category: 'Bookings & Slots',
        question: 'How are conflicting booking requests handled?',
        answer: 'The Spring Boot backend uses pessimistic database locking (`@Lock(LockModeType.PESSIMISTIC_WRITE)`) on availability slots. When you book a slot, the system locks that specific database row, validates available capacity in real time, decrements capacity, and creates your booking in an atomic ACID transaction. Overlapping bookings are strictly prevented.',
    },
    {
        category: 'Officers & Businesses',
        question: 'Can any user register as an Officer?',
        answer: 'Yes! Through the Register page, users can select the "Service Provider Officer" account type. Once registered, officers can configure their establishment details, catalog services with prices and durations, and define live booking slots.',
    },
    {
        category: 'Officers & Businesses',
        question: 'Why is my new provider not showing up on public discovery immediately?',
        answer: 'For quality assurance and trust, new providers require administrator verification before appearing in public searches. Platform administrators review newly registered establishments in the Administrator Console.',
    },
];
export const ContactPage = () => {
    const [openFaqIndex, setOpenFaqIndex] = useState(0);
    const [faqFilter, setFaqFilter] = useState('All');
    // Contact Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        category: 'General',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedSuccess, setSubmittedSuccess] = useState(false);
    const [formError, setFormError] = useState(null);
    const filteredFaqs = faqFilter === 'All'
        ? FAQS
        : FAQS.filter((f) => f.category.toLowerCase().includes(faqFilter.toLowerCase()));
    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError(null);
        if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
            setFormError('Please complete all required fields (Name, Email, and Message).');
            return;
        }
        setIsSubmitting(true);
        // Simulate interactive submission handling
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmittedSuccess(true);
            setFormData({
                fullName: '',
                email: '',
                category: 'General',
                subject: '',
                message: '',
            });
        }, 800);
    };
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-indigo-300 text-xs font-semibold shadow-glow-indigo">
          <HelpCircle className="w-3.5 h-3.5 text-brand-secondary"/>
          <span>Support & Inquiries</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Help, FAQ & Contact
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Have questions about discovery, booking slots, or listing your establishment? We are here to assist.
        </p>
      </div>

      {/* Grid: Contact Form + Emergency & Direct Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Cols: Interactive Contact Form */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-brand-secondary"/>
              <span>Send us a Message</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Our support team and platform moderators respond within 24 business hours.
            </p>
          </div>

          {submittedSuccess ? (<div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto"/>
              <h3 className="text-lg font-bold text-white">Message Transmitted Successfully!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Thank you for reaching out to NEXORA Support. A ticket reference has been logged and our team will get back to you shortly.
              </p>
              <button onClick={() => setSubmittedSuccess(false)} className="mt-3 px-5 py-2 rounded-xl bg-navy-850 hover:bg-navy-800 text-xs font-bold text-white border border-white/15 transition">
                Send Another Inquiry
              </button>
            </div>) : (<form onSubmit={handleSubmit} className="space-y-4">
              {formError && (<div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0"/>
                  <span>{formError}</span>
                </div>)}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Your Full Name *</label>
                  <input type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="e.g. Rahul Sharma" className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"/>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="e.g. rahul@example.com" className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"/>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Service Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-primary">
                    <option value="General">General Inquiry</option>
                    <option value="Restaurants">Restaurants & Dining</option>
                    <option value="Hotels">Hotels & Accommodations</option>
                    <option value="Healthcare">Healthcare & Clinics</option>
                    <option value="Pharmacies">24/7 Pharmacies</option>
                    <option value="Salons">Salons & Grooming</option>
                    <option value="Officer Support">Officer Portal Assistance</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Subject</label>
                  <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="Brief description of query" className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"/>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Message / Query *</label>
                <textarea rows={4} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="How can we assist you today? Provide any relevant booking reference or provider name..." className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"/>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 hover:from-brand-primaryHover hover:to-indigo-500 text-white font-bold text-xs shadow-glow-indigo transition flex items-center justify-center gap-2">
                <Send className="w-4 h-4"/>
                <span>{isSubmitting ? 'Transmitting...' : 'Submit Inquiry'}</span>
              </button>
            </form>)}
        </div>

        {/* Right Col: Helplines & Office Info */}
        <div className="space-y-6">
          {/* Emergency / Critical Care Banner */}
          <div className="glass-card rounded-2xl p-6 border border-emerald-500/20 bg-emerald-950/20 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4"/>
              <span>24/7 Essential Helplines</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              For urgent pharmaceutical deliveries or medical emergency consultations:
            </p>
            <div className="space-y-2 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-navy-950/80 border border-white/10 flex items-center justify-between">
                <span className="text-slate-400">Emergency Care Clinic:</span>
                <span className="font-bold text-white">+91 40 8899 0011</span>
              </div>
              <div className="p-2.5 rounded-xl bg-navy-950/80 border border-white/10 flex items-center justify-between">
                <span className="text-slate-400">24/7 Chemist Express:</span>
                <span className="font-bold text-white">+91 40 9988 7766</span>
              </div>
            </div>
          </div>

          {/* Platform Headquarters & Verification */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-brand-secondary"/>
              <span>NEXORA Central Node</span>
            </h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5"/>
                <span>HITEC City, Cyberabad, Hyderabad, Telangana, 500081</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0"/>
                <span>support@nexora.org</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0"/>
                <span>100% Verified Service Ecosystem</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ SECTION */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-secondary mb-2">
            Knowledge Base
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Everything you need to know about provider ranking, slot locking, and platform governance.
          </p>

          {/* Filter pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {['All', 'Discovery', 'Rankings', 'Bookings', 'Officers'].map((f) => (<button key={f} onClick={() => setFaqFilter(f)} className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${faqFilter === f
                ? 'bg-brand-primary text-white shadow-glow-indigo'
                : 'bg-navy-850 text-slate-400 hover:text-white border border-white/10'}`}>
                {f}
              </button>))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (<div key={index} className="glass-card rounded-2xl border border-white/10 overflow-hidden transition">
                <button onClick={() => setOpenFaqIndex(isOpen ? null : index)} className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition">
                  <span className="font-bold text-sm text-white">{faq.question}</span>
                  {isOpen ? (<ChevronUp className="w-4 h-4 text-brand-secondary shrink-0"/>) : (<ChevronDown className="w-4 h-4 text-slate-400 shrink-0"/>)}
                </button>
                {isOpen && (<div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-white/10 pt-3">
                    {faq.answer}
                  </div>)}
              </div>);
        })}
        </div>
      </div>
    </div>);
};
