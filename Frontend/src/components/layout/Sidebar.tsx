import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserRound, 
  CalendarRange, 
  Users, 
  ClipboardCheck, 
  CreditCard, 
  Bell,
  Stethoscope,
  BrainCircuit
} from 'lucide-react';
import { cn } from '../../lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: UserRound, label: 'Doctors', path: '/doctors' },
  { icon: CalendarRange, label: 'Shifts', path: '/shifts' },
  { icon: Users, label: 'Staff', path: '/staff' },
  { icon: ClipboardCheck, label: 'Attendance', path: '/attendance' },
  { icon: CreditCard, label: 'Payroll', path: '/payroll' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: BrainCircuit, label: 'AI Insights', path: '/ai-insights' },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-secondary text-white flex flex-col shadow-xl z-50">
      <div className="p-6 flex items-center gap-3 border-b border-slate-700/50">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <Stethoscope className="text-secondary w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight">MedPro Admin</span>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              isActive 
                ? "bg-primary text-secondary font-semibold shadow-lg shadow-primary/20" 
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn(
                  "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-secondary" : "text-slate-400"
                )} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-700/50">
        <div className="bg-slate-800/50 rounded-2xl p-4">
          <p className="text-xs text-slate-400 mb-1">Logged in as</p>
          <p className="text-sm font-medium">Admin User</p>
        </div>
      </div>
    </aside>
  );
}
