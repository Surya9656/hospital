import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Shield, MapPin, Phone, Edit2, LogOut, Camera } from 'lucide-react';
import { motion } from 'motion/react';

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 bg-brand-bg">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">User Profile</h1>
          <p className="mt-1 text-[14px] text-brand-text-muted font-medium">Resolution of personal authentication and status details.</p>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-bold text-brand-text-muted uppercase tracking-widest">ID VERIFIED</div>
          <div className="text-[13px] font-bold text-brand-accent-text bg-brand-accent px-3 py-1 rounded-full mt-1 border border-brand-accent-text/20">Active Personnel</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 border-r border-brand-border pr-8">
          <div className="bg-white p-6 rounded-xl border border-brand-border shadow-brand">
            <div className="h-28 w-28 mx-auto rounded-xl bg-brand-sidebar border border-brand-border flex items-center justify-center text-brand-text-muted overflow-hidden relative group">
              <User className="h-14 w-14" />
              <div className="absolute inset-x-0 bottom-0 bg-brand-primary/80 py-1.5 text-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="h-3.5 w-3.5 mx-auto text-white" />
              </div>
            </div>
            <div className="mt-6 text-center">
              <h2 className="text-[17px] font-bold text-brand-text-main">{user.name}</h2>
              <p className="text-[12px] font-bold text-brand-primary uppercase tracking-wider mt-1">{user.role}</p>
            </div>
          </div>
          
          <nav className="mt-8 space-y-1">
            {[
              { label: 'Personnel Record', icon: User, active: true },
              { label: 'Security & Auth', icon: Shield },
              { label: 'Network Points', icon: MapPin },
            ].map(item => (
              <button key={item.label} className={`flex w-full items-center px-6 py-3 rounded-lg text-[13px] font-bold transition-all border-l-[3px] ${item.active ? 'bg-white text-brand-primary border-brand-primary' : 'text-brand-text-muted border-transparent hover:bg-neutral-50'}`}>
                <item.icon className="mr-3 h-4 w-4" /> {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="lg:col-span-3 space-y-10">
          <section className="bg-white p-8 rounded-xl border border-brand-border shadow-brand">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[17px] font-bold text-brand-text-main">Credentials Summary</h3>
              <button className="px-4 py-2 border border-brand-border rounded-lg text-[12px] font-bold text-brand-text-main hover:bg-neutral-50 transition-all">
                <Edit2 className="mr-2 h-3.5 w-3.5 inline" /> Edit Detail
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
              <div className="space-y-1 border-b border-brand-border pb-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand-text-muted">Assigned Identity</p>
                <p className="text-[15px] font-bold text-brand-text-main">{user.name}</p>
              </div>
              <div className="space-y-1 border-b border-brand-border pb-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand-text-muted">Network Address</p>
                <p className="text-[15px] font-bold text-brand-text-main">{user.email}</p>
              </div>
              <div className="space-y-1 border-b border-brand-border pb-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand-text-muted">Verification Status</p>
                <div className="flex items-center space-x-2">
                  <span className="text-[13px] font-bold text-emerald-600">CERTIFIED</span>
                </div>
              </div>
              <div className="space-y-1 border-b border-brand-border pb-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand-text-muted">Active Node</p>
                <p className="text-[15px] font-bold text-brand-text-main">H-CORE SOUTH (12.4)</p>
              </div>
            </div>
          </section>

          <footer className="pt-6 border-t border-brand-border">
            <button 
              onClick={logout}
              className="flex items-center justify-center px-8 py-3.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-[14px] font-bold hover:bg-red-100 transition-all"
            >
              <LogOut className="mr-2 h-4 w-4" /> Terminate Active Session
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
