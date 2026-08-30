import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, X, Truck, ShieldCheck, ArrowRight, Check, Sparkles } from 'lucide-react';
import { calculateQuote } from '../services/api';

const NIGERIA_LOCATIONS = [
  { id: 'lagos', name: 'Lagos State (Apapa / Ikeja / Lekki)' },
  { id: 'abuja', name: 'Abuja FCT (Idu Industrial Hub)' },
  { id: 'portharcourt', name: 'Port Harcourt (Trans-Amadi, Rivers)' },
  { id: 'kano', name: 'Kano State (Sharada Phase II)' },
  { id: 'ibadan', name: 'Ibadan (Oyo State Interchange)' },
  { id: 'enugu', name: 'Enugu State (Central Depot)' },
  { id: 'benin', name: 'Benin City (Edo State Hub)' },
  { id: 'onitsha', name: 'Onitsha (Anambra Commercial Market)' },
  { id: 'calabar', name: 'Calabar (Cross River Port)' },
  { id: 'kaduna', name: 'Kaduna State Industrial Hub' },
];

const QuoteCalculatorModal = ({ isOpen, onClose, onBookWithQuote }) => {
  const [origin, setOrigin] = useState('lagos');
  const [destination, setDestination] = useState('abuja');
  const [serviceType, setServiceType] = useState('INTERSTATE');
  const [weightKg, setWeightKg] = useState(250);
  const [cargoValue, setCargoValue] = useState(500000);
  const [insurance, setInsurance] = useState(true);

  const [loading, setLoading] = useState(false);
  const [quoteResult, setQuoteResult] = useState(null);

  if (!isOpen) return null;

  const handleCalculate = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await calculateQuote({
        origin,
        destination,
        service_type: serviceType,
        weight_kg: weightKg,
        cargo_value: cargoValue,
        insurance,
      });
      setQuoteResult(res);
    } catch (err) {
      console.error('Quote calculation error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl my-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Instant Freight Cost Calculator</h2>
            <p className="text-xs text-slate-400">Accurate Nigerian Interstate & Intra-City Rates</p>
          </div>
        </div>

        <form onSubmit={handleCalculate} className="space-y-6">
          
          {/* Origin & Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Origin Hub (Nigeria)
              </label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-slate-900 text-white text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
              >
                {NIGERIA_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Destination Hub
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-900 text-white text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
              >
                {NIGERIA_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Service Type Options */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Logistics Service Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'INTERSTATE', label: 'Interstate Haulage' },
                { id: 'EXPRESS', label: 'Last-Mile Express' },
                { id: 'COLD_CHAIN', label: 'Cold Storage / Pharma' },
                { id: 'MARITIME', label: 'Apapa Port Clearance' },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setServiceType(st.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${serviceType === st.id ? 'bg-orange-500 text-white border-orange-400 shadow-md shadow-orange-500/20' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'}`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Weight & Value Sliders */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                <span>Cargo Weight (KG):</span>
                <span className="text-orange-400 font-bold text-sm">{weightKg} KG</span>
              </div>
              <input
                type="range"
                min="5"
                max="5000"
                step="25"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                <span>Declared Goods Value (NGN):</span>
                <span className="text-cyan-400 font-bold text-sm">₦{Number(cargoValue).toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="20000000"
                step="50000"
                value={cargoValue}
                onChange={(e) => setCargoValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>

          {/* Insurance Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-xs font-bold text-slate-200">Full Transit Insurance Coverage</div>
                <div className="text-[11px] text-slate-400">Covers loss, theft, & road damage up to declared value</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={insurance}
              onChange={(e) => setInsurance(e.target.checked)}
              className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? 'Calculating Best Route Rate...' : 'Compute Instant Quote'}
          </button>
        </form>

        {/* Calculated Result Display Card */}
        {quoteResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#111827] border border-orange-500/40 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Estimated Shipping Cost</div>
                <div className="text-3xl font-black text-white text-gradient-orange">
                  {quoteResult.formatted_amount}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Est. Delivery: <strong className="text-slate-200">{quoteResult.estimated_delivery_text}</strong> • Distance: {quoteResult.distance_km} km
                </div>
              </div>

              <button
                onClick={() => {
                  onBookWithQuote(quoteResult);
                  onClose();
                }}
                className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-green-600/30 flex items-center justify-center gap-2"
              >
                <span>Proceed to Book</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

      </motion.div>
    </div>
  );
};

export default QuoteCalculatorModal;
