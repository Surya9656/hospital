import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import api from '../lib/axios';
import { Search, Star, Filter, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  image: string;
  experience: string;
  fee: number;
}

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await api.get('/doctors');
        setDoctors(data);
      } catch (err) {
        console.error('Failed to fetch doctors', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">
            Find Specialists
          </h1>
          <p className="mt-2 text-neutral-500 font-medium">
            Book appointments with top-rated doctors across various specialties.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-14 w-full rounded-2xl bg-white pl-12 pr-4 font-medium text-neutral-900 shadow-sm ring-1 ring-neutral-200 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
          />
        </div>
      </div>

      <div className="mt-12 flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-8">

          {/* Filters */}
          <div className="rounded-xl bg-brand-sidebar p-6 shadow-brand border border-brand-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-brand-text-main flex items-center text-sm">
                <Filter className="mr-2 h-4 w-4" /> Filters
              </h3>
              <button className="text-xs font-bold text-brand-primary">Reset</button>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-brand-text-muted">
                Specialty
              </label>

              <div className="mt-3 space-y-2">
                {['Cardiology', 'Neurology', 'Pediatrics', 'Dermatology'].map((s) => (
                  <label key={s} className="flex items-center space-x-3 cursor-pointer group">
                    <div className="h-4 w-4 rounded border border-brand-border group-hover:border-brand-primary"></div>
                    <span className="text-[13px] font-medium text-brand-text-muted group-hover:text-brand-text-main">
                      {s}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Help Card */}
          <div className="rounded-xl bg-brand-primary p-6 text-white shadow-lg overflow-hidden relative">
            <div className="relative z-10">
              <h4 className="font-bold text-sm">Need Help?</h4>

              <p className="mt-2 text-[12px] text-blue-100 leading-snug">
                Consult with our advisors for personalized recommendations.
              </p>

              {/* ✅ WORKING CALL BUTTON */}
              <a
                href="tel:+919676568442" // 👉 replace with your number
                className="mt-4 block text-center w-full rounded-lg bg-white py-2 text-xs font-bold text-brand-primary hover:bg-neutral-50 transition-all"
              >
                Call Now
              </a>
            </div>

            <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-white/10 rounded-full"></div>
          </div>
        </aside>

        {/* Doctors Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-48 animate-pulse rounded-xl bg-neutral-200"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {filteredDoctors.map((doc, idx) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group card-polish p-6 hover:border-brand-primary/30 transition-all"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold bg-brand-accent px-2 py-0.5 rounded-full">
                          Verified
                        </span>

                        <div className="flex items-center text-yellow-500 font-bold text-xs">
                          <Star className="mr-1 h-3 w-3 fill-current" />
                          {doc.rating}
                        </div>
                      </div>

                      <h3 className="mt-2 text-[16px] font-bold">
                        {doc.name}
                      </h3>

                      <p className="text-[13px] font-semibold text-neutral-500">
                        {doc.specialty}
                      </p>

                      <div className="mt-3 flex gap-3 text-[11px] text-neutral-400 uppercase">
                        <span>{doc.experience} EXP</span>
                        <span>•</span>
                        <span>Apollo multispecialty</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between pt-6 border-t">
                    <div className="text-xl font-bold">
                      ₹{doc.fee}
                    </div>

                    <Link
                      to={`/book-appointment/${doc.id}`}
                      className="rounded-lg bg-brand-primary px-5 py-2 text-xs font-bold text-white"
                    >
                      Book Visit
                    </Link>
                  </div>
                </motion.div>
              ))}

              {filteredDoctors.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <Stethoscope className="mx-auto h-10 w-10 text-neutral-300" />
                  <h3 className="mt-4 text-lg font-bold">No doctors found</h3>
                  <p className="text-neutral-500">
                    Try different search keywords
                  </p>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}