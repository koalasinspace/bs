"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Ghost, ArrowRight, User, Terminal, Copyright } from 'lucide-react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Assuming firebase.js is in src/lib

export default function LandingPage() {
  const router = useRouter();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showTesterMessage, setShowTesterMessage] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAdminLoginClick = (e) => {
    e.preventDefault();
    setShowAdminLogin(!showAdminLogin);
    setShowTesterMessage(false); // Close other sections
    setError(null);
  };

  const handleTesterLoginClick = (e) => {
    e.preventDefault();
    setShowTesterMessage(!showTesterMessage);
    setShowAdminLogin(false); // Close other sections
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-accent-pink selection:text-white">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-pink/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-purple/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 bg-bg-panel border border-accent-pink/30 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_-10px_rgba(126,184,218,0.3)]">
            <Ghost className="w-8 h-8 text-accent-pink" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">BELLA<span className="text-accent-pink">STUDIOS</span></h1>
          <p className="text-text-muted font-mono text-xs tracking-widest">INTERNAL DEVELOPMENT PORTAL</p>
        </div>

        {/* Login Options */}
        <div className="space-y-4">
          
          {/* Admin Login */}
          <div className="block group">
            <button onClick={handleAdminLoginClick} className="w-full bg-bg-card border border-white/10 hover:border-accent-pink/50 p-4 rounded-xl transition-all group-hover:bg-bg-panel flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-bg-sidebar border border-white/5 flex items-center justify-center text-text-dim group-hover:text-white transition-colors">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">Developer Access</h3>
                  <p className="text-text-muted text-xs">Manage builds, assets & logic</p>
                </div>
              </div>
              <ArrowRight className={`w-4 h-4 text-text-deep-muted transition-transform ${showAdminLogin ? 'rotate-90' : 'rotate-0'}`} />
            </button>

            {showAdminLogin && (
              <div className="mt-4 p-4 bg-bg-panel border border-accent-pink/20 rounded-xl animate-fade-in-down">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 bg-bg-sidebar border border-white/10 rounded-lg text-white placeholder-text-muted text-sm focus:outline-none focus:border-accent-pink/50"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input
                      type="password"
                      id="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 bg-bg-sidebar border border-white/10 rounded-lg text-white placeholder-text-muted text-sm focus:outline-none focus:border-accent-pink/50"
                      required
                    />
                  </div>
                  {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                  <button
                    type="submit"
                    className="w-full bg-accent-pink hover:bg-accent-pink/80 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Tester Login */}
          <div className="block group">
            <button onClick={handleTesterLoginClick} className="w-full bg-bg-card border border-white/10 hover:border-accent-pink/50 p-4 rounded-xl transition-all group-hover:bg-bg-panel flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-bg-sidebar border border-white/5 flex items-center justify-center text-text-dim group-hover:text-white transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">Playtester Access</h3>
                  <p className="text-text-muted text-xs">Play latest builds & give feedback</p>
                </div>
              </div>
              <ArrowRight className={`w-4 h-4 text-text-deep-muted transition-transform ${showTesterMessage ? 'rotate-90' : 'rotate-0'}`} />
            </button>
            {showTesterMessage && (
              <div className="mt-4 p-4 bg-bg-panel border border-white/10 rounded-xl text-center text-text-dim animate-fade-in-down">
                <p>Sorry! We're not looking for testers now. Check back soon!</p>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="mb-1">
            <Copyright className="w-3 h-3 text-text-deep-muted inline-block mr-1" />
            <p className="text-text-deep-muted text-[10px] font-mono inline-block">
              2026 BELLA//STUDIOS
            </p>
          </div>
          <div className="text-text-muted text-[10px] font-mono space-x-2">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <span>|</span>
            <Link href="/help" className="hover:text-white transition-colors">Help</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
