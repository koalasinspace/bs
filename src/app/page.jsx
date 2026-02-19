"use client";

import React from 'react';
import Link from 'next/link';
import { Ghost, ArrowRight, User, Terminal } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-[#7eb8da] selection:text-white">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7eb8da]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 bg-[#1a1a1a] border border-[#7eb8da]/30 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_-10px_rgba(126,184,218,0.3)]">
            <Ghost className="w-8 h-8 text-[#7eb8da]" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">PENGUIN<span className="text-[#7eb8da]">DEV</span></h1>
          <p className="text-[#666666] font-mono text-xs tracking-widest">INTERNAL DEVELOPMENT PORTAL</p>
        </div>

        {/* Login Options */}
        <div className="space-y-4">
          
          {/* Admin Login */}
          <Link href="/admin" className="block group">
            <div className="bg-[#121212] border border-white/10 hover:border-[#7eb8da]/50 p-4 rounded-xl transition-all group-hover:bg-[#1a1a1a] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#0a0a0a] border border-white/5 flex items-center justify-center text-[#a1a1a1] group-hover:text-white transition-colors">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">Developer Access</h3>
                  <p className="text-[#666666] text-xs">Manage builds, assets & logic</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#444444] group-hover:text-[#7eb8da] transition-colors" />
            </div>
          </Link>

          {/* Tester Login */}
          <Link href="/tester" className="block group">
            <div className="bg-[#121212] border border-white/10 hover:border-[#7eb8da]/50 p-4 rounded-xl transition-all group-hover:bg-[#1a1a1a] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#0a0a0a] border border-white/5 flex items-center justify-center text-[#a1a1a1] group-hover:text-white transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">Playtester Access</h3>
                  <p className="text-[#666666] text-xs">Play latest builds & give feedback</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#444444] group-hover:text-[#7eb8da] transition-colors" />
            </div>
          </Link>

        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-[#444444] text-[10px] font-mono">
            SECURE CONNECTION // ZERO-UI SYSTEM v2.0
          </p>
        </div>
      </div>
    </div>
  );
}
