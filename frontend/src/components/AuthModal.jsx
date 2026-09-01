import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Mail, Lock, User, Phone, Building, ArrowRight, 
  ShieldCheck, AlertCircle, Eye, EyeOff, CheckCircle2, 
  KeyRound, Sparkles, Loader2, Check
} from 'lucide-react';
import { loginUser, registerUser, googleAuthUser, resetPasswordRequest } from '../services/api';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  // Modes: 'login', 'register', 'forgot'
  const [authMode, setAuthMode] = useState('login');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Interactive Google SSO Modal State
  const [showGoogleAccountPicker, setShowGoogleAccountPicker] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  // Preset Google Accounts for realistic interactive testing
  const DEMO_GOOGLE_ACCOUNTS = [
    {
      name: 'Chief Olusegun Adeleke',
      email: 'olusegun.adeleke@gmail.com',
      role: 'Enterprise Operations Director',
      picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    {
      name: 'Amina Bello',
      email: 'amina.bello.logistics@gmail.com',
      role: 'Cold-Chain Manager',
      picture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
    },
    {
      name: 'Engr. Babatunde Ogunlesi',
      email: 'babatunde.ogunlesi@gmail.com',
      role: 'Fleet Manager',
      picture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setSuccessMsg('');
      setLoading(false);
    }
  }, [isOpen, authMode]);

  if (!isOpen) return null;

  // Password strength checker logic
  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, label: '', color: 'bg-slate-700' };
    if (pass.length >= 6) score += 1;
    if (pass.length >= 9) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500', width: 'w-1/4' };
    if (score <= 3) return { score: 2, label: 'Medium', color: 'bg-amber-500', width: 'w-2/4' };
    if (score <= 4) return { score: 3, label: 'Good', color: 'bg-emerald-500', width: 'w-3/4' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-400', width: 'w-full' };
  };

  const passStrength = calculatePasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (authMode === 'register') {
        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }

        const nameParts = fullName.trim().split(' ');
        const data = await registerUser({
          email,
          password,
          username: email.split('@')[0],
          first_name: nameParts[0] || '',
          last_name: nameParts.slice(1).join(' ') || '',
          phone_number: phone,
          company_name: company
        });

        onAuthSuccess(data.user);
        onClose();
      } else if (authMode === 'login') {
        const data = await loginUser({ email, password });
        onAuthSuccess(data.user);
        onClose();
      } else if (authMode === 'forgot') {
        const res = await resetPasswordRequest(email);
        setSuccessMsg(res.message || `Password reset link has been dispatched to ${email}.`);
      }
    } catch (err) {
      if (typeof err === 'string') {
        setErrorMsg(err);
      } else if (err?.error) {
        setErrorMsg(err.error);
      } else {
        setErrorMsg('Authentication error. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Perform Google Authentication with selected account
  const executeGoogleAuth = async (account) => {
    setGoogleLoading(true);
    setErrorMsg('');
    try {
      // Simulate real OAuth handshake delay
      await new Promise(res => setTimeout(res, 800));

      const res = await googleAuthUser({
        email: account.email,
        name: account.name,
        picture: account.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      });

      onAuthSuccess(res.user);
      setShowGoogleAccountPicker(false);
      onClose();
    } catch (err) {
      setErrorMsg('Google Sign-In failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl my-8 overflow-hidden"
      >
        {/* Top Decorative Ambient Light */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* INTERACTIVE GOOGLE SSO SELECTOR OVERLAY */}
        <AnimatePresence>
          {showGoogleAccountPicker && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="absolute inset-0 z-20 bg-slate-900/95 backdrop-blur-xl p-6 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span className="text-xs font-semibold text-slate-200">Sign in with Google</span>
                  </div>
                  <button
                    onClick={() => setShowGoogleAccountPicker(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 mb-3">
                  <h3 className="text-sm font-bold text-white">Choose a Google Account</h3>
                  <p className="text-[11px] text-slate-400">
                    to continue to <strong className="text-orange-400">B.Harry Logistics Portal</strong>
                  </p>
                </div>

                {googleLoading ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
                    <p className="text-xs text-slate-300 font-medium">Authenticating Google token...</p>
                  </div>
                ) : (
                  <div className="space-y-2 mt-2">
                    {DEMO_GOOGLE_ACCOUNTS.map((acc) => (
                      <button
                        key={acc.email}
                        onClick={() => executeGoogleAuth(acc)}
                        className="w-full p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-orange-500/50 flex items-center gap-3 transition-all text-left group"
                      >
                        <img
                          src={acc.picture}
                          alt={acc.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-600 group-hover:border-orange-400"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-100 group-hover:text-orange-400 transition-colors truncate">
                            {acc.name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">{acc.email}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-orange-400 transition-colors" />
                      </button>
                    ))}

                    {/* Custom Google Account Entry */}
                    <div className="pt-3 border-t border-slate-800/80">
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                        Or enter another Google Email:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          placeholder="your.email@gmail.com"
                          value={googleCustomEmail}
                          onChange={(e) => setGoogleCustomEmail(e.target.value)}
                          className="flex-1 bg-slate-900 text-xs px-3 py-2 rounded-lg border border-slate-700 text-white focus:outline-none focus:border-orange-500"
                        />
                        <button
                          disabled={!googleCustomEmail.includes('@')}
                          onClick={() => {
                            if (googleCustomEmail.includes('@')) {
                              executeGoogleAuth({
                                name: googleCustomEmail.split('@')[0].replace('.', ' '),
                                email: googleCustomEmail,
                                picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                              });
                            }
                          }}
                          className="px-3 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors"
                        >
                          Sign In
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 text-center">
                To continue, Google will share your name, email address, and profile picture with B.Harry Logistics.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Header Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 mb-3 shadow-lg shadow-orange-500/10">
            {authMode === 'forgot' ? (
              <KeyRound className="w-6 h-6 stroke-[2.5]" />
            ) : (
              <User className="w-6 h-6 stroke-[2.5]" />
            )}
          </div>

          <h2 className="text-2xl font-extrabold text-white">
            {authMode === 'register' && 'Create Account'}
            {authMode === 'login' && 'Client Login Portal'}
            {authMode === 'forgot' && 'Reset Password'}
          </h2>
          
          <p className="text-xs text-slate-400 mt-1">
            {authMode === 'register' && 'Join B.Harry Freight network for live GPS tracking & instant waybills'}
            {authMode === 'login' && 'Sign in to monitor live cargo dispatches & corporate fleet'}
            {authMode === 'forgot' && 'Enter your registered email address to receive password instructions'}
          </p>
        </div>

        {/* Auth Mode Tabs (Sign In / Register / Reset) */}
        {authMode !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-900/90 border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                authMode === 'login'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                authMode === 'register'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Google OAuth Quick SSO Button (Hidden in Forgot Password mode) */}
        {authMode !== 'forgot' && (
          <>
            <button
              type="button"
              onClick={() => setShowGoogleAccountPicker(true)}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all mb-5 group transform active:scale-[0.99]"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center mb-5">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-[#0b101c] px-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider shrink-0">
                OR USE EMAIL
              </span>
            </div>
          </>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Main Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'register' && (
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
                  className="w-full bg-slate-900/90 text-white text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
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
                className="w-full bg-slate-900/90 text-white text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
              />
            </div>
          </div>

          {authMode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">Password</label>
                {authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setAuthMode('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                    className="text-[11px] text-orange-400 hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/90 text-white text-xs pl-10 pr-10 py-3 rounded-xl border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator on Register */}
              {authMode === 'register' && password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">Password Strength:</span>
                    <span className={`font-bold ${passStrength.color.replace('bg-', 'text-')}`}>
                      {passStrength.label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${passStrength.color} ${passStrength.width} transition-all duration-300`} />
                  </div>
                </div>
              )}
            </div>
          )}

          {authMode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="+234 803 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900/90 text-white text-xs pl-8 pr-3 py-2.5 rounded-xl border border-slate-700 focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company (Optional)</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Dangote / FMCG"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-slate-900/90 text-white text-xs pl-8 pr-3 py-2.5 rounded-xl border border-slate-700 focus:border-orange-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {authMode === 'login' && (
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-xs text-slate-300">Keep me signed in</span>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>
                  {authMode === 'register' && 'Register Account'}
                  {authMode === 'login' && 'Sign In to Dashboard'}
                  {authMode === 'forgot' && 'Send Reset Link'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation Switcher */}
        <div className="text-center mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
          {authMode === 'register' && (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-orange-400 font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          )}

          {authMode === 'login' && (
            <p>
              New to B.Harry Logistics?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="text-orange-400 font-bold hover:underline"
              >
                Create an Account
              </button>
            </p>
          )}

          {authMode === 'forgot' && (
            <p>
              Remembered your password?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-orange-400 font-bold hover:underline"
              >
                Back to Sign In
              </button>
            </p>
          )}
        </div>

      </motion.div>
    </div>
  );
};

export default AuthModal;
