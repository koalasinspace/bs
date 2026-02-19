"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Code, Ghost, Activity, Zap, Box, Settings, ChevronRight } from 'lucide-react';
import { 
  DashboardLayout, StatCard, TimelineItem, ActionCard, AgentMessage 
} from '../../components/ZeroUI';

export default function AdminDashboard() {
  const router = useRouter();
  const [agentActive, setAgentActive] = useState(true);

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <DashboardLayout role="DEV" user="BELLA" onLogout={handleLogout}>
      {/* Top Stats Row - 2 Columns on Mobile */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <StatCard icon={<Users />} label="TESTERS" value="12" change="+3" />
        <StatCard icon={<Code />} label="COMMITS" value="342" change="Today" />
        <StatCard icon={<Ghost />} label="SPRITES" value="84" />
        <StatCard icon={<Activity />} label="STATUS" value="OK" isGood={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Development Panel */}
          <div className="bg-[#121212]/80 border border-white/5 rounded-xl p-5 md:p-6 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-light text-base md:text-lg">Live Build Status</h3>
              <span className="text-[#7eb8da] text-[10px] md:text-xs font-mono px-2 py-1 bg-[#7eb8da]/10 rounded border border-[#7eb8da]/20">v0.9.2-beta</span>
            </div>
            
            {/* Mock Timeline */}
            <div className="space-y-4">
              <TimelineItem time="10:42 AM" user="Bella" action="Updated Penguin Physics" />
              <TimelineItem time="09:15 AM" user="DevBot" action="Optimized Snow Particles" />
              <TimelineItem time="Yesterday" user="Bella" action="Fixed Ice Level Collision" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <ActionCard title="DEPLOY BUILD" icon={<Zap className="text-yellow-400" />} />
            <ActionCard title="EDIT ASSETS" icon={<Box className="text-purple-400" />} />
          </div>
        </div>

        {/* THE AGENT */}
        <div className="bg-[#121212] border border-[#7eb8da]/30 rounded-xl p-0 overflow-hidden flex flex-col h-[350px] md:h-[400px] shadow-[0_0_50px_-20px_rgba(126,184,218,0.15)] relative mb-20 md:mb-0">
          {/* Agent Header */}
          <div className="bg-[#1a1a1a] p-3 md:p-4 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className={`w-2 h-2 rounded-full ${agentActive ? 'bg-[#34d399] animate-pulse' : 'bg-red-500'}`} />
              </div>
              <span className="text-white text-[10px] md:text-xs font-mono tracking-wider">DEV_AGENT_V1</span>
            </div>
            <button onClick={() => setAgentActive(!agentActive)} className="text-[#666666] hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Agent Body */}
          <div className="flex-1 p-3 md:p-4 space-y-4 overflow-y-auto font-mono text-[10px] md:text-xs">
            <AgentMessage text="System initialization complete." time="08:00" />
            <AgentMessage text="Scanning codebase for optimizations..." time="08:01" />
            <AgentMessage text="> 2 unused textures found in /assets/ice_world" time="08:02" isSystem />
            <AgentMessage text="Waiting for further instructions, Bella." time="Now" />
          </div>

          {/* Agent Input */}
          <div className="p-3 bg-[#0a0a0a] border-t border-white/5">
            <div className="flex gap-2">
              <div className="flex-1 bg-[#1a1a1a] rounded px-3 py-2 text-xs text-[#666666] border border-white/5 truncate">
                Assign task...
              </div>
              <button className="bg-[#7eb8da]/10 hover:bg-[#7eb8da]/20 border border-[#7eb8da]/20 text-[#7eb8da] rounded px-3 py-2">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
