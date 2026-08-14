import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Star,
  Phone,
  CheckCircle2,
  Calendar,
  Filter,
  Map as MapIcon,
  List,
  ChevronRight,
  ShieldCheck,
  X,
  PhoneCall,
} from 'lucide-react';
import { LocalService, ProblemCategory } from '../../types';

interface ServicesScreenProps {
  services: LocalService[];
  initialServiceId?: string;
}

export const ServicesScreen: React.FC<ServicesScreenProps> = ({
  services,
  initialServiceId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'price'>('rating');
  const [isMapView, setIsMapView] = useState(false);
  const [selectedService, setSelectedService] = useState<LocalService | null>(
    services.find((s) => s.id === initialServiceId) || null
  );

  const categories = [
    { id: 'all', label: 'All Trades' },
    { id: 'plumber', label: 'Plumbers' },
    { id: 'electrician', label: 'Electricians' },
    { id: 'doctor', label: 'Doctors & Clinics' },
    { id: 'tutor', label: 'Tutors' },
    { id: 'mechanic', label: 'Mechanics' },
    { id: 'lawyer', label: 'Lawyers' },
  ];

  let filtered = services.filter((s) => {
    if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
    if (
      searchQuery &&
      !s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !s.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'distance') {
    filtered.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  return (
    <div className="space-y-4">
      {/* Monetization / Partner Network CTA Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-2xl p-4 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-indigo-700/50">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-indigo-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full">
                Partner Network
              </span>
              <span className="text-xs text-indigo-200">Earn with LifeFix AI</span>
            </div>
            <h3 className="text-sm font-bold mt-0.5 text-white">
              Are you a Plumber, Electrician or Mechanic?
            </h3>
            <p className="text-xs text-indigo-200 max-w-md">
              Join 380+ verified local pros receiving daily paid diagnostic jobs in your neighborhood.
            </p>
          </div>
        </div>
        <button
          onClick={() => alert("🎉 Service Partner Application Form Opened!\n\nSubmit your Aadhaar / Trade License & City to get verified within 24 hours.")}
          className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-indigo-950 font-bold text-xs shadow-sm transition-colors whitespace-nowrap shrink-0"
        >
          Join as Service Partner
        </button>
      </div>

      {/* Search & Sort Controls Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search local plumbers, doctors, mechanics..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <button
            onClick={() => setIsMapView(!isMapView)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-200 transition-colors"
          >
            {isMapView ? <List className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
            <span className="hidden sm:inline">{isMapView ? 'List' : 'Map'}</span>
          </button>
        </div>

        {/* Category Horizontal Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Sort option radio */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span>Sort Providers By:</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSortBy('rating')}
              className={`font-semibold ${sortBy === 'rating' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}
            >
              Rating ★
            </button>
            <button
              onClick={() => setSortBy('distance')}
              className={`font-semibold ${sortBy === 'distance' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}
            >
              Nearest 📍
            </button>
          </div>
        </div>
      </div>

      {/* Map View Simulation */}
      {isMapView ? (
        <div className="bg-slate-800 rounded-2xl h-80 relative overflow-hidden flex items-center justify-center p-4 text-white shadow-md border border-slate-700">
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

          {/* Simulated Map Pins */}
          {filtered.map((srv, idx) => (
            <div
              key={srv.id}
              onClick={() => setSelectedService(srv)}
              style={{ top: `${20 + (idx * 22) % 60}%`, left: `${15 + (idx * 30) % 70}%` }}
              className="absolute cursor-pointer group"
            >
              <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg flex items-center gap-1 text-xs font-bold group-hover:scale-110 transition-transform">
                <MapPin className="w-4 h-4 fill-current" />
                <span>{srv.name.split(' ')[0]}</span>
              </div>
            </div>
          ))}

          <div className="absolute bottom-3 left-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-xl text-slate-800 dark:text-slate-100 text-xs flex items-center justify-between">
            <span>Showing {filtered.length} verified providers in Austin, TX</span>
            <span className="font-bold text-indigo-600">GPS Live</span>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filtered.map((srv) => (
            <div
              key={srv.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-indigo-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <img
                  src={srv.image}
                  alt={srv.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {srv.name}
                    </h3>
                    {srv.verified && (
                      <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> VERIFIED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">
                    {srv.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
                    <span className="text-amber-500 font-bold flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-current" /> {srv.rating} ({srv.reviewsCount})
                    </span>
                    <span>•</span>
                    <span>📍 {srv.distanceKm} km away</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {srv.hourlyRate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">
                  {srv.availability}
                </span>

                <button
                  onClick={() => setSelectedService(srv)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call & Book</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking / Contact Service Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Verified Local Service Provider
                </h3>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={selectedService.image}
                alt={selectedService.name}
                className="w-16 h-16 rounded-2xl object-cover"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedService.name}
                </h4>
                <p className="text-xs text-slate-500">{selectedService.address}</p>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                  Rate: {selectedService.hourlyRate}
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs space-y-1">
              <p className="font-bold text-slate-700 dark:text-slate-200">
                LifeFix Service Guarantee:
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Upfront pricing verified. No hidden dispatch charges. 100% background checked.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedService.phone}`}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Directly</span>
                </a>
                <a
                  href={`https://wa.me/?text=Hi%20${encodeURIComponent(selectedService.name)},%20I%20found%20you%20on%20LifeFix%20AI%20and%20need%20a%20technician%20service%20visit.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>WhatsApp Chat</span>
                </a>
              </div>

              <button
                onClick={() => {
                  alert(`✅ Appointment Confirmed! Booking Ref #LFX-${Math.floor(10000 + Math.random() * 90000)}\n\nTechnician: ${selectedService.name}\nDiagnostic Visit Fee: ₹149 (Paid on arrival)\nTechnician is dispatched and will call you within 10 minutes.`);
                  setSelectedService(null);
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Verified Visit (₹149 / $15 Inspection)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
