import React from 'react';
import { Search, Bell, ChevronDown, Droplet } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search for doctors, staff, or shifts..." 
            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors group cursor-pointer">
          <Droplet className="w-6 h-6 fill-current" />
          <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
            O+
          </span>
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 cursor-default">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Blood Bank Status</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">O Positive</span>
                <span className="text-rose-600 font-bold">12 units</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">A Negative</span>
                <span className="text-amber-600 font-bold">4 units</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">B Positive</span>
                <span className="text-emerald-600 font-bold">28 units</span>
              </div>
            </div>
            <button className="w-full mt-3 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors">
              Manage Storage
            </button>
          </div>
        </div>

        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

        <button className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-xl transition-colors group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-none">Alex Thompson</p>
            <p className="text-xs text-slate-500 mt-1">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 overflow-hidden">
            <img 
              src="https://i.pravatar.cc/150?u=admin" 
              alt="Admin" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
        </button>
      </div>
    </header>
  );
}
