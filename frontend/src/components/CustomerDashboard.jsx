import React, { useState } from 'react';
import { User, Package, Clock, MapPin, Plus, CheckCircle, ArrowRight, ShieldCheck, PhoneCall, RefreshCw } from 'lucide-react';

const CustomerDashboard = ({ currentUser, shipments, onTrackCode, onOpenQuote }) => {
  const [filter, setFilter] = useState('ALL');

  const filteredShipments = filter === 'ALL'
    ? shipments
    : shipments.filter(s => s.status === filter);

  return (
    <div className="pt-28 pb-20 bg-[#090D16] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Welcome Banner */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl mb-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              {currentUser?.profile_picture ? (
                <img src={currentUser.profile_picture} alt="User" className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-500" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center text-2xl font-bold">
                  {currentUser?.first_name ? currentUser.first_name[0] : 'U'}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#090D16]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">
                  Welcome, {currentUser?.first_name || currentUser?.username || 'Valued Client'}
                </h1>
                {currentUser?.is_google_account && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Google Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                {currentUser?.email} • Client ID: BHL-CLIENT-{(currentUser?.id || 1042)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenQuote}
              className="px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Book New Shipment</span>
            </button>
          </div>
        </div>

        {/* User Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Active In-Transit</div>
            <div className="text-3xl font-extrabold text-orange-400">
              {shipments.filter(s => s.status === 'IN_TRANSIT' || s.status === 'OUT_FOR_DELIVERY').length}
            </div>
            <div className="text-[11px] text-slate-500 mt-2">Monitored 24/7 via GPS</div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Completed</div>
            <div className="text-3xl font-extrabold text-green-400">
              {shipments.filter(s => s.status === 'DELIVERED').length + 12}
            </div>
            <div className="text-[11px] text-slate-500 mt-2">Successful Deliveries</div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Saved Addresses</div>
            <div className="text-3xl font-extrabold text-cyan-400">
              4 Locations
            </div>
            <div className="text-[11px] text-slate-500 mt-2">Lagos, Abuja, PH, Kano</div>
          </div>
        </div>

        {/* Shipment History Table */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-400" />
              <span>Your Waybill & Freight Records</span>
            </h2>

            <div className="flex items-center gap-2">
              {['ALL', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${filter === st ? 'bg-orange-500 text-white border-orange-400' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-4">Waybill Code</th>
                  <th className="pb-3 px-4">Route</th>
                  <th className="pb-3 px-4">Service Type</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4">ETA</th>
                  <th className="pb-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredShipments.map((s) => (
                  <tr key={s.tracking_code} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-orange-400">
                      {s.tracking_code}
                    </td>
                    <td className="py-4 px-4 font-semibold text-white">
                      {s.origin_city} ➔ {s.destination_city}
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {s.service_type}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${s.status === 'IN_TRANSIT' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : s.status === 'OUT_FOR_DELIVERY' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {new Date(s.estimated_delivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => onTrackCode(s.tracking_code)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-orange-500 hover:text-white text-orange-400 font-bold rounded-lg transition-all"
                      >
                        View Live Map
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CustomerDashboard;
