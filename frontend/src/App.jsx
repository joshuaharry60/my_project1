import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LiveMapTracker from './components/LiveMapTracker';
import ServicesShowcase from './components/ServicesShowcase';
import FleetCoverageMap from './components/FleetCoverageMap';
import CustomerDashboard from './components/CustomerDashboard';
import QuoteCalculatorModal from './components/QuoteCalculatorModal';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';

import { fetchShipmentByCode, fetchAllShipments } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeShipment, setActiveShipment] = useState(null);
  const [allShipments, setAllShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('bharry_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Load default demo shipment & all shipments on mount
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const shipmentData = await fetchShipmentByCode('BHL-NG-88492');
        setActiveShipment(shipmentData);

        const listData = await fetchAllShipments();
        setAllShipments(listData);
      } catch (err) {
        console.error('Error fetching initial shipments:', err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const handleTrackCode = async (code) => {
    setLoading(true);
    try {
      const data = await fetchShipmentByCode(code);
      setActiveShipment(data);
      setActiveTab('home');
      
      // Smooth scroll down to map section
      setTimeout(() => {
        const el = document.getElementById('live-map-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
    } catch (err) {
      console.error('Error tracking code:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bharry_access_token');
    localStorage.removeItem('bharry_refresh_token');
    localStorage.removeItem('bharry_user');
    setCurrentUser(null);
    if (activeTab === 'dashboard') {
      setActiveTab('home');
    }
  };

  const handleBookWithQuote = (quoteData) => {
    if (!currentUser) {
      setAuthModalOpen(true);
    } else {
      setActiveTab('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans">
      
      {/* Navigation Header */}
      <Navbar
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenQuote={() => setQuoteModalOpen(true)}
        onTrackCode={handleTrackCode}
        currentUser={currentUser}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Dynamic Main Body Content */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <HeroSection
              onSearchTrack={handleTrackCode}
              onOpenQuote={() => setQuoteModalOpen(true)}
            />

            {/* Live Nigeria Highway Telemetry Tracker */}
            {activeShipment && (
              <LiveMapTracker
                shipment={activeShipment}
                onSelectAnother={handleTrackCode}
              />
            )}

            <ServicesShowcase
              onOpenQuote={() => setQuoteModalOpen(true)}
            />

            <FleetCoverageMap />
          </>
        )}

        {activeTab === 'services' && (
          <div className="pt-20">
            <ServicesShowcase onOpenQuote={() => setQuoteModalOpen(true)} />
          </div>
        )}

        {activeTab === 'coverage' && (
          <div className="pt-20">
            <FleetCoverageMap />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <CustomerDashboard
            currentUser={currentUser}
            shipments={allShipments}
            onTrackCode={handleTrackCode}
            onOpenQuote={() => setQuoteModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenQuote={() => setQuoteModalOpen(true)} />

      {/* Quote Calculation Modal */}
      <QuoteCalculatorModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        onBookWithQuote={handleBookWithQuote}
      />

      {/* Authentication Modal (Google & Email/Password) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(user) => setCurrentUser(user)}
      />

    </div>
  );
}

export default App;
