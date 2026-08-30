import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Building2, CheckCircle } from 'lucide-react';

const HUBS = [
  {
    id: 'lagos',
    city: 'Lagos Headquarters',
    zone: 'South-West Hub',
    address: 'Plot 14, Commercial Avenue, Apapa Maritime Zone & Ikeja Cargo Depot',
    phone: '+234 1 890 4455 / +234 803 123 4567',
    email: 'lagos.depot@bharryl.com',
    fleetCount: '140+ Mack Heavy Trailers & Vans',
    coordinates: '6.4474° N, 3.3582° E'
  },
  {
    id: 'abuja',
    city: 'Abuja Regional Depot',
    zone: 'North-Central Hub',
    address: 'Block B4, Idu Industrial Park Extension, Abuja FCT',
    phone: '+234 9 400 1122',
    email: 'abuja.hub@bharryl.com',
    fleetCount: '85+ Interstate Articulated Trailers',
    coordinates: '9.0765° N, 7.3986° E'
  },
  {
    id: 'portharcourt',
    city: 'Port Harcourt Hub',
    zone: 'South-South Hub',
    address: 'Trans-Amadi Industrial Complex, Port Harcourt, Rivers State',
    phone: '+234 84 330 998',
    email: 'ph.depot@bharryl.com',
    fleetCount: '60+ Cold Chain & Oilfield Trailers',
    coordinates: '4.8156° N, 7.0498° E'
  },
  {
    id: 'kano',
    city: 'Kano Distribution Hub',
    zone: 'North-West Hub',
    address: 'Sharada Industrial Estate Phase II, Kano State',
    phone: '+234 64 200 887',
    email: 'kano.hub@bharryl.com',
    fleetCount: '50+ Heavy Grain & Commodity Fleet',
    coordinates: '12.0022° N, 8.5920° E'
  },
  {
    id: 'onitsha',
    city: 'Onitsha Freight Depot',
    zone: 'South-East Hub',
    address: 'Asaba-Onitsha Expressway Logistics Park, Anambra State',
    phone: '+234 802 887 6655',
    email: 'onitsha.depot@bharryl.com',
    fleetCount: '45+ Interstate Haulage Trailers',
    coordinates: '6.1499° N, 6.7858° E'
  }
];

const FleetCoverageMap = () => {
  const [selectedHub, setSelectedHub] = useState(HUBS[0]);

  return (
    <section className="py-20 bg-[#090D16] border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-cyan-500/20">
            NIGERIAN FLEET INFRASTRUCTURE
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Strategic Logistics Depots Across Nigeria
          </h2>
          <p className="text-slate-400 text-base mt-4">
            Our nationwide network of physical logistics hubs ensures continuous maintenance, fuel backup, and rapid transit response.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Hub Selector Buttons */}
          <div className="space-y-3">
            {HUBS.map((hub) => (
              <button
                key={hub.id}
                onClick={() => setSelectedHub(hub)}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${selectedHub.id === hub.id ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/10 border-orange-500/50 shadow-lg' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'}`}
              >
                <div>
                  <div className={`font-bold text-sm ${selectedHub.id === hub.id ? 'text-orange-400' : 'text-white'}`}>
                    {hub.city}
                  </div>
                  <div className="text-xs text-slate-400">{hub.zone}</div>
                </div>
                <MapPin className={`w-5 h-5 ${selectedHub.id === hub.id ? 'text-orange-400' : 'text-slate-600'}`} />
              </button>
            ))}
          </div>

          {/* Active Hub Detailed Card */}
          <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    {selectedHub.zone}
                  </span>
                  <h3 className="text-2xl font-extrabold text-white mt-2">
                    {selectedHub.city}
                  </h3>
                </div>
                <div className="text-right text-xs font-mono text-slate-400">
                  <div>GPS: {selectedHub.coordinates}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Hub Facility Address</div>
                  <div className="text-sm font-medium text-slate-200">{selectedHub.address}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Stationed Fleet Capacity</div>
                  <div className="text-sm font-bold text-orange-400">{selectedHub.fleetCount}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Direct Depot Phone</div>
                  <div className="text-sm font-medium text-slate-200">{selectedHub.phone}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Dispatch Email</div>
                  <div className="text-sm font-medium text-slate-200">{selectedHub.email}</div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-400" />
                24/7 Security Patrol & Weighbridge Operational
              </span>
              <span className="hidden sm:inline">B.Harry Logistics Depot Network</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default FleetCoverageMap;
