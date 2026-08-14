import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MobileFrame } from './components/MobileFrame';
import { HomeScreen } from './components/screens/HomeScreen';
import { ProblemSolverScreen } from './components/screens/ProblemSolverScreen';
import { ScamDetectorScreen } from './components/screens/ScamDetectorScreen';
import { ImageAnalyzerScreen } from './components/screens/ImageAnalyzerScreen';
import { VoiceAssistantScreen } from './components/screens/VoiceAssistantScreen';
import { ServicesScreen } from './components/screens/ServicesScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { MemoryScreen } from './components/screens/MemoryScreen';
import { AdminDashboardScreen } from './components/screens/AdminDashboardScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { HelpScreen } from './components/screens/HelpScreen';
import { AuthModal } from './components/screens/AuthModal';
import { SubscriptionModal } from './components/screens/SubscriptionModal';
import { ShareModal } from './components/ShareModal';
import { LocationAdvisorModal } from './components/LocationAdvisorModal';

import {
  INITIAL_USER,
  MOCK_SERVICES,
  MOCK_NOTIFICATIONS,
  MOCK_MEMORIES,
} from './data/mockData';
import { LocalService, NotificationItem, MemoryItem, UserProfile, ProblemCategory, DeviceLocation } from './types';

export default function App() {
  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');

  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [services, setServices] = useState<LocalService[]>(MOCK_SERVICES);
  const [notifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [memories] = useState<MemoryItem[]>(MOCK_MEMORIES);

  // Real-time device location state
  const [currentLocation, setCurrentLocation] = useState<DeviceLocation>({
    latitude: 19.076,
    longitude: 72.8777,
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    neighborhood: 'Bandra West',
    formattedAddress: 'Bandra West, Mumbai, Maharashtra',
    isLiveGps: false,
    lastUpdated: '10:00 AM',
  });

  const [selectedCategoryForSolver, setSelectedCategoryForSolver] = useState<ProblemCategory | undefined>(undefined);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Auto-detect real-time GPS location on initial load if permitted
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
              { headers: { 'Accept-Language': 'en' } }
            );
            if (res.ok) {
              const geoData = await res.json();
              const addr = geoData.address || {};
              const city = addr.city || addr.town || addr.village || addr.suburb || 'Your City';
              const state = addr.state || 'Your State';
              const country = addr.country || 'India';
              const neighborhood = addr.suburb || addr.neighbourhood || '';

              const detectedLoc: DeviceLocation = {
                latitude: lat,
                longitude: lng,
                accuracyMeters: Math.round(position.coords.accuracy),
                city,
                state,
                country,
                neighborhood,
                postalCode: addr.postcode || '',
                formattedAddress: `${neighborhood ? neighborhood + ', ' : ''}${city}, ${state}`,
                isLiveGps: true,
                lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              };
              setCurrentLocation(detectedLoc);
              setUser((prev) => ({ ...prev, location: `${city}, ${state}` }));
            }
          } catch (e) {
            console.warn('Auto reverse geocode skipped:', e);
          }
        },
        (err) => {
          console.log('Location permission not granted or GPS unavailable on startup:', err.message);
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
      );
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLocationUpdate = (newLoc: DeviceLocation) => {
    setCurrentLocation(newLoc);
    setUser((prev) => ({
      ...prev,
      location: `${newLoc.city}, ${newLoc.state}`,
    }));
  };

  const handleNavigate = (tab: string, extra?: any) => {
    if (extra?.category) {
      setSelectedCategoryForSolver(extra.category);
    }
    if (extra?.serviceId) {
      setSelectedServiceId(extra.serviceId);
    }
    setActiveTab(tab);
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            user={user}
            services={services}
            notifications={notifications}
            memories={memories}
            currentLocation={currentLocation}
            onOpenLocationAdvisor={() => setShowLocationModal(true)}
            onNavigate={handleNavigate}
            onOpenScamScanner={() => setActiveTab('scam')}
            onOpenShare={() => setShowShareModal(true)}
          />
        );
      case 'chat':
        return (
          <ProblemSolverScreen
            user={user}
            currentLocation={currentLocation}
            initialCategory={selectedCategoryForSolver}
            onNavigateToService={(srvId) => handleNavigate('services', { serviceId: srvId })}
          />
        );
      case 'scam':
        return <ScamDetectorScreen />;
      case 'image_analyzer':
        return <ImageAnalyzerScreen />;
      case 'voice':
        return <VoiceAssistantScreen />;
      case 'services':
        return <ServicesScreen services={services} initialServiceId={selectedServiceId} />;
      case 'notifications':
        return (
          <NotificationsScreen
            notifications={notifications}
            onOpenScamScanner={() => setActiveTab('scam')}
          />
        );
      case 'memory':
        return <MemoryScreen memories={memories} />;
      case 'admin':
        return <AdminDashboardScreen />;
      case 'settings':
        return (
          <SettingsScreen
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            language={language}
            setLanguage={setLanguage}
            user={user}
          />
        );
      case 'help':
        return <HelpScreen />;
      default:
        return (
          <HomeScreen
            user={user}
            services={services}
            notifications={notifications}
            memories={memories}
            currentLocation={currentLocation}
            onOpenLocationAdvisor={() => setShowLocationModal(true)}
            onNavigate={handleNavigate}
            onOpenScamScanner={() => setActiveTab('scam')}
            onOpenShare={() => setShowShareModal(true)}
          />
        );
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      {/* Top Header */}
      <Header
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        language={language}
        setLanguage={setLanguage}
        user={user}
        currentLocation={currentLocation}
        onOpenLocationAdvisor={() => setShowLocationModal(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenSubscription={() => setShowSubscriptionModal(true)}
        onOpenScamScanner={() => setActiveTab('scam')}
        onOpenShare={() => setShowShareModal(true)}
        currentTab={activeTab}
        setCurrentTab={setActiveTab}
      />

      {/* Main Container Shell */}
      <MobileFrame
        isMobileFrame={isMobileFrame}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadNotifsCount={unreadCount}
      >
        {renderActiveScreen()}
      </MobileFrame>

      {/* Modals */}
      {showLocationModal && (
        <LocationAdvisorModal
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          currentLocation={currentLocation}
          onLocationUpdate={handleLocationUpdate}
          onNavigateToScam={() => {
            setShowLocationModal(false);
            setActiveTab('scam');
          }}
        />
      )}

      {showAuthModal && (
        <AuthModal user={user} setUser={setUser} onClose={() => setShowAuthModal(false)} />
      )}

      {showSubscriptionModal && (
        <SubscriptionModal
          user={user}
          setUser={setUser}
          onClose={() => setShowSubscriptionModal(false)}
        />
      )}

      {showShareModal && (
        <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
      )}
    </div>
  );
}
