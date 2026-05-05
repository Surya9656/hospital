import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import api from '../lib/axios';
import { Calendar as CalendarIcon, Clock, ChevronLeft, Star, Heart, ShieldCheck, MapPin, Loader2, CheckCircle } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';

const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

export default function AppointmentBooking() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await api.get('/doctors');
        const doc = data.find((d: any) => d.id === doctorId);
        setDoctor(doc);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  const handleBook = async () => {
    if (!selectedTime) return;
    setBooking(true);
    try {
      await api.post('/appointments', {
        doctorId,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      console.error(err);
      alert('Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
    </div>
  );

  if (success) return (
    <div className="mx-auto max-w-lg px-6 py-32 text-center">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-8">
          <CheckCircle className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight">Booking Confirmed!</h1>
        <p className="mt-4 text-lg text-neutral-600">Your appointment with {doctor.name} has been successfully scheduled. Redirecting to your dashboard...</p>
      </motion.div>
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-sm font-bold text-neutral-500 hover:text-neutral-900 transition-colors mb-8">
        <ChevronLeft className="mr-1 h-4 w-4" /> Back to Search
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Doctor Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-[2.5rem] bg-white p-8 shadow-xl shadow-neutral-200/50 ring-1 ring-neutral-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 h-32 w-32 bg-blue-600/5 rounded-full -mr-16 -mt-16"></div>
            <img src={doctor.image} alt={doctor.name} className="h-32 w-32 rounded-3xl object-cover ring-4 ring-neutral-50 shadow-lg mb-6 mx-auto" />
            <div className="text-center">
              <h2 className="text-2xl font-black text-neutral-900 leading-tight">{doctor.name}</h2>
              <p className="mt-1 font-bold text-blue-600">{doctor.specialty}</p>
              <div className="mt-4 flex items-center justify-center space-x-4">
                <div className="flex items-center text-sm font-bold text-yellow-500 bg-yellow-50 px-3 py-1 rounded-full">
                  <Star className="mr-1 h-4 w-4 fill-current" /> {doctor.rating}
                </div>
                <div className="flex items-center text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  <ShieldCheck className="mr-1 h-4 w-4" /> Verified
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <div className="flex items-center text-sm text-neutral-600 font-medium p-3 rounded-2xl bg-neutral-50">
                <MapPin className="mr-3 h-5 w-5 text-blue-600" />
                <span>Apollo Multispeciality Hospitals, Mumbai</span>
              </div>
              <div className="flex items-center text-sm text-neutral-600 font-medium p-3 rounded-2xl bg-neutral-50">
                <Heart className="mr-3 h-5 w-5 text-rose-500" />
                <span>12+ Years Professional Experience</span>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-neutral-100 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Total Consultation Fee</p>
              <p className="mt-1 text-3xl font-black text-neutral-900">₹{doctor.fee}</p>
            </div>
          </div>
        </div>

        {/* Right: Booking Form */}
        <div className="lg:col-span-2 space-y-12">
          {/* Step 1: Select Date */}
          <section>
            <div className="flex items-center space-x-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
                <CalendarIcon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-extrabold text-neutral-900 tracking-tight">Select Date</h3>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
              {dates.map((date) => {
                const isActive = isSameDay(date, selectedDate);
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`flex flex-col items-center justify-center rounded-2xl py-4 transition-all ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 scale-105 ring-2 ring-blue-600 ring-offset-2' 
                        : 'bg-white text-neutral-600 hover:bg-neutral-50 ring-1 ring-neutral-200'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{format(date, 'EEE')}</span>
                    <span className="text-xl font-black">{format(date, 'dd')}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Step 2: Select Time */}
          <section>
            <div className="flex items-center space-x-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-extrabold text-neutral-900 tracking-tight">Select Available Time</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {timeSlots.map((time) => {
                const isActive = selectedTime === time;
                return (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`rounded-2xl py-4 text-sm font-bold transition-all ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 ring-2 ring-blue-600 ring-offset-2' 
                        : 'bg-white text-neutral-600 hover:bg-neutral-50 ring-1 ring-neutral-200 font-bold'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Confirm Button */}
          <div className="pt-8 pt-8 border-t border-neutral-100">
            <button
              onClick={handleBook}
              disabled={!selectedTime || booking}
              className="flex w-full items-center justify-center rounded-3xl bg-neutral-900 py-6 text-xl font-black text-white shadow-2xl shadow-neutral-900/40 hover:bg-black transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:grayscale"
            >
              {booking ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : `Confirm Appointment for ₹${doctor.fee}`}
            </button>
            <p className="mt-4 text-center text-sm font-medium text-neutral-400">By proceeding, you agree to HealthNx's Terms & Privacy Policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
