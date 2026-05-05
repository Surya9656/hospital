import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import api from '../lib/axios';
import { useCart, Medicine } from '../contexts/CartContext';
import { ShoppingBag, Search, Plus, Star, CheckCircle2, Pill, Package, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pharmacy() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const { data } = await api.get('/medicines');
        setMedicines(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  const handleAddToCart = (med: Medicine) => {
    addToCart(med);
    setAddedId(med.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const filtered = medicines.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-brand-bg">
      <header className="rounded-xl bg-neutral-900 p-12 text-white overflow-hidden relative shadow-brand">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Professional <span className="text-brand-primary">Healthcare</span> Solutions</h1>
            <p className="mt-4 text-[16px] text-neutral-400 font-medium">Authentic medicines delivered with pharmaceutical precision.</p>
            <div className="mt-8 flex gap-6">
              <div className="flex items-center text-[13px] font-bold"><Package className="mr-2 h-4 w-4 text-brand-primary" /> ISO CERTIFIED</div>
              <div className="flex items-center text-[13px] font-bold"><Truck className="mr-2 h-4 w-4 text-brand-primary" /> EXPRESS DELIVERY</div>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-brand-primary/10 blur-3xl rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=400" 
              className="relative z-10 w-full h-auto rounded-xl object-cover shadow-2xl"
              alt="Pharmacy"
            />
          </div>
        </div>
      </header>

      <div className="mt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {['All', 'Essential Drugs', 'Wellness', 'Chronic Care', 'Surgical'].map(cat => (
              <button key={cat} className="whitespace-nowrap px-6 py-2.5 rounded-lg bg-white border border-brand-border text-[13px] font-bold text-brand-text-muted hover:border-brand-primary hover:text-brand-primary transition-all">
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-text-muted" />
            <input
              type="text"
              placeholder="Search pharmacy inventory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-lg border-brand-border bg-white pl-11 pr-4 text-[14px] font-medium text-brand-text-main shadow-sm focus:border-brand-primary outline-none transition-all"
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            [1, 2, 3, 4].map(i => <div key={i} className="h-64 animate-pulse rounded-xl bg-neutral-200"></div>)
          ) : (
            filtered.map((med, idx) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="group card-polish p-5 hover:border-brand-primary/30 transition-all flex flex-col"
              >
                <div className="h-40 w-full rounded-lg bg-[#f8fafc] overflow-hidden relative p-4 group">
                  <img src={med.image} alt={med.name} className="h-full w-full object-contain grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute top-2 left-2">
                    <span className="rounded-full bg-white/90 border border-brand-border px-2 py-0.5 text-[10px] font-bold text-brand-text-muted uppercase tracking-wider shadow-sm">
                      {med.category}
                    </span>
                  </div>
                </div>
                
                <div className="mt-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-[11px] text-yellow-500 font-bold uppercase tracking-wide">
                      <Star className="mr-1 h-3 w-3 fill-current" /> High Rated
                    </div>
                    {med.stock < 10 && <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">LOW STOCK</span>}
                  </div>
                  <h3 className="mt-2 text-[15px] font-bold text-brand-text-main group-hover:text-brand-primary transition-colors leading-snug">{med.name}</h3>
                  <p className="mt-2 text-[12px] text-brand-text-muted line-clamp-2 italic">Standard pharmaceutical grade</p>
                  
                  <div className="mt-auto pt-5 flex items-center justify-between border-t border-brand-border">
                    <p className="text-[18px] font-black text-brand-text-main">₹{med.price}</p>
                    <button 
                      onClick={() => handleAddToCart(med)}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all shadow-sm ${
                        addedId === med.id 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-brand-primary text-white hover:bg-brand-primary-hover'
                      }`}
                    >
                      {addedId === med.id ? <CheckCircle2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <div className="mt-24 rounded-[3rem] bg-blue-50 p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/30">
          <Truck className="h-8 w-8" />
        </div>
        <h2 className="mt-8 text-3xl font-bold text-neutral-900">Safe Delivery at Your Doorstep</h2>
        <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">Our medicines undergo 3-step quality checks and are handled with utmost care. Delivery available in all major cities.</p>
        <button className="mt-8 rounded-2xl bg-white px-8 py-3 font-bold text-blue-600 shadow-sm ring-1 ring-blue-100 hover:bg-blue-600 hover:text-white transition-all">
          View Delivery Policies
        </button>
      </div>
    </div>
  );
}
