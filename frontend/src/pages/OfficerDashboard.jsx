import React, { useState, useEffect } from 'react';
import { Store, Layers, Clock, CalendarCheck, Plus, Trash2, Save, } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { officerService } from '../services/officerService';
import { providerService } from '../services/providerService';
import { bookingService } from '../services/bookingService';
import { formatCurrency, formatTime } from '../utils/formatters';
export const OfficerDashboard = () => {
    const { user } = useAuth();
    const [provider, setProvider] = useState(null);
    const [services, setServices] = useState([]);
    const [slots, setSlots] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('BOOKINGS');
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    // Edit Provider Form State
    const [provName, setProvName] = useState('');
    const [provPhone, setProvPhone] = useState('');
    const [provAddress, setProvAddress] = useState('');
    const [provHours, setProvHours] = useState('');
    const [provDesc, setProvDesc] = useState('');
    // Add Service Form State
    const [newServiceName, setNewServiceName] = useState('');
    const [newServicePrice, setNewServicePrice] = useState('');
    const [newServiceDesc, setNewServiceDesc] = useState('');
    // Add Slot Form State
    const [newSlotDate, setNewSlotDate] = useState('2026-10-15');
    const [newSlotStart, setNewSlotStart] = useState('11:00');
    const [newSlotEnd, setNewSlotEnd] = useState('12:00');
    useEffect(() => {
        const loadOfficerData = async () => {
            setIsLoading(true);
            try {
                const prov = await officerService.getOfficerProvider(user?.user_id || 2);
                setProvider(prov);
                if (prov) {
                    setProvName(prov.provider_name);
                    setProvPhone(prov.phone);
                    setProvAddress(prov.address);
                    setProvHours(prov.opening_hours);
                    setProvDesc(prov.description);
                    const [servList, slotList, bookList] = await Promise.all([
                        providerService.getServicesByProviderId(prov.provider_id),
                        providerService.getSlotsByProviderId(prov.provider_id),
                        bookingService.getBookingsByProviderId(prov.provider_id),
                    ]);
                    setServices(servList);
                    setSlots(slotList);
                    setBookings(bookList);
                }
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setIsLoading(false);
            }
        };
        loadOfficerData();
    }, [user]);
    const showToast = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!provider)
            return;
        try {
            const updated = await officerService.updateProviderProfile(provider.provider_id, {
                provider_name: provName,
                phone: provPhone,
                address: provAddress,
                opening_hours: provHours,
                description: provDesc,
            });
            setProvider(updated);
            showToast('Provider profile updated successfully.');
        }
        catch {
            alert('Failed to update provider profile.');
        }
    };
    const handleAddService = async (e) => {
        e.preventDefault();
        if (!provider || !newServiceName || !newServicePrice)
            return;
        try {
            const added = await officerService.addService({
                provider_id: provider.provider_id,
                service_name: newServiceName,
                description: newServiceDesc || 'Standard quality service offering',
                price: parseFloat(newServicePrice),
            });
            setServices((prev) => [...prev, added]);
            setNewServiceName('');
            setNewServicePrice('');
            setNewServiceDesc('');
            showToast(`Added service: ${added.service_name}`);
        }
        catch {
            alert('Failed to add service.');
        }
    };
    const handleDeleteService = async (serviceId) => {
        if (!window.confirm('Are you sure you want to delete this service?'))
            return;
        try {
            await officerService.deleteService(serviceId);
            setServices((prev) => prev.filter((s) => s.service_id !== serviceId));
            showToast('Service deleted.');
        }
        catch {
            alert('Could not delete service.');
        }
    };
    const handleAddSlot = async (e) => {
        e.preventDefault();
        if (!provider)
            return;
        try {
            const added = await officerService.addAvailabilitySlot({
                provider_id: provider.provider_id,
                available_date: newSlotDate,
                start_time: newSlotStart,
                end_time: newSlotEnd,
                status: 'AVAILABLE',
            });
            setSlots((prev) => [...prev, added]);
            showToast('Availability slot created.');
        }
        catch {
            alert('Failed to create slot.');
        }
    };
    const handleDeleteSlot = async (slotId) => {
        try {
            await officerService.deleteAvailabilitySlot(slotId);
            setSlots((prev) => prev.filter((s) => s.availability_id !== slotId));
            showToast('Slot removed.');
        }
        catch {
            alert('Could not remove slot.');
        }
    };
    const handleUpdateBookingStatus = async (bookingId, status) => {
        try {
            await bookingService.updateBookingStatus(bookingId, status);
            setBookings((prev) => prev.map((b) => (b.booking_id === bookingId ? { ...b, status } : b)));
            showToast(`Booking marked as ${status}.`);
        }
        catch {
            alert('Could not update status.');
        }
    };
    if (isLoading) {
        return (<div className="max-w-6xl mx-auto px-4 py-16 text-center text-slate-400">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
        <p className="text-xs">Loading officer management console...</p>
      </div>);
    }
    return (<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast */}
      {notification && (<div className="fixed top-24 right-6 z-50 p-4 rounded-2xl bg-indigo-900 border border-brand-primary text-white text-xs font-bold shadow-2xl animate-in slide-in-from-right-4">
          ✓ {notification}
        </div>)}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-navy-900 to-indigo-950/70 border border-white/10 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Officer Console
            </span>
            <span className="text-xs text-slate-400">Managing: {provider?.provider_name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Provider Management Dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Control establishment details, catalog offerings, active schedule slots, and incoming booking requests.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="px-3 py-1.5 rounded-xl bg-navy-850 border border-white/10 text-xs font-bold text-emerald-400">
            Status: {provider?.verification_status}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex rounded-2xl bg-navy-900 p-1.5 border border-white/10 overflow-x-auto">
        <button onClick={() => setActiveTab('BOOKINGS')} className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'BOOKINGS'
            ? 'bg-brand-primary text-white shadow-glow-indigo'
            : 'text-slate-400 hover:text-white'}`}>
          <CalendarCheck className="w-3.5 h-3.5"/>
          <span>Booking Requests ({bookings.length})</span>
        </button>

        <button onClick={() => setActiveTab('SERVICES')} className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'SERVICES'
            ? 'bg-brand-primary text-white shadow-glow-indigo'
            : 'text-slate-400 hover:text-white'}`}>
          <Layers className="w-3.5 h-3.5"/>
          <span>Services & Prices ({services.length})</span>
        </button>

        <button onClick={() => setActiveTab('SLOTS')} className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'SLOTS'
            ? 'bg-brand-primary text-white shadow-glow-indigo'
            : 'text-slate-400 hover:text-white'}`}>
          <Clock className="w-3.5 h-3.5"/>
          <span>Schedule & Availability ({slots.length})</span>
        </button>

        <button onClick={() => setActiveTab('PROFILE')} className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'PROFILE'
            ? 'bg-brand-primary text-white shadow-glow-indigo'
            : 'text-slate-400 hover:text-white'}`}>
          <Store className="w-3.5 h-3.5"/>
          <span>Provider Profile</span>
        </button>
      </div>

      {/* TAB 1: BOOKING REQUESTS */}
      {activeTab === 'BOOKINGS' && (<div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Incoming bookings from citizens</span>
            <span>Update booking status below</span>
          </div>

          {bookings.length === 0 ? (<div className="p-12 text-center text-slate-400 bg-navy-900 rounded-2xl border border-white/5">
              <p>No customer bookings recorded yet.</p>
            </div>) : (<div className="space-y-3">
              {bookings.map((b) => (<div key={b.booking_id} className="p-4 sm:p-5 rounded-2xl bg-navy-900 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-500 font-bold">#{b.booking_id}</span>
                      <span className="font-bold text-white text-sm">{b.user_name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${b.status === 'CONFIRMED'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : b.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-300'
                            : b.status === 'COMPLETED'
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-rose-500/20 text-rose-300'}`}>
                        {b.status}
                      </span>
                    </div>
                    <div className="text-slate-300">
                      Service: <span className="font-semibold text-white">{b.service_name}</span> • Amount: <span className="text-emerald-400 font-bold">{formatCurrency(b.total_price)}</span>
                    </div>
                    <div className="text-slate-400">
                      Slot: {b.booking_date} at {formatTime(b.booking_time)}
                    </div>
                    {b.notes && <div className="text-slate-400 italic">"{b.notes}"</div>}
                  </div>

                  {/* Officer Actions */}
                  <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                    {b.status !== 'CONFIRMED' && (<button onClick={() => handleUpdateBookingStatus(b.booking_id, 'CONFIRMED')} className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition">
                        Confirm
                      </button>)}
                    {b.status !== 'COMPLETED' && (<button onClick={() => handleUpdateBookingStatus(b.booking_id, 'COMPLETED')} className="px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-semibold border border-blue-500/30 transition">
                        Mark Completed
                      </button>)}
                    {b.status !== 'CANCELLED' && (<button onClick={() => handleUpdateBookingStatus(b.booking_id, 'CANCELLED')} className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold border border-rose-500/30 transition">
                        Reject
                      </button>)}
                  </div>
                </div>))}
            </div>)}
        </div>)}

      {/* TAB 2: SERVICES & PRICING */}
      {activeTab === 'SERVICES' && (<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Service Form */}
          <div className="p-6 rounded-2xl bg-navy-900 border border-white/10 space-y-4 h-fit">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-brand-secondary"/>
              Add New Service Offering
            </h3>
            <form onSubmit={handleAddService} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Service Name
                </label>
                <input type="text" value={newServiceName} onChange={(e) => setNewServiceName(e.target.value)} placeholder="E.g., Deluxe Pedicure / Consultation" required className="w-full px-3 py-2 rounded-xl bg-navy-850 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"/>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Price (INR)
                </label>
                <input type="number" value={newServicePrice} onChange={(e) => setNewServicePrice(e.target.value)} placeholder="E.g., 750" required min="0" className="w-full px-3 py-2 rounded-xl bg-navy-850 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"/>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Description
                </label>
                <textarea value={newServiceDesc} onChange={(e) => setNewServiceDesc(e.target.value)} placeholder="Details of what is included in this service..." rows={2} className="w-full px-3 py-2 rounded-xl bg-navy-850 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"/>
              </div>

              <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 text-white font-bold text-xs shadow-glow-indigo transition">
                Add Service to Menu
              </button>
            </form>
          </div>

          {/* Service List */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-base font-bold text-white">Current Services Catalog</h3>
            {services.map((s) => (<div key={s.service_id} className="p-4 rounded-2xl bg-navy-900 border border-white/10 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white">{s.service_name}</h4>
                  <p className="text-xs text-slate-400">{s.description}</p>
                  <div className="text-xs font-bold text-emerald-400 mt-1">
                    {formatCurrency(s.price)}
                  </div>
                </div>

                <button onClick={() => handleDeleteService(s.service_id)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-navy-800 rounded-lg transition" title="Delete service">
                  <Trash2 className="w-4 h-4"/>
                </button>
              </div>))}
          </div>
        </div>)}

      {/* TAB 3: SLOTS & AVAILABILITY */}
      {activeTab === 'SLOTS' && (<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Slot */}
          <div className="p-6 rounded-2xl bg-navy-900 border border-white/10 space-y-4 h-fit">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-brand-secondary"/>
              Add Availability Slot
            </h3>
            <form onSubmit={handleAddSlot} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Date
                </label>
                <input type="date" value={newSlotDate} onChange={(e) => setNewSlotDate(e.target.value)} required className="w-full px-3 py-2 rounded-xl bg-navy-850 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-primary"/>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Start Time
                  </label>
                  <input type="time" value={newSlotStart} onChange={(e) => setNewSlotStart(e.target.value)} required className="w-full px-3 py-2 rounded-xl bg-navy-850 border border-white/10 text-xs text-white focus:outline-none"/>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    End Time
                  </label>
                  <input type="time" value={newSlotEnd} onChange={(e) => setNewSlotEnd(e.target.value)} required className="w-full px-3 py-2 rounded-xl bg-navy-850 border border-white/10 text-xs text-white focus:outline-none"/>
                </div>
              </div>

              <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 text-white font-bold text-xs shadow-glow-indigo transition">
                Create Open Slot
              </button>
            </form>
          </div>

          {/* Slots List */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-base font-bold text-white">Active Calendar Slots</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {slots.map((s) => (<div key={s.availability_id} className="p-3.5 rounded-xl bg-navy-900 border border-white/10 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <div className="font-bold text-white">{s.available_date}</div>
                    <div className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3"/>
                      <span>{formatTime(s.start_time)} – {formatTime(s.end_time)}</span>
                    </div>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${s.status === 'AVAILABLE'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/20 text-rose-300'}`}>
                      {s.status}
                    </span>
                  </div>

                  <button onClick={() => handleDeleteSlot(s.availability_id)} className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition">
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </div>))}
            </div>
          </div>
        </div>)}

      {/* TAB 4: PROFILE MANAGEMENT */}
      {activeTab === 'PROFILE' && (<form onSubmit={handleSaveProfile} className="max-w-2xl p-6 rounded-2xl bg-navy-900 border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white">Edit Establishment Profile</h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Provider Business Name
            </label>
            <input type="text" value={provName} onChange={(e) => setProvName(e.target.value)} required className="w-full px-3.5 py-2.5 rounded-xl bg-navy-850 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-primary"/>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Phone Number
            </label>
            <input type="text" value={provPhone} onChange={(e) => setProvPhone(e.target.value)} required className="w-full px-3.5 py-2.5 rounded-xl bg-navy-850 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-primary"/>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Full Physical Address
            </label>
            <input type="text" value={provAddress} onChange={(e) => setProvAddress(e.target.value)} required className="w-full px-3.5 py-2.5 rounded-xl bg-navy-850 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-primary"/>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Operating Hours Text
            </label>
            <input type="text" value={provHours} onChange={(e) => setProvHours(e.target.value)} required className="w-full px-3.5 py-2.5 rounded-xl bg-navy-850 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-primary"/>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Description
            </label>
            <textarea value={provDesc} onChange={(e) => setProvDesc(e.target.value)} rows={4} required className="w-full px-3.5 py-2.5 rounded-xl bg-navy-850 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-primary"/>
          </div>

          <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 text-white font-bold text-xs shadow-glow-indigo transition flex items-center gap-2">
            <Save className="w-4 h-4"/>
            <span>Save Profile Updates</span>
          </button>
        </form>)}
    </div>);
};
