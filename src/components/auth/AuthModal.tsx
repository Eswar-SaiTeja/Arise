import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBrand } from '../../context/BrandContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, signup, loginDemo } = useAuth();
  const { currentTheme } = useBrand();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isForgotPassword) {
      setResetSent(true);
      setTimeout(() => {
        setResetSent(false);
        setIsForgotPassword(false);
      }, 2500);
      return;
    }

    if (isSignUp) {
      await signup(email, fullName || 'New Athlete');
    } else {
      await login(email);
    }
    onClose();
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-[#141923] border border-[#252D3E] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.accentColor}, ${currentTheme.secondaryAccent})`,
              boxShadow: `0 0 16px -2px ${currentTheme.glowColor}`
            }}
          >
            <Zap className="w-6 h-6 text-black fill-black" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white font-display tracking-tight">{currentTheme.name}</h2>
            <p className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">
              {currentTheme.tagline}
            </p>
          </div>
        </div>

        {/* Mode Switch Tabs */}
        {!isForgotPassword && (
          <div className="flex rounded-xl bg-[#0E121A] p-1 border border-[#252D3E]">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                !isSignUp ? 'bg-lime-accent text-black shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                isSignUp ? 'bg-lime-accent text-black shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Reset Password Feedback */}
        {resetSent && (
          <div className="p-3.5 rounded-xl bg-lime-accent/10 border border-lime-accent/30 text-lime-accent text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Password reset link sent to your email address.</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="text-xs font-mono text-gray-400 uppercase block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alexander Kane"
                  className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-accent"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-mono text-gray-400 uppercase block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@training.fit"
                className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-accent"
              />
            </div>
          </div>

          {!isForgotPassword && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono text-gray-400 uppercase">Password</label>
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-[11px] font-mono text-lime-accent hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-accent"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-lime-accent hover:bg-lime-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-glow-lime"
          >
            <span>{isForgotPassword ? 'SEND RECOVERY LINK' : isSignUp ? 'START ATHLETE JOURNEY' : 'ENTER PLATFORM'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {isForgotPassword && (
          <div className="text-center">
            <button
              onClick={() => setIsForgotPassword(false)}
              className="text-xs text-gray-400 hover:text-white"
            >
              ← Back to Sign In
            </button>
          </div>
        )}

        {/* 1-Click Demo Profiles */}
        <div className="pt-4 border-t border-[#252D3E] space-y-2">
          <span className="text-[10px] font-mono text-gray-400 uppercase block text-center">
            Instant Demo Sign-In
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                loginDemo('athlete');
                onClose();
              }}
              className="p-2.5 rounded-xl bg-[#181E2B] hover:bg-white/5 border border-[#252D3E] text-xs font-mono font-semibold text-gray-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-lime-accent" />
              <span>Demo Athlete</span>
            </button>

            <button
              onClick={() => {
                loginDemo('admin');
                onClose();
              }}
              className="p-2.5 rounded-xl bg-[#181E2B] hover:bg-white/5 border border-purple-500/30 text-xs font-mono font-semibold text-purple-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
