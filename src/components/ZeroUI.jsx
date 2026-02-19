import React from 'react';
import { 
  Layout, Search, Users, Settings, LogOut, 
  Bell, Home, Ghost 
} from 'lucide-react';

/* ZERO DESIGN SYSTEM - SHARED COMPONENTS
   Background: #050505 (Surface-0)
   Panels: #1a1a1a (Surface-2)
   Brand: #7eb8da (Ice Blue)
*/

// --- LAYOUT ---
export function DashboardLayout({ children, role, user, onLogout }) {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row text-[#e8e8e8] font-sans selection:bg-[#7eb8da] selection:text-white">
      
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex w-20 lg:w-64 border-r border-white/5 flex-col bg-[#0a0a0a] sticky top-0 h-screen">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-white/5">
          <Ghost className="w-6 h-6 text-[#7eb8da]" />
          <span className="hidden lg:block ml-3 font-bold text-white tracking-tight">PENGUIN<span className="text-[#7eb8da]">DEV</span></span>
        </div>
        
        <nav className="flex-1 py-6 space-y-1 px-2 lg:px-4">
          <NavItem icon={<Layout />} label="Dashboard" active />
          <NavItem icon={<Search />} label="Explore" />
          <NavItem icon={<Users />} label="Team" />
          <NavItem icon={<Settings />} label="Settings" />
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={onLogout} className="flex items-center justify-center lg:justify-start w-full text-[#666666] hover:text-white transition-colors gap-3">
            <LogOut className="w-5 h-5" />
            <span className="hidden lg:block text-xs font-mono">LOGOUT</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-h-0">
        
        {/* TOP BAR */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-[#050505]/80 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Ghost className="w-5 h-5 text-[#7eb8da] md:hidden" />
            <span className="text-[10px] md:text-xs font-mono text-[#444444] tracking-widest">PORTAL // {role}</span>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <Bell className="w-4 h-4 text-[#666666] hover:text-[#7eb8da] cursor-pointer transition-colors" />
            <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-white/5">
              <div className="text-right hidden md:block">
                <div className="text-xs font-bold text-white">{user}</div>
                <div className="text-[10px] text-[#666666] font-mono">{role === 'DEV' ? 'LEAD DEVELOPER' : 'TESTER'}</div>
              </div>
              <div className="w-8 h-8 rounded bg-gradient-to-tr from-[#7eb8da] to-purple-500 border border-white/10" />
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 relative">
          {children}
        </main>

        {/* MOBILE BOTTOM NAV */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0a0a0a]/90 backdrop-blur border-t border-white/5 flex items-center justify-around px-2 z-30">
          <MobileNavItem icon={<Home />} label="Home" active />
          <MobileNavItem icon={<Search />} label="Find" />
          <MobileNavItem icon={<Settings />} label="Config" />
          <button onClick={onLogout} className="flex flex-col items-center justify-center p-2 text-[#666666] active:text-white">
            <LogOut className="w-5 h-5 mb-1" />
            <span className="text-[9px]">Exit</span>
          </button>
        </div>

      </div>
    </div>
  );
}

// --- WIDGETS ---

export function NavItem({ icon, label, active }) {
  return (
    <button className={`w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-lg transition-all ${active ? 'bg-[#7eb8da]/10 text-[#7eb8da] border border-[#7eb8da]/20' : 'text-[#a1a1a1] hover:bg-white/5 hover:text-white border border-transparent'}`}>
      {React.cloneElement(icon, { size: 18 })}
      <span className="hidden lg:block text-sm font-medium">{label}</span>
    </button>
  );
}

export function MobileNavItem({ icon, label, active }) {
  return (
    <button className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${active ? 'text-[#7eb8da]' : 'text-[#a1a1a1] active:text-white'}`}>
      {React.cloneElement(icon, { size: 20 })}
      <span className="text-[9px] mt-1">{label}</span>
    </button>
  );
}

export function StatCard({ icon, label, value, change, isGood }) {
  return (
    <div className="bg-[#121212] border border-white/5 p-4 md:p-5 rounded-xl active:bg-[#1a1a1a] transition-colors">
      <div className="flex justify-between items-start mb-3 md:mb-4">
        <div className="p-2 bg-[#1a1a1a] rounded text-[#a1a1a1]">{React.cloneElement(icon, { size: 16 })}</div>
        {change && (
          <span className={`text-[9px] md:text-[10px] font-mono px-1.5 py-0.5 rounded border ${isGood ? 'bg-[#34d399]/10 text-[#34d399] border-[#34d399]/20' : 'bg-[#7eb8da]/10 text-[#7eb8da] border-[#7eb8da]/20'}`}>
            {change}
          </span>
        )}
      </div>
      <div className="text-xl md:text-2xl font-light text-white mb-1">{value}</div>
      <div className="text-[9px] md:text-[10px] text-[#666666] font-mono tracking-wider">{label}</div>
    </div>
  );
}

export function TimelineItem({ time, user, action }) {
  return (
    <div className="flex gap-4 items-center group">
      <div className="w-14 md:w-16 text-right text-[9px] md:text-[10px] text-[#666666] font-mono pt-1 shrink-0">{time}</div>
      <div className="w-2 h-2 rounded-full bg-[#1a1a1a] border border-[#7eb8da]/30 group-hover:bg-[#7eb8da] transition-colors relative z-10 shrink-0">
        <div className="absolute top-2 left-1/2 w-px h-full bg-white/5 -translate-x-1/2" />
      </div>
      <div className="pb-4 border-b border-white/5 flex-1 pt-1 min-w-0">
        <span className="text-[#7eb8da] text-[10px] md:text-xs font-bold mr-2">{user}</span>
        <span className="text-[#a1a1a1] text-[10px] md:text-xs truncate block md:inline">{action}</span>
      </div>
    </div>
  );
}

export function ActionCard({ title, icon }) {
  return (
    <button className="flex items-center gap-3 p-3 md:p-4 bg-[#1a1a1a] border border-white/5 rounded-lg active:bg-[#202020] md:hover:border-[#7eb8da]/50 md:hover:bg-[#202020] transition-all group">
      <div className="p-2 bg-[#0a0a0a] rounded border border-white/5 md:group-hover:scale-110 transition-transform">
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <span className="text-[10px] md:text-xs font-bold text-[#e8e8e8] tracking-wide">{title}</span>
    </button>
  );
}

export function AgentMessage({ text, time, isSystem }) {
  return (
    <div className={`flex flex-col gap-1 ${isSystem ? 'items-center text-center my-4 opacity-50' : 'items-start'}`}>
      <div className={`max-w-[95%] p-2 rounded ${isSystem ? 'bg-transparent text-[#7eb8da]' : 'bg-[#1a1a1a] border border-white/5 text-[#a1a1a1]'}`}>
        {text}
      </div>
      {!isSystem && <span className="text-[8px] md:text-[9px] text-[#444444] px-1">{time}</span>}
    </div>
  );
}

export function TaskCard({ title, reward, done }) {
  return (
    <div className={`p-4 rounded-lg border flex justify-between items-center ${done ? 'bg-[#34d399]/5 border-[#34d399]/20' : 'bg-[#1a1a1a] border-white/5'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-4 h-4 rounded border flex items-center justify-center ${done ? 'bg-[#34d399] border-[#34d399]' : 'border-[#444444]'}`}>
          {done && <span className="text-black text-[10px] font-bold">✓</span>}
        </div>
        <span className={`text-sm ${done ? 'text-[#34d399] line-through' : 'text-[#e8e8e8]'}`}>{title}</span>
      </div>
      <span className="text-[10px] font-mono text-[#666666] bg-[#0a0a0a] px-2 py-1 rounded">{reward}</span>
    </div>
  );
}
