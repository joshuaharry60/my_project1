import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, User, Phone, Building, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { loginUser, registerUser, googleAuthUser } from '../services/api';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        const nameParts = fullName.trim().split(' ');
        const data = await registerUser({
          email,
          password,
          username: username || email.split('@')[0],
          first_name: nameParts[0] || '',
          last_name: nameParts.slice(1).join(' ') || '',
          phone_number: phone,
          company_name: company
        });
        onAuthSuccess(data.user);
        onClose();
      } else {
        const data = await loginUser({ email, password });
        onAuthSuccess(data.user);
        onClose();
      }
    } catch (err) {
      if (typeof err === 'string') {
        setErrorMsg(err);
      } else if (err.error) {
        setErrorMsg(err.error);
      } else {
        setErrorMsg('Authentication error. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      // Prompt simulated Google Login modal or token verify
      const demoGoogleData = {
        email: email || 'client.enterprise@bharrylogistics.com',
        name: fullName || 'Chief Olusegun Adeleke',
        picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      };
      const res = await googleAuthUser(demoGoogleData);
      onAuthSuccess(res.user);
      onClose();
    } catch (err) {
      setErrorMsg('Google Sign-In failed.');
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
        className="relative w-full max-w-md glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl my-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 mb-3">
            <User className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {isRegister ? 'Create B.Harry Account' : 'Client Login Portal'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isRegister ? 'Access live GPS tracking & corporate quotes' : 'Sign in to manage active shipments & waybills'}
          </p>
        </div>

        {/* Google OAuth Quick Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-3 shadow-lg transition-all mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google Sign In</span>
        </button>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-[#111827] px-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            OR USE EMAIL & PASSWORD
          </span>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Chief Olusegun Adeleke"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-900 text-white text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="client@company.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 text-white text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 text-white text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>

          {isRegister && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+234 803 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 text-white text-xs px-3 py-3 rounded-xl border border-slate-700 focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company (Optional)</label>
                <input
                  type="text"
                  placeholder="Dangote / FMCG"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-900 text-white text-xs px-3 py-3 rounded-xl border border-slate-700 focus:border-orange-500 outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all mt-2"
          >
            {loading ? 'Authenticating...' : isRegister ? 'Register Account' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
          {isRegister ? 'Already have an account?' : 'New to B.Harry Logistics?'}
          {' '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMsg('');
            }}
            className="text-orange-400 font-bold hover:underline"
          >
            {isRegister ? 'Sign In' : 'Create an Account'}
          </button>
        </div>

      </motion.div>
    </div>
  );
};

export default AuthModal;
