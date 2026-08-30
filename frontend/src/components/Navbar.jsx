import React, { useState } from 'react';
import { Truck, ShieldCheck, MapPin, Calculator, User, LogOut, Menu, X, Search, ChevronRight } from 'lucide-react';

const Navbar = ({ onOpenAuth, onOpenQuote, onTrackCode, currentUser, onLogout, activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSearchCode, setNavSearchCode] = useState('');

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (navSearchCode.trim()) {
      onTrackCode(navSearchCode.trim());
      setNavSearchCode('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-[#ff6b00] to-[#ff8c00] text-white shadow-lg shadow-orange-500/30">
              <Truck className="w-6 h-6 stroke-[2.5]" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#00f2fe] rounded-full border-2 border-[#090D16]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white">B.HARRY</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30">LOGISTICS</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">NIGERIA HIGHWAY FREIGHT & TRACKING</p>
            </div>
          </div>

          {/* Quick Track Input in Navbar */}
          <form onSubmit={handleNavSearch} className="hidden md:flex items-center relative w-64 lg:w-80">
            <input
              type="text"
              placeholder="Track code (e.g. BHL-NG-88492)"
              value={navSearchCode}
              onChange={(e) => setNavSearchCode(e.target.value)}
              className="w-full bg-slate-900/80 text-white text-xs px-4 py-2.5 rounded-full border border-slate-700/80 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder-slate-400 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 p-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Nav Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => setActiveTab('home')}
              className={`text-sm font-medium transition-colors ${activeTab === 'home' ? 'text-orange-400' : 'text-slate-300 hover:text-white'}`}
            >
              Live Tracker
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`text-sm font-medium transition-colors ${activeTab === 'services' ? 'text-orange-400' : 'text-slate-300 hover:text-white'}`}
            >
              Services
            </button>
            <button
              onClick={() => setActiveTab('coverage')}
              className={`text-sm font-medium transition-colors ${activeTab === 'coverage' ? 'text-orange-400' : 'text-slate-300 hover:text-white'}`}
            >
              Fleet Network
            </button>
            
            <button
              onClick={onOpenQuote}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:border-orange-500/50"
            >
              <Calculator className="w-4 h-4 text-orange-400" />
              Quote Estimator
            </button>

            {currentUser ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 text-xs font-medium text-slate-200 hover:bg-slate-700"
                >
                  {currentUser.profile_picture ? (
                    <img src={currentUser.profile_picture} alt="Avatar" className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-orange-400" />
                  )}
                  <span>{currentUser.first_name || currentUser.username}</span>
                </button>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <User className="w-4 h-4" />
                <span>Client Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenQuote}
              className="p-2 bg-slate-800 text-orange-400 rounded-lg text-xs font-semibold"
            >
              <Calculator className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-t border-slate-800 px-4 pt-4 pb-6 space-y-4">
          <form onSubmit={handleNavSearch} className="relative">
            <input
              type="text"
              placeholder="Track code (e.g. BHL-NG-88492)"
              value={navSearchCode}
              onChange={(e) => setNavSearchCode(e.target.value)}
              className="w-full bg-slate-900 text-white text-xs px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-2.5 px-3 py-1 bg-orange-500 text-white rounded-lg text-xs"
            >
              Track
            </button>
          </form>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
            >
              Live Tracker
            </button>
            <button
              onClick={() => { setActiveTab('services'); setMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
            >
              Services
            </button>
            <button
              onClick={() => { setActiveTab('coverage'); setMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
            >
              Fleet Network
            </button>
            <button
              onClick={() => { onOpenQuote(); setMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-lg text-sm text-orange-400 hover:bg-slate-800 font-semibold"
            >
              Instant Cost Calculator
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800">
            {currentUser ? (
              <div className="flex items-center justify-between">
                <button
                  onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 text-sm text-slate-200"
                >
                  <User className="w-4 h-4 text-orange-400" />
                  <span>{currentUser.first_name || currentUser.username}</span>
                </button>
                <button onClick={onLogout} className="text-xs text-red-400">Sign Out</button>
              </div>
            ) : (
              <button
                onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl text-center text-sm shadow-lg shadow-orange-500/30"
              >
                Client Login / Register
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
