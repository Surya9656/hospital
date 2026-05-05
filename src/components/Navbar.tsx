import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Heart, ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 h-[72px] border-b border-brand-border bg-white flex items-center shrink-0">
      <div className="mx-auto w-full px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-brand-primary">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
          <span className="text-xl font-extrabold tracking-tight text-neutral-900">HealthNx</span>
        </Link>

        {/* Global Links */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          <Link to="/doctors" className="text-sm font-semibold text-brand-text-muted hover:text-brand-primary transition-colors">Find Doctors</Link>
          <Link to="/pharmacy" className="text-sm font-semibold text-brand-text-muted hover:text-brand-primary transition-colors">Pharmacy</Link>
          
          <div className="h-6 w-px bg-brand-border mx-2"></div>

          {user ? (
            <div className="user-profile flex items-center gap-4">
              <div className="hidden lg:block text-right">
                <div className="text-[13px] font-bold text-brand-text-main leading-tight">{user.name}</div>
                <div className="text-[11px] font-semibold text-brand-text-muted uppercase tracking-wider">{user.role}</div>
              </div>
              <Link to="/profile" className="h-9 w-9 rounded-full bg-[#cbd5e1] overflow-hidden flex items-center justify-center text-white">
                <User className="h-5 w-5" />
              </Link>
              <Link to="/cart" className="relative text-brand-text-muted hover:text-brand-primary p-2">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-brand-primary text-[10px] font-bold text-white flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 text-brand-text-muted hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-6">
              <Link to="/login" className="text-sm font-bold text-brand-text-muted hover:text-brand-text-main">Sign In</Link>
              <Link to="/signup" className="rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-primary-hover transition-all">Get Started</Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-neutral-600">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-neutral-100 bg-white md:hidden"
          >
            <div className="space-y-1 px-4 pb-6 pt-4">
              <Link to="/doctors" className="block py-3 text-base font-medium text-neutral-600" onClick={() => setIsOpen(false)}>Find Doctors</Link>
              <Link to="/pharmacy" className="block py-3 text-base font-medium text-neutral-600" onClick={() => setIsOpen(false)}>Pharmacy</Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="block py-3 text-base font-medium text-neutral-600" onClick={() => setIsOpen(false)}>Dashboard</Link>
                  <Link to="/profile" className="block py-3 text-base font-medium text-neutral-600" onClick={() => setIsOpen(false)}>Profile</Link>
                  <button onClick={handleLogout} className="flex w-full items-center py-3 text-base font-medium text-red-600">
                    <LogOut className="mr-2 h-5 w-5" /> Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Link to="/login" className="flex items-center justify-center rounded-xl bg-neutral-100 px-4 py-3 text-sm font-semibold text-neutral-900" onClick={() => setIsOpen(false)}>Login</Link>
                  <Link to="/signup" className="flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg" onClick={() => setIsOpen(false)}>Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
