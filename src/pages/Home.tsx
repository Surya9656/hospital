import { motion } from 'motion/react';
import { Shield, Clock, Search, MapPin, Star, UserPlus, Stethoscope, Pill, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  { icon: Stethoscope, title: 'Find Doctors', desc: 'Consult with board-certified specialists.', color: 'bg-blue-50 text-brand-primary', link: '/doctors' },
  { icon: Calendar, title: 'Consultations', desc: 'Secure booking for clinical visits.', color: 'bg-emerald-50 text-emerald-600', link: '/doctors' },
  { icon: Pill, title: 'Pharmacy', desc: 'Pharmaceutical grade medicines delivered.', color: 'bg-indigo-50 text-indigo-600', link: '/pharmacy' },
  { icon: Shield, title: 'Critical Care', desc: '24/7 Priority medical intervention.', color: 'bg-rose-50 text-rose-600', link: '/' },
];

export default function Home() {
  return (
    <div className="flex flex-col bg-brand-bg">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-white px-6 pt-12 lg:px-8 lg:pt-20 border-b border-brand-border">
        <div className="mx-auto max-w-7xl pb-20">
          <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:items-center">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl px-4 lg:px-0"
            >
              <div className="inline-flex items-center space-x-2 rounded-lg bg-[#f1f5f9] px-4 py-1.5 text-[12px] font-bold text-brand-text-muted uppercase tracking-wider border border-brand-border">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-primary"></span>
                <span>Tier-1 Healthcare Provider</span>
              </div>
              <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-neutral-900 sm:text-6xl leading-[1.1]">
                Unified Medical <br /><span className="text-brand-primary">Management</span>
              </h1>
              <p className="mt-6 text-[18px] font-medium text-brand-text-muted leading-relaxed">
                Experience precision healthcare with our integrated portal. Connect with specialist doctors and access premium pharmacy services.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/doctors" className="rounded-lg bg-brand-primary px-8 py-3.5 text-[15px] font-bold text-white shadow-sm hover:bg-brand-primary-hover transition-all">
                  Register Consultation
                </Link>
                <Link to="/pharmacy" className="rounded-lg border border-brand-border bg-white px-8 py-3.5 text-[15px] font-bold text-brand-text-main hover:bg-neutral-50 transition-all">
                  Access Pharmacy
                </Link>
              </div>
              
              <div className="mt-12 grid grid-cols-3 gap-8 pt-8 border-t border-brand-border">
                {[
                  { val: '2.4k', label: 'Surgeons' },
                  { val: '12', label: 'Clinics' },
                  { val: '99.9%', label: 'Uptime' }
                ].map(stat => (
                  <div key={stat.label}>
                    <p className="text-2xl font-black text-brand-text-main">{stat.val}</p>
                    <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative hidden lg:block"
            >
              <div className="aspect-[4/3] rounded-xl bg-[#f8fafc] border border-brand-border p-3 shadow-brand">
                <img 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600" 
                  alt="Medical Professional" 
                  className="h-full w-full rounded-lg object-cover grayscale-[10%]" 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] text-brand-primary">Clinical Excellence</h2>
          <p className="mt-4 text-3xl font-black tracking-tight text-brand-text-main sm:text-4xl">Comprehensive Network Services</p>
          <p className="mt-4 text-brand-text-muted font-medium">Standardized healthcare delivery across all specializations and regions.</p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <Link to={service.link} className="group block h-full card-polish p-8 hover:border-brand-primary/30 transition-all">
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${service.color} mb-6 border border-current opacity-80 group-hover:opacity-100 transition-opacity`}>
                  <service.icon className="h-5 w-5" />
                </div>
                <h3 className="text-[17px] font-bold text-brand-text-main group-hover:text-brand-primary transition-colors">{service.title}</h3>
                <p className="mt-3 text-[14px] text-brand-text-muted leading-relaxed font-medium">{service.desc}</p>
                <div className="mt-6 flex items-center text-[12px] font-bold text-brand-text-muted group-hover:text-brand-primary transition-colors uppercase tracking-wider">
                  Details <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="bg-white border-t border-brand-border py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-black text-brand-text-main tracking-tight">Standardized <span className="text-brand-primary">Security</span> Protocols</h2>
                <p className="mt-4 text-[16px] text-brand-text-muted font-medium leading-relaxed">Our infrastructure adheres to the highest medical confidentiality standards, ensuring your clinical data remains secure and accessible only to authorized personnel.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: Shield, title: 'HIPAA Compliant', desc: 'Secure data management.' },
                  { icon: Clock, title: '24/7 Monitoring', desc: 'Constant system oversight.' }
                ].map(item => (
                  <div key={item.title} className="flex gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-[#f1f5f9] border border-brand-border flex items-center justify-center text-brand-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-brand-text-main">{item.title}</h4>
                      <p className="text-[12px] text-brand-text-muted font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="rounded-lg bg-neutral-900 px-8 py-3.5 text-[14px] font-bold text-white hover:bg-neutral-800 transition-all">
                Review Safety Documentation
              </button>
            </div>
            <div className="relative">
              <div className="rounded-xl overflow-hidden shadow-brand border border-brand-border grayscale-[30%]">
                <img 
                  src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&q=80&w=800" 
                  alt="Enterprise Infrastructure" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
