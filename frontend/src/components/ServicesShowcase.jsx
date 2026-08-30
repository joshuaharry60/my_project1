import React from 'react';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Thermometer, Anchor, Clock, ArrowRight, Package, CheckCircle2 } from 'lucide-react';

const SERVICES_DATA = [
  {
    icon: Truck,
    color: 'from-orange-500 to-amber-600',
    title: 'Interstate Heavy Haulage',
    tag: '36 STATES COVERAGE',
    desc: 'Heavy-duty Mack, Volvo, and Mercedes truck fleets connecting Apapa/Lagos to Abuja, Kano, PH, and Onitsha with 24/7 GPS highway monitoring.',
    features: ['Up to 45-Ton Flatbeds & Lowbeds', 'Interstate Waypoint Telemetry', 'Trained Drivers & Highway Security Escorts']
  },
  {
    icon: Thermometer,
    color: 'from-cyan-500 to-blue-600',
    title: 'Cold Storage & Pharma Transit',
    tag: 'CLIMATE CONTROLLED',
    desc: 'Refrigerated trucks equipped with live temperature sensors (-20°C to +8°C) for vaccines, FMCG perishables, and frozen goods across Nigeria.',
    features: ['Real-Time Temperature Monitoring', 'HACCP & NAFDAC Compliant', 'Backup Power Generator Refrigeration']
  },
  {
    icon: Anchor,
    color: 'from-blue-500 to-indigo-600',
    title: 'Apapa & Port Freight Clearance',
    tag: 'MARITIME LOGISTICS',
    desc: 'Fast-track container clearing, terminal movement, and port hinterland transport directly from Lagos Apapa, Tin Can, and Onne Ports.',
    features: ['Customs Documentation Assistance', '20ft & 40ft Container Transport', 'Demurrage Minimization Strategy']
  },
  {
    icon: Clock,
    color: 'from-green-500 to-emerald-600',
    title: 'Urban Last-Mile Express',
    tag: 'SAME-DAY DELIVERY',
    desc: 'Rapid urban express dispatch within metro Lagos, Abuja FCT, and Port Harcourt with live SMS recipient notification.',
    features: ['Sub-3 Hour Urban Transit', 'Electronic Proof of Delivery (e-POD)', 'Dedicated Dispatch Riders & Vans']
  }
];

const ServicesShowcase = ({ onOpenQuote }) => {
  return (
    <section className="py-20 bg-[#090D16] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-orange-500/20">
            INTELLIGENT LOGISTICS SOLUTIONS
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Built for Nigeria’s Dynamic Supply Chains
          </h2>
          <p className="text-slate-400 text-base mt-4">
            From Apapa port terminals to northern distribution hubs, B.Harry Logistics provides reliable, tech-driven freight services.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES_DATA.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card p-8 rounded-3xl relative overflow-hidden group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} p-3 text-white shadow-lg`}>
                      <Icon className="w-full h-full" />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {service.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {service.desc}
                  </p>

                  <ul className="space-y-2 mb-8">
                    {service.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-center gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={onOpenQuote}
                  className="w-full py-3 bg-slate-800/80 hover:bg-orange-500 text-slate-200 hover:text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-700 hover:border-orange-500"
                >
                  <span>Request Quote for {service.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ServicesShowcase;
