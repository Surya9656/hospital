import { motion } from 'motion/react';
import { useCart } from '../contexts/CartContext';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Truck, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { useState } from 'react';

export default function Cart() {
  const { items, removeFromCart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      await api.post('/orders', { items, total });
      clearCart();
      alert('Order placed successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Checkout failed. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-32 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100 text-neutral-300">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <h2 className="mt-8 text-4xl font-black text-neutral-900 tracking-tight">Your cart is empty</h2>
        <p className="mt-4 text-lg text-neutral-500 font-medium">Add some medicines to your cart first!</p>
        <Link to="/pharmacy" className="mt-10 inline-flex items-center rounded-2xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all">
          Browse Pharmacy <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-brand-bg">
      <Link to="/pharmacy" className="flex items-center text-[12px] font-bold text-brand-text-muted hover:text-brand-primary uppercase tracking-widest mb-8">
        <ChevronLeft className="mr-1 h-3.5 w-3.5" /> Return to Inventory
      </Link>
      
      <div className="flex items-baseline space-x-4 mb-10">
        <h1 className="text-3xl font-black text-brand-text-main">Checkout</h1>
        <span className="text-[14px] font-bold text-brand-text-muted">Portal ID: CRT-5923</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="px-6 py-4 bg-white border border-brand-border rounded-lg text-[13px] font-bold text-brand-text-muted uppercase tracking-wider flex items-center justify-between">
            <span>Itemized Selection</span>
            <span>{items.length} Unique SKUs</span>
          </div>
          {items.map((item) => (
            <motion.div
              layout
              key={item.id}
              className="flex items-center space-x-6 card-polish bg-white p-5 hover:border-brand-primary/30 transition-all"
            >
              <img src={item.image} alt={item.name} className="h-20 w-20 rounded-lg object-contain bg-[#f8fafc] border border-brand-border p-2" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[15px] font-bold text-brand-text-main">{item.name}</h3>
                    <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-widest">{item.category}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-brand-text-muted hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-[17px] font-black text-brand-text-main">₹{item.price}</span>
                    <span className="text-[11px] font-semibold text-brand-text-muted">/ unit</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-[#f1f5f9] px-3 py-1 rounded-md border border-brand-border">
                    <span className="text-[12px] font-bold text-brand-text-main">QUANTITY: {item.quantity}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-[96px] rounded-xl bg-white border border-brand-border p-8 shadow-brand">
            <h2 className="text-xl font-black text-brand-text-main mb-8 pb-4 border-b border-brand-border">Order Resolution</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-[13px] font-medium text-brand-text-muted">
                <span>Base Subtotal</span>
                <span className="text-brand-text-main font-bold">₹{total}</span>
              </div>
              <div className="flex justify-between text-[13px] font-medium text-brand-text-muted">
                <span>Shipping & Logistics</span>
                <span className="text-emerald-600 font-bold">INCLUDED</span>
              </div>
              <div className="flex justify-between text-[13px] font-medium text-brand-text-muted">
                <span>Applied GST (18%)</span>
                <span className="text-brand-text-main font-bold">₹{Math.round(total * 0.18)}</span>
              </div>
              <div className="pt-6 mt-6 border-t border-brand-border flex justify-between items-end">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-text-muted mb-1">FINAL BILLING AMOUNT</p>
                  <p className="text-3xl font-black text-brand-primary">₹{Math.round(total * 1.18)}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="mt-10 flex w-full items-center justify-center rounded-lg bg-brand-primary py-4 text-[15px] font-bold text-white shadow-sm hover:bg-brand-primary-hover active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {checkingOut ? 'Resolving Payment...' : 'Resolve Order'} <ArrowRight className="ml-2 h-4 w-4" />
            </button>

            <div className="mt-8 space-y-3 pt-6 border-t border-brand-border ">
              <div className="flex items-center text-[12px] font-semibold text-brand-text-muted">
                <ShieldCheck className="mr-2 h-4 w-4 text-emerald-500" shrink-0 /> Fully Encrypted Transaction
              </div>
              <div className="flex items-center text-[12px] font-semibold text-brand-text-muted">
                <Truck className="mr-2 h-4 w-4 text-brand-primary" shrink-0 /> Professional logistics handling
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
