import React from 'react';
import { 
  Bell, 
  MessageSquare, 
  AlertTriangle, 
  Send, 
  History,
  ShieldAlert,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Notifications() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications & Alerts</h1>
          <p className="text-slate-500 mt-1">Send broadcasts and manage system notifications.</p>
        </div>
        <button className="bg-rose-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" />
          Emergency Broadcast
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Send SMS Broadcast
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Recipient Group</label>
                  <select className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none">
                    <option>All Staff</option>
                    <option>Doctors Only</option>
                    <option>Nurses Only</option>
                    <option>Emergency Team</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Priority Level</label>
                  <select className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none">
                    <option>Normal</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Message Content</label>
                <textarea 
                  rows={4} 
                  placeholder="Type your message here..."
                  className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                ></textarea>
              </div>
              <button className="w-full bg-primary text-secondary py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                <Send className="w-5 h-5" />
                Send Broadcast
              </button>
            </form>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-slate-400" />
                Alerts History
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input type="text" placeholder="Search history..." className="bg-slate-50 border-none rounded-xl py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
            </div>
            <div className="space-y-4">
              {[
                { type: 'info', title: 'System Maintenance', time: '2 hours ago', msg: 'Scheduled maintenance for the payroll system tonight at 11 PM.' },
                { type: 'warning', title: 'Shift Conflict', time: '5 hours ago', msg: 'Dr. Sarah Johnson has overlapping shifts in Cardiology.' },
                { type: 'emergency', title: 'Emergency Alert', time: 'Yesterday', msg: 'Multiple trauma cases incoming. All emergency staff report to ER.' },
              ].map((alert, i) => (
                <div key={i} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                    alert.type === 'info' ? "bg-blue-100 text-blue-600" :
                    alert.type === 'warning' ? "bg-amber-100 text-amber-600" :
                    "bg-rose-100 text-rose-600"
                  )}>
                    {alert.type === 'info' ? <Bell className="w-5 h-5" /> :
                     alert.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
                     <ShieldAlert className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{alert.title}</h3>
                      <span className="text-[10px] font-medium text-slate-400">{alert.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{alert.msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Notification Settings</h2>
            <div className="space-y-4">
              {[
                'Email Notifications',
                'SMS Alerts',
                'Push Notifications',
                'Emergency Broadcasts',
                'Shift Reminders'
              ].map((setting) => (
                <div key={setting} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">{setting}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
