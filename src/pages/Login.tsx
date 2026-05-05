import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/axios';
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Heart } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-brand-bg px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="card-polish p-10 bg-white">
          <div className="text-center">
            <Link to="/" class="inline-flex items-center space-x-2 text-brand-primary mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
            </Link>
            <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">Sign In</h2>
            <p className="mt-2 text-[14px] text-brand-text-muted font-medium">Access your professional health dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="rounded-lg bg-red-50 p-4 text-[13px] font-bold text-red-600 border border-red-100"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-[12px] font-bold uppercase tracking-wider text-brand-text-muted">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-brand-border bg-white px-4 py-3 text-[14px] font-medium text-brand-text-main placeholder:text-neutral-400 focus:border-brand-primary focus:ring-0 transition-all outline-none"
                  placeholder="name@healthcare.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-bold uppercase tracking-wider text-brand-text-muted">Password</label>
                <button type="button" className="text-[11px] font-bold text-brand-primary hover:underline uppercase tracking-tighter">Forgot Password?</button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-brand-border bg-white px-4 py-3 text-[14px] font-medium text-brand-text-main placeholder:text-neutral-400 focus:border-brand-primary focus:ring-0 transition-all outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-400 hover:text-brand-text-main"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-brand-primary py-3.5 text-[15px] font-bold text-white shadow-sm hover:bg-brand-primary-hover active:scale-[0.99] transition-all disabled:opacity-70"
            >
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Sign In to Portal'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[13px] font-semibold text-brand-text-muted">
              Personnel without credentials?{' '}
              <Link to="/signup" className="text-brand-primary hover:underline font-bold">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
