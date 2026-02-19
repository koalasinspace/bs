"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Ghost, MessageSquare } from 'lucide-react';
import { DashboardLayout } from '../../components/ZeroUI';

export default function UserDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <DashboardLayout role="TESTER" user="GUEST" onLogout={handleLogout}>
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-light text-white mb-2">Ready to playtest?</h2>
        <p className="text-[#a1a1a1] text-sm">There is a new build available for the Ice Cavern level.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Play Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-[#7eb8da]/20 to-[#121212] border border-[#7eb8da]/30 rounded-xl p-6 md:p-8 relative overflow-hidden group cursor-pointer transition-all active:scale-[0.98] md:hover:border-[#7eb8da]/50">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-[#7eb8da] text-[#050505] text-[10px] font-bold mb-4">
              LATEST BUILD
            </div>
            <h3 className="text-2xl md:text-3xl font-light text-white mb-4">Penguin Dash <span className="font-bold">v0.9</span></h3>
            <button className="bg-white text-black w-full md:w-auto justify-center px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#e8e8e8] transition-colors flex items-center gap-2">
              LAUNCH GAME <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <Ghost className="absolute right-[-20px] bottom-[-20px] w-48 h-48 md:w-64 md:h-64 text-[#7eb8da]/10 group-hover:text-[#7eb8da]/20 transition-colors rotate-12" />
        </div>

        {/* User Agent / Feedback */}
        <div className="bg-[#121212] border border-white/5 rounded-xl p-5 md:p-6 flex flex-col mb-20 md:mb-0">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <MessageSquare className="text-[#7eb8da] w-5 h-5" />
            <h3 className="text-white text-sm font-bold tracking-wider">FEEDBACK AGENT</h3>
          </div>
          <div className="flex-1 bg-[#1a1a1a] rounded-lg p-4 mb-4 border border-white/5">
            <p className="text-[#a1a1a1] text-xs leading-relaxed">
              "Hi! I'm the automated feedback collector. Did you encounter any bugs in the last run?"
            </p>
          </div>
          <div className="space-y-2">
            <button className="w-full py-3 bg-[#1a1a1a] active:bg-[#252525] md:hover:bg-[#252525] border border-white/10 rounded-lg text-xs text-[#e8e8e8] transition-colors font-medium">
              Report a Bug
            </button>
            <button className="w-full py-3 bg-[#1a1a1a] active:bg-[#252525] md:hover:bg-[#252525] border border-white/10 rounded-lg text-xs text-[#e8e8e8] transition-colors font-medium">
              Suggest Feature
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
