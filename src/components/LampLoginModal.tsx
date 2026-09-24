import React, { useState } from 'react';
import type { User } from 'firebase/auth';
import { X, Lock, KeyRound, Sparkles, Lightbulb, ArrowLeft, CheckCircle2, Eye, EyeOff, Home } from 'lucide-react';
import { register, requestPasswordReset, signIn } from '../lib/firebase';

interface LampLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const LampLoginModal: React.FC<LampLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [isLightOn, setIsLightOn] = useState(false);
  const [stringPulled, setStringPulled] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Forgot Password View State
  const [isForgotPasswordView, setIsForgotPasswordView] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Registration View State
  const [isRegisterView, setIsRegisterView] = useState(false);
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('+880');
  const [regOtp, setRegOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [regTitle, setRegTitle] = useState<'Mr' | 'Ms'>('Mr');
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleToggleLight = () => {
    setStringPulled(true);
    setTimeout(() => setStringPulled(false), 300);
    setIsLightOn((prev) => !prev);
  };

  const getAuthErrorMessage = (error: unknown) => {
    const code = (error as { code?: string }).code;
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') return 'Incorrect email address or password.';
    if (code === 'auth/email-already-in-use') return 'An account already exists for this email address.';
    if (code === 'auth/weak-password') return 'Choose a password with at least 9 characters.';
    if (code === 'auth/too-many-requests') return 'Too many attempts. Please try again later.';
    return 'Authentication is unavailable. Please try again.';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = username.trim();

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await signIn(email, password);
      setError(null);
      onLoginSuccess(user);
      onClose();
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await requestPasswordReset(forgotEmail.trim());
      setForgotSubmitted(true);
      setError(null);
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match!');
      return;
    }
    if (regPassword.length < 9) {
      setRegError('Use a password with at least 9 characters.');
      return;
    }

    setIsSubmitting(true);
    setRegError(null);
    const fullName = `${regFirstName} ${regLastName}`.trim() || regEmail || 'User';
    try {
      const user = await register(regEmail.trim(), regPassword, fullName);
      setRegSuccess(true);
      onLoginSuccess(user);
      setTimeout(resetAndClose, 1500);
    } catch (error) {
      setRegError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setIsForgotPasswordView(false);
    setForgotSubmitted(false);
    setForgotEmail('');
    setIsRegisterView(false);
    setRegSuccess(false);
    setRegEmail('');
    setRegMobile('+880');
    setRegOtp('');
    setOtpSent(false);
    setRegPassword('');
    setRegConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setRegTitle('Mr');
    setRegFirstName('');
    setRegLastName('');
    setRegError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      {/* Modal Card Container */}
      <div className={`relative w-full max-w-4xl bg-[#101112] border-2 border-stone-700 rounded-3xl p-6 sm:p-10 shadow-2xl transition-all duration-500 overflow-hidden ${
        isLightOn ? 'bg-gradient-to-r from-[#18191b] via-[#201d16] to-[#101112] border-amber-500/60 shadow-[0_0_80px_rgba(255,210,100,0.25)]' : ''
      }`}>

        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-7 sm:top-8 right-7 sm:right-8 z-20 text-stone-400 hover:text-white p-2.5 rounded-full bg-stone-900/90 border border-stone-700/80 hover:border-amber-400/80 hover:scale-105 transition-all cursor-pointer shadow-lg"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isRegisterView ? (
          /* ================= CREATE ACCOUNT SCREEN (Matches Screenshot) ================= */
          <div className="bg-white text-stone-900 rounded-2xl p-6 sm:p-8 max-w-lg mx-auto my-2 shadow-2xl relative animate-fade-in max-h-[82vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold tracking-wider text-center text-stone-900 font-sans uppercase">
              CREATE A NAHID VAULT ACCOUNT
            </h2>
            <div className="w-12 h-1 bg-red-600 mx-auto my-3 rounded-full" />

            {!regSuccess ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
                {/* 1. E-mail * */}
                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-1">
                    E-mail <span className="text-red-600 font-black">*</span>
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    className="w-full h-10 bg-white border border-stone-300 rounded px-3 text-stone-900 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 shadow-sm transition-all"
                  />
                </div>

                {/* Phone numbers are collected for future delivery updates, not authentication. */}
                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-1">
                    Mobile No. <span className="text-stone-500 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value)}
                    placeholder="Optional delivery contact number"
                    className="w-full h-10 bg-white border border-stone-300 rounded px-3 text-stone-900 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 shadow-sm transition-all"
                  />
                </div>

                {/* 4. Password * */}
                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-1">
                    Password <span className="text-red-600 font-black">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      className="w-full h-10 bg-white border border-stone-300 rounded pl-3 pr-10 text-stone-900 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 shadow-sm transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-stone-500 hover:text-stone-800 cursor-pointer"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 leading-tight">
                    The password should be at least 9 characters long and must contain at least one upper case letter, one lower case letter, a number and a special character(!, @, #, $, %, &, *)
                  </p>
                </div>

                {/* 5. Confirm Password * */}
                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-1">
                    Confirm Password <span className="text-red-600 font-black">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      required
                      className="w-full h-10 bg-white border border-stone-300 rounded pl-3 pr-10 text-stone-900 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 shadow-sm transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-stone-500 hover:text-stone-800 cursor-pointer"
                      title={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 6. Title * */}
                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-1">
                    Title <span className="text-red-600 font-black">*</span>
                  </label>
                  <div className="flex items-center gap-6 mt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-stone-800">
                      <input
                        type="radio"
                        name="title-radio"
                        value="Mr"
                        checked={regTitle === 'Mr'}
                        onChange={() => setRegTitle('Mr')}
                        className="w-4 h-4 accent-red-600"
                      />
                      <span>Mr</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-stone-800">
                      <input
                        type="radio"
                        name="title-radio"
                        value="Ms"
                        checked={regTitle === 'Ms'}
                        onChange={() => setRegTitle('Ms')}
                        className="w-4 h-4 accent-red-600"
                      />
                      <span>Ms</span>
                    </label>
                  </div>
                </div>

                {/* 7. First Name * */}
                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-1">
                    First Name <span className="text-red-600 font-black">*</span>
                  </label>
                  <input
                    type="text"
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    required
                    className="w-full h-10 bg-white border border-stone-300 rounded px-3 text-stone-900 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 shadow-sm transition-all"
                  />
                </div>

                {/* 8. Last Name * */}
                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-1">
                    Last Name <span className="text-red-600 font-black">*</span>
                  </label>
                  <input
                    type="text"
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    required
                    className="w-full h-10 bg-white border border-stone-300 rounded px-3 text-stone-900 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 shadow-sm transition-all"
                  />
                </div>

                {regError && (
                  <div className="p-2.5 bg-red-100 border border-red-300 text-red-700 text-xs font-medium rounded text-center">
                    {regError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-gradient-to-r from-[#baa13b] via-[#fff2a4] to-[#cbb23f] hover:brightness-110 text-stone-950 font-bold text-sm tracking-widest uppercase rounded-lg transition-all shadow-md active:scale-95 cursor-pointer mt-4"
                >
                  {isSubmitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                </button>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setIsRegisterView(false)}
                    className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">Account Created Successfully!</h3>
                <p className="text-sm text-stone-600">
                  Welcome to NAHID VAULT Club, <span className="font-bold text-stone-900">{regTitle} {regFirstName} {regLastName}</span>! Signing you in...
                </p>
              </div>
            )}
          </div>
        ) : isForgotPasswordView ? (
          /* ================= FORGOT PASSWORD SCREEN (Matches Screenshot) ================= */
          <div className="bg-white text-stone-900 rounded-2xl p-8 max-w-md mx-auto my-4 shadow-2xl relative animate-fade-in">
            <h2 className="text-2xl font-bold tracking-wider text-center text-stone-900 font-sans uppercase">
              FORGOT PASSWORD?
            </h2>
            <div className="w-12 h-1 bg-red-600 mx-auto my-3 rounded-full" />

            {!forgotSubmitted ? (
              <>
                <p className="text-center text-stone-700 text-sm leading-relaxed mb-6 font-medium">
                  Enter your email address and we will send you a password reset link.
                </p>

                <form onSubmit={handleForgotSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-stone-800 mb-2">
                      E-mail <span className="text-red-600 font-black">*</span>
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full h-12 bg-white text-stone-900 border border-stone-300 rounded-lg px-4 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm font-medium shadow-sm"
                    />
                  </div>

                  <button
                  type="submit"
                  disabled={isSubmitting}
                    className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-widest uppercase rounded-lg transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                  {isSubmitting ? 'SENDING...' : 'SUBMIT'}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPasswordView(false);
                      setForgotSubmitted(false);
                    }}
                    className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center justify-center gap-1.5 mx-auto transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">Reset Request Sent!</h3>
                <p className="text-sm text-stone-600">
                  We have sent a password reset link to <span className="font-bold text-stone-900">{forgotEmail}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPasswordView(false);
                    setForgotSubmitted(false);
                  }}
                  className="mt-4 px-6 py-2.5 bg-stone-900 text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-stone-800 transition-all cursor-pointer"
                >
                  Return to Login
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ================= MAIN LAMP LOGIN INTERFACE ================= */
          <>
            {/* Header Tag */}
            <div className="mb-6 flex items-center gap-2">
              <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Lamp Auth</span>
              </div>
              <span className="text-xs text-stone-400 hidden sm:inline">
                {isLightOn ? 'Light turned ON! Fill in details below.' : 'Pull string ball to illuminate login interface'}
              </span>
            </div>

            {/* Main Flex Layout: Lamp + Login Box */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 py-4">

              {/* ================= LAMP AREA ================= */}
              <div className="relative w-[280px] h-[320px] flex items-center justify-center select-none">
                
                {/* Lamp Container */}
                <div className="relative w-[230px] h-[300px]">

                  {/* Lamp Glow */}
                  <div
                    className={`absolute w-[320px] h-[320px] -left-[45px] -top-[40px] rounded-full pointer-events-none transition-opacity duration-500 ${
                      isLightOn ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      background: 'radial-gradient(circle, rgba(255,230,140,0.45), rgba(255,210,100,0.15), transparent 70%)',
                      filter: 'blur(16px)',
                    }}
                  />

                  {/* Lamp Shade */}
                  <div
                    className={`absolute w-[190px] h-[85px] top-[35px] left-[20px] rounded-t-[100px] rounded-b-[20px] transition-all duration-500 ${
                      isLightOn
                        ? 'bg-amber-100 shadow-[0_0_30px_rgba(255,245,180,0.9),0_0_60px_rgba(255,220,120,0.6)]'
                        : 'bg-[#555] shadow-none'
                    }`}
                  />

                  {/* Lamp Stick */}
                  <div className="absolute w-[15px] h-[190px] bg-[#eee] top-[115px] left-[108px] rounded-lg shadow-inner" />

                  {/* Lamp Base */}
                  <div className="absolute w-[130px] h-[15px] bg-[#eee] top-[295px] left-[50px] rounded-full shadow-md" />

                  {/* Switch String */}
                  <div
                    className="absolute w-[2px] bg-[#ddd] top-[110px] left-[165px] transition-all duration-200"
                    style={{ height: stringPulled ? '105px' : '90px' }}
                  />

                  {/* Switch Ball */}
                  <button
                    onClick={handleToggleLight}
                    className={`absolute w-[22px] h-[22px] bg-[#d6b18a] hover:bg-[#e8c39b] rounded-full left-[155px] cursor-pointer shadow-lg hover:scale-125 active:scale-90 transition-all duration-200 flex items-center justify-center border border-amber-700/40 group ${
                      stringPulled ? 'translate-y-4' : 'translate-y-0'
                    }`}
                    style={{ top: stringPulled ? '210px' : '195px' }}
                    title="Click/Pull to toggle light!"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-900/60" />
                  </button>

                  {/* Pull String Tooltip Hint */}
                  {!isLightOn && (
                    <div className="absolute top-[225px] left-[110px] bg-amber-400 text-black text-[11px] font-bold px-2.5 py-1 rounded-md shadow-lg animate-bounce pointer-events-none whitespace-nowrap z-10 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" />
                      <span>Pull string to turn ON!</span>
                    </div>
                  )}
                </div>

              </div>

              {/* ================= LOGIN BOX ================= */}
              <div
                className={`w-full max-w-[360px] p-8 rounded-3xl border transition-all duration-500 backdrop-blur-xl ${
                  isLightOn
                    ? 'opacity-100 visible translate-y-0 scale-100 bg-white/5 border-amber-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)]'
                    : 'opacity-0 invisible translate-y-8 scale-90 bg-stone-900/20 border-stone-800'
                }`}
              >
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-2 shadow-inner">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-wide">Welcome Back</h2>
                  <p className="text-[11px] text-stone-300 leading-relaxed mt-2 px-1">
                    Do you love <span className="text-amber-400 font-bold">NAHID VAULT</span>? You will love <span className="text-amber-400 font-bold">NAHID VAULT Club</span>! Sign in now for exclusive member discount coupons, early collection previews, and full order management.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase tracking-wider">
                      E-mail<span className="text-red-500 font-bold ml-0.5">*</span>
                    </label>

                    <div className="relative">
                      <input
                        type="email"
                        id="lamp-username-input"
                        name="username-login-field"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your email"
                        required
                        autoComplete="off"
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck={false}
                        className="w-full h-12 bg-white/10 text-white placeholder-stone-500 rounded-xl px-4 border border-stone-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase tracking-wider">
                      Password
                    </label>

                    <div className="relative">
                      <input
                        type="password"
                        id="lamp-password-input"
                        name="password-login-field"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                        required
                        autoComplete="new-password"
                        autoCapitalize="off"
                        autoCorrect="off"
                        className="w-full h-12 bg-white/10 text-white placeholder-stone-500 rounded-xl px-4 border border-stone-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all text-sm font-medium"
                      />
                      <KeyRound className="absolute right-3 top-3.5 w-4 h-4 text-stone-500 pointer-events-none" />
                    </div>

                    {/* Forgot Password Link */}
                    <div className="flex justify-end mt-1.5">
                      <button
                        type="button"
                        onClick={() => setIsForgotPasswordView(true)}
                        className="text-xs text-amber-400/90 hover:text-amber-300 hover:underline transition-colors cursor-pointer font-medium"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-300 font-medium text-center animate-shake">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    id="lamp-submit-login-btn"
                    disabled={isSubmitting}
                    className="w-full h-12 mt-2 rounded-xl text-stone-950 font-bold text-sm tracking-wide bg-gradient-to-r from-[#baa13b] via-[#fff2a4] to-[#cbb23f] hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
                  </button>

                  {/* Create Account Divider & Section */}
                  <div className="pt-4 mt-2 border-t border-stone-800/80 text-center space-y-2.5">
                    <p className="text-[11px] font-bold tracking-wider text-stone-300 uppercase">
                      DON'T HAVE A NAHID VAULT ACCOUNT?
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsRegisterView(true)}
                      className="w-full h-11 bg-gradient-to-r from-[#baa13b] via-[#fff2a4] to-[#cbb23f] hover:brightness-110 text-stone-950 font-bold text-xs tracking-widest uppercase rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>CREATE A NAHID VAULT ACCOUNT</span>
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
};
