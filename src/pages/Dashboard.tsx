import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/axios';
import { 
  Calendar, Clock, User, Activity, ArrowUpRight, ArrowDownRight, 
  Search, Bell, Plus, Settings, ChevronRight, FileText 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';

const data = [
  { name: 'Mon', visits: 4 },
  { name: 'Tue', visits: 7 },
  { name: 'Wed', visits: 5 },
  { name: 'Thu', visits: 8 },
  { name: 'Fri', visits: 6 },
  { name: 'Sat', visits: 2 },
  { name: 'Sun', visits: 3 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await api.get('/user/appointments');
        setAppointments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-neutral-50">
      {/* Dashboard Sidebar */}
      <aside className="hidden lg:flex w-[240px] flex-col border-r border-brand-border bg-white py-6">
        <div className="flex-1 px-3">
          <div className="space-y-1">
            {[
              { label: 'Dashboard', icon: Activity, active: true },
              { label: 'Doctors', icon: User },
              { label: 'Appointments', icon: Calendar },
              { label: 'Pharmacy', icon: FileText },
              { label: 'Lab Results', icon: Shield },
              { label: 'Patient Records', icon: User },
              { label: 'Billing', icon: Settings },
            ].map((item) => (
              <button
                key={item.label}
                className={`flex w-full items-center gap-3 px-6 py-3 text-[14px] font-medium transition-all cursor-pointer border-l-[3px] ${
                  item.active 
                    ? 'bg-[#f1f5f9] text-brand-primary border-brand-primary' 
                    : 'text-brand-text-muted border-transparent hover:bg-neutral-50 hover:text-brand-text-main'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-auto px-6 space-y-1">
          <button className="flex w-full items-center gap-3 py-3 text-[14px] font-medium text-brand-text-muted hover:text-brand-text-main">
            Support
          </button>
          <button className="flex w-full items-center gap-3 py-3 text-[14px] font-medium text-brand-text-muted hover:text-brand-text-main">
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-brand-bg">
        <div className="p-8">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-text-muted" />
                <input 
                  type="text" 
                  placeholder="Search patients, doctors, or prescriptions..."
                  className="w-full bg-[#f1f5f9] border border-transparent rounded-lg py-2.5 pl-11 pr-4 text-sm text-brand-text-main focus:bg-white focus:border-brand-border outline-none transition-all"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex h-10 items-center space-x-2 rounded-lg bg-brand-primary px-5 font-bold text-white shadow-sm hover:bg-brand-primary-hover transition-all text-sm">
                <Plus className="h-4 w-4" />
                <span>New Appointment</span>
              </button>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Total Patients', value: '1,284', change: '+12% this month', color: 'text-emerald-600' },
              { label: "Today's Surgeries", value: '08', change: '0 pending prep', color: 'text-brand-text-muted' },
              { label: 'Pharmacy Orders', value: '142', change: '98% fulfillment rate', color: 'text-emerald-600' },
            ].map((stat) => (
              <div key={stat.label} className="card-polish p-5">
                <div className="text-[12px] font-bold uppercase tracking-wider text-brand-text-muted mb-1">{stat.label}</div>
                <div className="text-2xl font-bold text-brand-text-main">{stat.value}</div>
                <div className={`text-[12px] font-semibold mt-1 ${stat.color}`}>{stat.change}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Appointments Panel */}
            <div className="lg:col-span-2 card-polish overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-brand-border flex items-center justify-between">
                <h3 className="font-bold text-brand-text-main">Upcoming Appointments</h3>
                <button className="text-sm font-bold text-brand-primary cursor-pointer hover:underline">View Calendar</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f8fafc] text-brand-text-muted text-[13px] font-bold">
                      <th className="px-6 py-3 border-b border-brand-border">Patient Name</th>
                      <th className="px-6 py-3 border-b border-brand-border">Doctor</th>
                      <th className="px-6 py-3 border-b border-brand-border">Time</th>
                      <th className="px-6 py-3 border-b border-brand-border">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-[14px]">
                    {appointments.length > 0 ? appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-neutral-50 transition-colors border-b border-brand-border last:border-0">
                        <td className="px-6 py-4 font-medium text-brand-text-main">{user?.name}</td>
                        <td className="px-6 py-4 text-brand-text-muted">{apt.doctor.name}</td>
                        <td className="px-6 py-4 text-brand-text-muted">{apt.time}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold uppercase">Confirmed</span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-brand-text-muted font-medium">No appointments scheduled</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Side Panel - Quick Actions & Alerts */}
            <div className="space-y-6">
              <div className="card-polish p-5 flex flex-col gap-4">
                <div className="text-[14px] font-bold text-brand-text-main mb-1">Quick Actions</div>
                <button className="w-full bg-brand-primary text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-brand-primary-hover transition-all">New Appointment</button>
                <button className="w-full bg-white text-brand-text-main border border-brand-border py-2.5 rounded-lg font-semibold text-sm hover:bg-neutral-50 transition-all">Generate Health Report</button>
                
                <div className="mt-4 p-4 bg-[#fff7ed] border border-[#fdba74] rounded-lg">
                  <div className="text-[13px] font-bold text-[#9a3412] mb-1">Pharmacy Alert</div>
                  <p className="text-[12px] text-[#9a3412] leading-tight">Insulin Aspart (Novolog) stock is below threshold (5 units left). Reorder required.</p>
                </div>

                <div className="mt-auto pt-6 border-t border-brand-border">
                  <div className="text-[11px] font-bold text-brand-text-muted uppercase tracking-wider mb-3">SYSTEM STATUS</div>
                  <div className="flex justify-between items-center text-[12px] mb-2">
                    <span className="text-brand-text-muted">Server Latency</span>
                    <span className="text-brand-accent-text font-bold">12ms</span>
                  </div>
                  <div className="flex justify-between items-center text-[12px]">
                    <span className="text-brand-text-muted">DB Connection</span>
                    <span className="text-brand-accent-text font-bold">Healthy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
