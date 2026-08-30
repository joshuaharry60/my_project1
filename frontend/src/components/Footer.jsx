import React from 'react';
import { Truck, MapPin, Phone, Mail, ShieldCheck, ArrowRight, Heart } from 'lucide-react';

const Footer = ({ onOpenQuote }) => {
  return (
    <footer className="bg-[#05080E] text-slate-400 text-xs border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black">
                <Truck className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                B.HARRY LOGISTICS
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Nigeria’s premier tech-enabled freight and logistics platform. Specializing in heavy interstate haulage, cold chain pharma, and port container freight tracking.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20 w-fit">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Django API & Render/Vercel Ready
            </div>
          </div>

          {/* Col 2: Nigerian Hubs */}
          <div>
            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-4">
              Regional Operations
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>Lagos HQ: Commercial Ave, Apapa Maritime Zone</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>Abuja Hub: Idu Industrial Park, FCT</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>PH Hub: Trans-Amadi Complex, Rivers State</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Services */}
          <div>
            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-4">
              Logistics Services
            </h4>
            <ul className="space-y-2">
              <li><a href="#services" className="hover:text-orange-400 transition-colors">Interstate Heavy Haulage</a></li>
              <li><a href="#services" className="hover:text-orange-400 transition-colors">Apapa & Tin Can Container Freight</a></li>
              <li><a href="#services" className="hover:text-orange-400 transition-colors">Cold Storage Pharma Logistics</a></li>
              <li><a href="#services" className="hover:text-orange-400 transition-colors">Urban Same-Day Express Delivery</a></li>
              <li><button onClick={onOpenQuote} className="text-orange-400 hover:underline font-semibold">Instant Freight Rate Estimator</button></li>
            </ul>
          </div>

          {/* Col 4: Dispatch Contact */}
          <div>
            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-4">
              24/7 Dispatch Control
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400" />
                <span className="text-white font-mono">+234 1 890 4455</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400" />
                <span>dispatch@bharrylogistics.com</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="text-[11px] font-medium text-slate-300 mb-2">Subscribe to Freight Bulletins</div>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="enter company email"
                  className="w-full bg-slate-900 text-white text-xs px-3 py-2 rounded-lg border border-slate-800 outline-none"
                />
                <button className="px-3 py-2 bg-orange-500 text-white font-bold rounded-lg text-xs hover:bg-orange-600">
                  Join
                </button>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} B.Harry Logistic Services Nigeria Ltd. All Rights Reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Terms of Carriage</span>
            <span>Privacy Policy</span>
            <span>NAFDAC & Customs Compliance</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
