import React, { useState } from 'react';
import { Lock, Mail, LogIn, AlertCircle, CheckCircle2, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import officialLogo from '../../assets/logo';

interface LoginPageProps {
  onShowSignup: () => void;
  signupMessage?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onShowSignup, signupMessage }) => {
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError('Please enter your User ID and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(identifier.trim(), password);
    } catch (err: any) {
      setError(err.message || 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans text-slate-900 antialiased">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden shadow-md mb-3">
            <img src={officialLogo} alt="Vitrum Glass" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vitrum Glass</h1>
          <span className="text-[11px] uppercase font-semibold text-slate-400 tracking-widest">
            ERP SYSTEM
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 animate-in fade-in zoom-in-95 duration-150">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">Sign In</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Use your email address or mobile number to access the application.
            </p>
          </div>

          {signupMessage && (
            <div className="mb-4 flex items-center gap-2 px-3 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {signupMessage}
            </div>
          )}

          {error && (
            <div className="mb-4 flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                User ID (Email or Mobile)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="you@vitrumglass.com or +91 90000 00000"
                  autoComplete="username"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                isSubmitting
                  ? 'bg-blue-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSubmitting ? (
                'Signing In...'
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={onShowSignup}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Create Account
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-6">
          Vitrum Glass ERP · Production Planning & Manufacturing Execution
        </p>
      </div>
    </div>
  );
};
