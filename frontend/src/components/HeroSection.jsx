import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, Zap, Truck, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';

const HeroSection = ({ onSearchTrack, onOpenQuote }) => {
  const [inputCode, setInputCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      onSearchTrack(inputCode.trim());
    }
  };

  const handleQuickSample = (sampleCode) => {
    setInputCode(sampleCode);
    onSearchTrack(sampleCode);
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-grid-pattern">
      {/* Glow Backdrop Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-orange-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-orange-500/30 mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-orange-400 animate-ping" />
            <span className="text-xs font-semibold tracking-wide uppercase text-orange-400">
              LIVE GPS HIGHWAY TELEMETRY • NIGERIA WIDE
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6"
          >
            Precision Logistics & <br className="hidden sm:inline" />
            <span className="text-gradient-orange">Live Nigerian Highway</span> Freight
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-10"
          >
            B.Harry Logistic Services guarantees secure interstate haulage, cold chain pharma transit, and last-mile urban express with real-time waypoint telemetry.
          </motion.p>

          {/* Real-time Tracking Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto glass-panel p-3 sm:p-4 rounded-2xl border border-slate-700/80 shadow-2xl mb-8"
          >
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
                <input
                  type="text"
                  placeholder="Enter Waybill / Tracking Code (e.g. BHL-NG-88492)"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="w-full bg-slate-900/90 text-white font-medium text-sm sm:text-base pl-12 pr-4 py-4 rounded-xl border border-slate-700 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 placeholder-slate-400 transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <Search className="w-5 h-5" />
                <span>Track Live Route</span>
              </button>
            </form>

            {/* Quick Demo Code Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs">
              <span className="text-slate-400 font-medium">Quick Demo Samples:</span>
              <button
                onClick={() => handleQuickSample('BHL-NG-88492')}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-orange-500/20 hover:text-orange-400 text-slate-300 border border-slate-700/80 transition-colors"
              >
                BHL-NG-88492 (Lagos ➔ Abuja)
              </button>
              <button
                onClick={() => handleQuickSample('BHL-NG-90144')}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-orange-500/20 hover:text-orange-400 text-slate-300 border border-slate-700/80 transition-colors"
              >
                BHL-NG-90144 (PH ➔ Kano Cold Chain)
              </button>
              <button
                onClick={() => handleQuickSample('BHL-NG-31088')}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-orange-500/20 hover:text-orange-400 text-slate-300 border border-slate-700/80 transition-colors"
              >
                BHL-NG-31088 (Lagos Express)
              </button>
            </div>
          </motion.div>

          {/* Quick Action CTA */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenQuote}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
            >
              <span>Instant Freight Calculator</span>
              <ArrowRight className="w-4 h-4 text-orange-400" />
            </button>
          </div>

        </div>

        {/* Operational Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-10 border-t border-slate-800/80">
          <div className="glass-card p-6 rounded-2xl text-center">
            <div className="text-3xl sm:text-4xl font-black text-white mb-1">99.8%</div>
            <div className="text-xs text-orange-400 font-semibold uppercase tracking-wider">On-Time Arrival</div>
            <div className="text-[11px] text-slate-400 mt-1">Interstate Highways</div>
          </div>
          <div className="glass-card p-6 rounded-2xl text-center">
            <div className="text-3xl sm:text-4xl font-black text-white mb-1">36 States</div>
            <div className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">Full Coverage</div>
            <div className="text-[11px] text-slate-400 mt-1">Lagos to Maiduguri</div>
          </div>
          <div className="glass-card p-6 rounded-2xl text-center">
            <div className="text-3xl sm:text-4xl font-black text-white mb-1">50,000+</div>
            <div className="text-xs text-orange-400 font-semibold uppercase tracking-wider">Tons Delivered</div>
            <div className="text-[11px] text-slate-400 mt-1">FMCG & Industrial</div>
          </div>
          <div className="glass-card p-6 rounded-2xl text-center">
            <div className="text-3xl sm:text-4xl font-black text-white mb-1">24/7</div>
            <div className="text-xs text-green-400 font-semibold uppercase tracking-wider">GPS Telemetry</div>
            <div className="text-[11px] text-slate-400 mt-1">Driver Communications</div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
