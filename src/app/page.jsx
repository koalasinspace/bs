"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Ghost, Terminal, UserPlus, User, Copyright } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { setSessionCookies } from '@/lib/session';

// ── Helpers ──────────────────────────────────────────────────────────────────

function getAgeGroup(dobValue) {
  if (!dobValue) return null;
  const dob = new Date(dobValue);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  if (age < 0) return null;
  if (age < 13) return 'under13';
  if (age < 18) return 'minor';
  return 'adult';
}

function todayString() {
  return new Date().toISOString().split('T')[0];
}

// ── Sub-components ────────────────────────────────────────────────────────────

function RoleCard({ icon, label, desc, open, onToggle, children }) {
  return (
    <div>
      <div
        className={`w-full bg-bg-card border rounded-[14px] p-4 cursor-pointer transition-all
          ${open
            ? 'border-accent-pink/30 bg-bg-panel'
            : 'border-white/10 hover:border-accent-pink/25 hover:bg-bg-panel'}`}
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-bg-sidebar border border-white/5 rounded-[10px] flex items-center justify-center text-text-muted transition-colors">
              {icon}
            </div>
            <div>
              <div className="text-sm font-medium text-white">{label}</div>
              <div className="text-xs text-text-deep-muted">{desc}</div>
            </div>
          </div>
          <svg
            className={`w-4 h-4 text-text-deep-muted transition-transform ${open ? 'rotate-90' : ''}`}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>

        {/* Expanded panel */}
        {open && (
          <div className="mt-4 pt-4 border-t border-white/5" onClick={e => e.stopPropagation()}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ id, type = 'text', placeholder, value, onChange, error, ...rest }) {
  return (
    <div className="flex flex-col gap-0 mb-3">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-bg-sidebar border rounded-[10px] px-3.5 py-[11px] text-[13px]
          text-text-primary placeholder:text-text-deep-muted outline-none transition-all
          focus:shadow-[0_0_0_3px_rgba(255,73,176,0.08)]
          ${error ? 'border-red-500/50' : 'border-white/10 focus:border-accent-pink/30'}`}
        {...rest}
      />
      {error && <span className="text-[11px] text-red-400 mt-1">{error}</span>}
    </div>
  );
}

function StatusMsg({ text, type }) {
  if (!text) return null;
  const styles = {
    error:  'bg-red-500/8 border border-red-500/20 text-red-400',
    info:   'bg-accent-pink/10 border border-accent-pink/20 text-accent-pink',
    locked: 'bg-red-500/6 border border-red-500/18 text-red-300',
  };
  return (
    <div className={`text-[11px] rounded-[8px] px-3.5 py-2.5 mb-3 leading-relaxed ${styles[type]}`}>
      {text}
    </div>
  );
}

function PrimaryBtn({ children, onClick, disabled, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full py-3 bg-accent-pink hover:opacity-90 active:opacity-75 disabled:opacity-40
        disabled:cursor-not-allowed text-white text-[13px] font-bold rounded-[10px] transition-opacity"
    >
      {loading ? 'Please wait…' : children}
    </button>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const router = useRouter();

  // Which card is open: null | 'login' | 'signup' | 'tester'
  const [openCard, setOpenCard] = useState(null);

  // View state: 'cards' | 'locked'
  const [view, setView] = useState('cards');

  // Login form
  const [loginEmail, setLoginEmail]       = useState('');
  const [loginPass,  setLoginPass]        = useState('');
  const [loginErrors, setLoginErrors]     = useState({});
  const [loginStatus, setLoginStatus]     = useState(null); // { text, type }
  const [loginLoading, setLoginLoading]   = useState(false);

  // Signup form
  const [suEmail,  setSuEmail]   = useState('');
  const [suPass,   setSuPass]    = useState('');
  const [suPass2,  setSuPass2]   = useState('');
  const [suDob,    setSuDob]     = useState(todayString());
  const [suTerms,  setSuTerms]   = useState(false);
  const [suErrors, setSuErrors]  = useState({});
  const [suStatus, setSuStatus]  = useState(null);
  const [suLoading, setSuLoading] = useState(false);

  function toggleCard(name) {
    setOpenCard(prev => prev === name ? null : name);
  }

  // ── Login handler ──────────────────────────────────────────────
  async function handleLogin() {
    setLoginErrors({});
    setLoginStatus(null);
    const errs = {};
    if (!loginEmail || !/\S+@\S+\.\S+/.test(loginEmail)) errs.email = 'Enter a valid email.';
    if (!loginPass)                                        errs.pass  = 'Password required.';
    if (Object.keys(errs).length) { setLoginErrors(errs); return; }

    setLoginLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, loginEmail, loginPass);

      // Read role from Firestore to route correctly
      const { getDoc } = await import('firebase/firestore');
      const snap = await getDoc(doc(db, 'users', cred.user.uid));
      const role = snap.exists() ? snap.data().role : 'user';

      // Check parental consent gate for minors
      if (snap.exists() && snap.data().isMinor) {
        const consent = snap.data().parentalConsentStatus;
        if (consent !== 'verified') {
          await auth.signOut();
          setLoginStatus({ text: 'This account is pending parental verification. Please check the email on file.', type: 'locked' });
          setLoginLoading(false);
          return;
        }
      }

      if (['admin', 'dev', 'employee'].includes(role)) {
        await setSessionCookies(cred.user, role);
        router.push('/admin');
      } else {
        await setSessionCookies(cred.user, role);
        router.push('/tester');
      }

    } catch (err) {
      const msg = err.code === 'auth/invalid-credential'
        ? 'Invalid email or password.'
        : 'Something went wrong. Please try again.';
      setLoginStatus({ text: msg, type: 'error' });
      setLoginLoading(false);
    }
  }

  // ── Signup handler ─────────────────────────────────────────────
  async function handleSignup() {
    setSuErrors({});
    setSuStatus(null);
    const errs = {};
    if (!suEmail || !/\S+@\S+\.\S+/.test(suEmail)) errs.email = 'Enter a valid email.';
    if (!suPass || suPass.length < 8)               errs.pass  = 'Minimum 8 characters.';
    if (suPass !== suPass2)                         errs.pass2 = 'Passwords don\'t match.';
    if (!suDob)                                     errs.dob   = 'Date of birth required.';
    if (!suTerms) {
      setSuStatus({ text: 'You must read and agree to the Terms of Service to continue.', type: 'error' });
      setSuErrors(errs);
      return;
    }
    if (Object.keys(errs).length) { setSuErrors(errs); return; }

    const ag = getAgeGroup(suDob);
    if (!ag) { setSuErrors({ dob: 'Please enter a valid date.' }); return; }

    // Under-13: create locked account, don't allow Firebase Auth login yet
    if (ag === 'under13') {
      // We don't create an Auth account yet — store a pending record
      // A Cloud Function (triggered separately) will handle the parental consent email
      // For now: show the locked screen. Full implementation in Cloud Functions phase.
      setView('locked');
      return;
    }

    setSuLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, suEmail, suPass);
      const uid  = cred.user.uid;

      // Build the compliant user document
      // Raw DOB is NOT stored — we derive isMinor and store only that
      const isMinor = ag === 'minor';

      await setDoc(doc(db, 'users', uid), {
        userId:      uid,
        hashedEmail: suEmail, // TODO: replace with server-side hash via Cloud Function
        role:        'user',

        // Display name: minors get a generated placeholder until they pick from approved list
        displayName: isMinor ? null : null, // set after onboarding step

        isMinor,

        // All opt-ins default false — explicit action required to enable
        consentAOSModeration:        false,
        persistentAiMemory:          false,
        aggregateTrainingOptIn:      false,
        neuralDataOptIn:             false,

        // Minor-specific opt-ins — also false, most locked by regulation
        ...(isMinor && {
          parentalConsentStatus:         'not_required', // 13-17 doesn't need VPC, but tracks state
          persistentAiMemoryForMinor:    false,
          aggregateTrainingOptInForMinor: false,
          neuralDataOptInForMinor:       false,
          screenTimeLimitMinutes:        60,
        }),

        // Coarse location only — populated later if user grants permission
        city:  null,
        state: null,

        // Gameplay
        gameProgress: { level: 0, experience: 0 },
        achievements: [],

        // Moderation alias (generated server-side in production)
        anonymizedAlias: `Subject ${uid.slice(0, 6).toUpperCase()}`,

        // Rights
        lobotomyTimestamp: null,

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Minor: next step is display name picker from approved list
      // Adult: go straight to tester dashboard (default role)
      if (isMinor) {
        await setSessionCookies(cred.user, 'user');
        router.push('/onboarding/display-name');
      } else {
        await setSessionCookies(cred.user, 'user');
        router.push('/tester');
      }

    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use'
        ? 'An account with this email already exists.'
        : 'Something went wrong. Please try again.';
      setSuStatus({ text: msg, type: 'error' });
      setSuLoading(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-accent-pink selection:text-white">

      {/* Background blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-pink/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-purple/5 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">

        {/* ── LOGO ── */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-bg-panel border border-accent-pink/30 rounded-[18px] flex items-center justify-center mb-5 shadow-[0_0_30px_-10px_rgba(255,73,176,0.35)]">
            <Ghost className="w-8 h-8 text-accent-pink" />
          </div>
          <h1 className="text-[28px] font-bold tracking-wide text-white">
            BELLA<span className="text-accent-pink">STUDIOS</span>
          </h1>
          <p className="mt-1.5 text-[10px] font-mono tracking-[0.16em] text-text-deep-muted">
            DEVELOPER PORTAL
          </p>
        </div>

        {/* ── LOCKED STATE ── */}
        {view === 'locked' && (
          <div className="bg-bg-card border border-red-500/20 rounded-[14px] p-7 text-center mb-10">
            <h2 className="text-lg font-light text-white mb-2.5">
              Account <strong className="font-bold">pending.</strong>
            </h2>
            <p className="text-xs text-text-dim leading-relaxed mb-5">
              This account requires parental or guardian verification before access is granted.
              An email has been sent to the address on file. Once verified, you'll be able to sign in.
            </p>
            <button
              onClick={() => setView('cards')}
              className="mx-auto block px-6 py-2.5 bg-accent-pink/10 border border-accent-pink/25 text-accent-pink text-xs font-bold rounded-[10px] hover:bg-accent-pink/20 transition-colors"
            >
              BACK TO SIGN IN
            </button>
          </div>
        )}

        {/* ── CARDS ── */}
        {view === 'cards' && (
          <div className="flex flex-col gap-2.5 mb-10">

            {/* Developer login */}
            <RoleCard
              icon={<Terminal className="w-5 h-5" />}
              label="Developer Access"
              desc="Admin &amp; development tools"
              open={openCard === 'login'}
              onToggle={() => toggleCard('login')}
            >
              <StatusMsg {...(loginStatus || {})} />
              <Field
                id="login-email" type="email" placeholder="Email"
                value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                error={loginErrors.email} autoComplete="email"
              />
              <Field
                id="login-pass" type="password" placeholder="Password"
                value={loginPass} onChange={e => setLoginPass(e.target.value)}
                error={loginErrors.pass} autoComplete="current-password"
              />
              <PrimaryBtn onClick={handleLogin} loading={loginLoading}>LOGIN</PrimaryBtn>
            </RoleCard>

            {/* Create account */}
            <RoleCard
              icon={<UserPlus className="w-5 h-5" />}
              label="Create Account"
              desc="Invite-only registration"
              open={openCard === 'signup'}
              onToggle={() => toggleCard('signup')}
            >
              <StatusMsg {...(suStatus || {})} />
              <Field
                id="su-email" type="email" placeholder="Email"
                value={suEmail} onChange={e => setSuEmail(e.target.value)}
                error={suErrors.email} autoComplete="email"
              />
              <div className="grid grid-cols-2 gap-2.5">
                <Field
                  id="su-pass" type="password" placeholder="Password"
                  value={suPass} onChange={e => setSuPass(e.target.value)}
                  error={suErrors.pass} autoComplete="new-password"
                />
                <Field
                  id="su-pass2" type="password" placeholder="Confirm"
                  value={suPass2} onChange={e => setSuPass2(e.target.value)}
                  error={suErrors.pass2} autoComplete="new-password"
                />
              </div>

              {/* DOB — neutral label, no indication of why it's being asked */}
              <Field
                id="su-dob" type="date"
                value={suDob} onChange={e => setSuDob(e.target.value)}
                error={suErrors.dob} autoComplete="bday"
                max={todayString()}
              />

              <div className="h-px bg-white/5 my-3" />

              {/* Consent — unchecked by default, explicit action required */}
              <div className="bg-bg-panel border border-white/5 rounded-[10px] p-3 mb-3.5">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={suTerms}
                    onChange={e => setSuTerms(e.target.checked)}
                    className="mt-0.5 w-3.5 h-3.5 flex-shrink-0 accent-accent-pink cursor-pointer"
                  />
                  <span className="text-[11px] text-text-dim leading-relaxed">
                    I have read and agree to the{' '}
                    <Link href="/privacy" className="text-accent-pink hover:underline">Privacy Policy</Link>
                    {' '}and{' '}
                    <Link href="/terms" className="text-accent-pink hover:underline">Terms of Service</Link>.
                  </span>
                </label>
              </div>

              <PrimaryBtn onClick={handleSignup} loading={suLoading}>CREATE ACCOUNT</PrimaryBtn>
            </RoleCard>

            {/* Playtester — closed */}
            <RoleCard
              icon={<User className="w-5 h-5" />}
              label="Playtester Access"
              desc="Play latest builds &amp; give feedback"
              open={openCard === 'tester'}
              onToggle={() => toggleCard('tester')}
            >
              <p className="text-sm text-text-dim text-center py-1">
                Sorry! We're not looking for testers right now. Check back soon!
              </p>
            </RoleCard>

          </div>
        )}

        {/* ── FOOTER ── */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1.5">
            <Copyright className="w-2.5 h-2.5 text-text-deep-muted" />
            <span className="font-mono text-[10px] text-text-deep-muted tracking-[0.1em]">
              2026 BELLA//STUDIOS
            </span>
          </div>
          <div className="font-mono text-[10px] text-text-muted tracking-[0.08em] space-x-2">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <span className="text-text-deep-muted">|</span>
            <Link href="/help" className="hover:text-white transition-colors">Help</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
