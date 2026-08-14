import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  ShieldAlert,
  PhoneCall,
  AlertTriangle,
  Zap,
  Droplets,
  CloudRain,
  Building2,
  X,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Radio,
  LocateFixed,
} from 'lucide-react';
import { DeviceLocation, LocalAdvisory } from '../types';
import { fetchLocationAdvisory } from '../services/api';

interface LocationAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: DeviceLocation;
  onLocationUpdate: (newLoc: DeviceLocation) => void;
  onNavigateToScam?: () => void;
}

export const LocationAdvisorModal: React.FC<LocationAdvisorModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onLocationUpdate,
  onNavigateToScam,
}) => {
  const [advisory, setAdvisory] = useState<LocalAdvisory | null>(null);
  const [loading, setLoading] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'scams' | 'utilities' | 'climate' | 'emergency'>('scams');
  const [manualCity, setManualCity] = useState('');

  // Popular cities for instant switching
  const popularCities = [
    { city: 'Mumbai', state: 'Maharashtra', country: 'India', lat: 19.076, lng: 72.8777 },
    { city: 'Bengaluru', state: 'Karnataka', country: 'India', lat: 12.9716, lng: 77.5946 },
    { city: 'Delhi-NCR', state: 'Delhi', country: 'India', lat: 28.7041, lng: 77.1025 },
    { city: 'Pune', state: 'Maharashtra', country: 'India', lat: 18.5204, lng: 73.8567 },
    { city: 'Hyderabad', state: 'Telangana', country: 'India', lat: 17.385, lng: 78.4867 },
    { city: 'Chennai', state: 'Tamil Nadu', country: 'India', lat: 13.0827, lng: 80.2707 },
    { city: 'Kolkata', state: 'West Bengal', country: 'India', lat: 22.5726, lng: 88.3639 },
    { city: 'Austin', state: 'Texas', country: 'USA', lat: 30.2672, lng: -97.7431 },
  ];

  const loadAdvisory = async (loc: DeviceLocation) => {
    setLoading(true);
    try {
      const data = await fetchLocationAdvisory(loc);
      if (data) {
        setAdvisory(data);
      }
    } catch (e) {
      console.warn('Failed to load advisory:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAdvisory(currentLocation);
    }
  }, [isOpen, currentLocation.city, currentLocation.state]);

  const handleDetectLiveGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setDetectingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        try {
          // Attempt reverse geocoding with OpenStreetMap Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          );

          if (res.ok) {
            const geoData = await res.json();
            const addr = geoData.address || {};
            const city =
              addr.city ||
              addr.town ||
              addr.village ||
              addr.suburb ||
              addr.state_district ||
              'Your City';
            const state = addr.state || 'Your State';
            const country = addr.country || 'India';
            const neighborhood = addr.suburb || addr.neighbourhood || addr.road || '';
            const postalCode = addr.postcode || '';

            const newLoc: DeviceLocation = {
              latitude: lat,
              longitude: lng,
              accuracyMeters: Math.round(accuracy),
              city,
              state,
              country,
              neighborhood,
              postalCode,
              formattedAddress: `${neighborhood ? neighborhood + ', ' : ''}${city}, ${state}`,
              isLiveGps: true,
              lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            onLocationUpdate(newLoc);
            loadAdvisory(newLoc);
          } else {
            throw new Error('Reverse geocode failed');
          }
        } catch (err) {
          // Fallback if reverse geocode service is rate-limited or blocked
          const newLoc: DeviceLocation = {
            latitude: lat,
            longitude: lng,
            accuracyMeters: Math.round(accuracy),
            city: 'Live GPS Location',
            state: `${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E`,
            country: 'Detected Region',
            formattedAddress: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
            isLiveGps: true,
            lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          onLocationUpdate(newLoc);
          loadAdvisory(newLoc);
        } finally {
          setDetectingGps(false);
        }
      },
      (err) => {
        setDetectingGps(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError('Location permission denied. Please allow location access in your browser or select a city below.');
        } else {
          setGpsError('Unable to retrieve your location. Please select your city manually.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSelectCity = (c: typeof popularCities[0]) => {
    const newLoc: DeviceLocation = {
      latitude: c.lat,
      longitude: c.lng,
      city: c.city,
      state: c.state,
      country: c.country,
      formattedAddress: `${c.city}, ${c.state}, ${c.country}`,
      isLiveGps: false,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    onLocationUpdate(newLoc);
    loadAdvisory(newLoc);
    setGpsError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Radio className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-full">
                Real-Time Location Radar
              </span>
              <h2 className="text-lg font-black mt-0.5">
                Local Safety & Utility Advisory
              </h2>
            </div>
          </div>

          {/* Current Detected Location Display Pill */}
          <div className="mt-3 bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-400 text-emerald-950 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">
                    {currentLocation.formattedAddress || `${currentLocation.city}, ${currentLocation.state}`}
                  </span>
                  {currentLocation.isLiveGps && (
                    <span className="text-[9px] bg-emerald-400 text-emerald-950 font-black px-1.5 py-0.2 rounded-full">
                      LIVE GPS
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-blue-100">
                  Lat: {currentLocation.latitude.toFixed(3)}, Lng: {currentLocation.longitude.toFixed(3)} • Updated {currentLocation.lastUpdated || 'just now'}
                </p>
              </div>
            </div>

            <button
              onClick={handleDetectLiveGps}
              disabled={detectingGps}
              className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-white text-indigo-950 hover:bg-slate-100 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              {detectingGps ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  <span>Detecting GPS...</span>
                </>
              ) : (
                <>
                  <LocateFixed className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Detect Live GPS</span>
                </>
              )}
            </button>
          </div>

          {gpsError && (
            <div className="mt-2 text-xs bg-rose-500/90 text-white p-2 rounded-xl border border-rose-400/50 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{gpsError}</span>
            </div>
          )}
        </div>

        {/* Quick City Switcher Chips */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 overflow-x-auto flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 shrink-0 mr-1">Switch Region:</span>
          {popularCities.map((c) => {
            const isSelected = currentLocation.city.toLowerCase() === c.city.toLowerCase();
            return (
              <button
                key={c.city}
                onClick={() => handleSelectCity(c)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                }`}
              >
                {c.city}
              </button>
            );
          })}
        </div>

        {/* Advisory Sub-Tabs */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-4 pt-2">
          <button
            onClick={() => setActiveTab('scams')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'scams'
                ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Active Local Scams</span>
          </button>
          <button
            onClick={() => setActiveTab('utilities')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'utilities'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Utility & Govt Portals</span>
          </button>
          <button
            onClick={() => setActiveTab('climate')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'climate'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Home & Weather Care</span>
          </button>
          <button
            onClick={() => setActiveTab('emergency')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'emergency'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency Hubs</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto space-y-4">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-medium">
                Scanning local cyber cell threat feeds & utility databases for {currentLocation.city}...
              </p>
            </div>
          ) : advisory ? (
            <>
              {/* Tab 1: Active Local Scams */}
              {activeTab === 'scams' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      High-frequency cyber fraud reported in <strong>{currentLocation.city} / {currentLocation.state}</strong>:
                    </p>
                    <span className="text-[10px] font-black text-rose-700 bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
                      LIVE THREAT RADAR
                    </span>
                  </div>

                  {advisory.activeScams.map((scam, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {scam.title}
                          </h4>
                        </div>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            scam.urgency === 'high'
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {scam.urgency} Urgency
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {scam.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="bg-white/80 dark:bg-slate-800/80 p-2 rounded-xl border border-rose-100 dark:border-slate-700">
                          <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                            🎯 Common Targets:
                          </span>
                          <span className="text-slate-500">{scam.commonTargets}</span>
                        </div>
                        <div className="bg-white/80 dark:bg-slate-800/80 p-2 rounded-xl border border-emerald-200 dark:border-slate-700">
                          <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                            🛡️ Safety Defense:
                          </span>
                          <span className="text-slate-600 dark:text-slate-400">{scam.prevention}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToScam?.();
                      }}
                      className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>Analyze Suspicious Message in Scam Shield</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Utility & Govt Portals */}
              {activeTab === 'utilities' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Official authorities & verified helpline portals for <strong>{currentLocation.city}</strong>:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                        <Zap className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Electricity Board</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {advisory.utilityAndGovt.electricityBoard}
                      </h4>
                      <p className="text-[11px] text-slate-500">Official power distribution & outage helpline</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <Droplets className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Water & Municipal</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {advisory.utilityAndGovt.waterAuthority}
                      </h4>
                      <p className="text-[11px] text-slate-500">Municipal supply, tanker & sewer authority</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 space-y-1">
                      <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                        <ShieldAlert className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Cyber Crime Helpline</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {advisory.utilityAndGovt.cyberCellNumber}
                      </h4>
                      <p className="text-[11px] text-slate-500">National cyber financial fraud reporting</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-1">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <PhoneCall className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Emergency Dispatch</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {advisory.utilityAndGovt.emergencyNumber}
                      </h4>
                      <p className="text-[11px] text-slate-500">Police, Ambulance, Fire rapid response</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Climate & Home Care */}
              {activeTab === 'climate' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Location-tailored household preservation & appliance tips for <strong>{currentLocation.city}</strong>:
                  </p>

                  {advisory.climateAndHomeWarnings.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3"
                    >
                      <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
                        {item.type === 'rain' ? (
                          <CloudRain className="w-4 h-4" />
                        ) : item.type === 'water_quality' ? (
                          <Droplets className="w-4 h-4" />
                        ) : (
                          <Zap className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          {item.tip}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Nearest Emergency Hubs */}
              {activeTab === 'emergency' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Nearest emergency infrastructure mapped to your coordinates in <strong>{currentLocation.city}</strong>:
                  </p>

                  {advisory.nearestEmergencyHubs.map((hub, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center justify-between gap-3"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          {hub.type}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {hub.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          📍 {hub.distance}
                        </p>
                      </div>

                      <a
                        href={`tel:${hub.phone.replace(/[^0-9]/g, '') || '112'}`}
                        className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call {hub.phone}</span>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No advisory data available for this region. Click "Detect Live GPS" to refresh.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Powered by LifeFix AI Regional Safety Engine
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            Close Radar
          </button>
        </div>
      </div>
    </div>
  );
};
