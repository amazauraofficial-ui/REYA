/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductsSection from './components/ProductsSection';
import ServicesSection from './components/ServicesSection';
import MeditationProgramSection from './components/MeditationProgramSection';
import BookingSection from './components/BookingSection';
import AtmosphereGallerySection from './components/AtmosphereGallerySection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import PalmLeavesDecoration from './components/PalmLeavesDecoration';
import FloatingBotanicals from './components/FloatingBotanicals';
import ScrollProgressIndicator from './components/ScrollProgressIndicator';
import BookingConfirmationModal from './components/BookingConfirmationModal';
import ServiceDetailModal from './components/ServiceDetailModal';
import AbonnementModal from './components/AbonnementModal';
import AuthModal from './components/AuthModal';
import PatientPortalModal from './components/portals/PatientPortalModal';
import ProviderPortalModal from './components/portals/ProviderPortalModal';
import AdminPortalModal from './components/portals/AdminPortalModal';
import DemoRoleBar from './components/DemoRoleBar';
import { AuthProvider } from './context/AuthContext';
import { ServiceItem, BookingConfirmation, Language } from './types';
import { SERVICES_DATA } from './data/spaData';

function SpaAppContent() {
  const [language, setLanguage] = useState<Language>('en');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [bookingConfirmation, setBookingConfirmation] = useState<BookingConfirmation | null>(null);
  const [abonnementModalOpen, setAbonnementModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [patientPortalOpen, setPatientPortalOpen] = useState(false);
  const [providerPortalOpen, setProviderPortalOpen] = useState(false);
  const [adminPortalOpen, setAdminPortalOpen] = useState(false);
  const [showDemoBar, setShowDemoBar] = useState(true);

  // Global Keyboard Shortcut: Ctrl + S or Cmd + S to open Admin Portal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault(); // Prevent browser Save Webpage dialog!
        setAdminPortalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll to booking section smoothly
  const scrollToBooking = () => {
    const el = document.getElementById('booking');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLearnMoreHero = () => {
    const services = SERVICES_DATA[language];
    setSelectedService(services[0]);
  };

  const handleLearnMoreProducts = () => {
    const services = SERVICES_DATA[language];
    setSelectedService(services[2]); // Aroma & botanical wrap
  };

  const handleSelectService = (service: ServiceItem) => {
    setSelectedService(service);
  };

  const handleBookService = (service: ServiceItem) => {
    scrollToBooking();
  };

  const handleSelectAbonnement = (name: string, price: string) => {
    setBookingConfirmation({
      id: `PASS-${Math.floor(100000 + Math.random() * 900000)}`,
      guestName: 'Cherished Guest',
      phone: '+375 29 345-44-55',
      date: 'Valid for 12 months',
      timeSlot: 'Flexible Booking',
      serviceTitle: `${name} (Gift Certificate / Pass)`,
      price: price,
      roomName: 'VIP Sanctuary Suite',
    });
  };

  return (
    <div className="min-h-screen bg-[#090f10] text-[#e3ded4] font-sans-clean relative overflow-x-hidden">
      {/* Subtle Luxury Scroll Progress Bar with Spring Dynamics */}
      <ScrollProgressIndicator language={language} />
      
      {/* Unified Fixed Header & System Ribbon */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        {showDemoBar && (
          <DemoRoleBar
            onClose={() => setShowDemoBar(false)}
            onOpenPatientPortal={() => setPatientPortalOpen(true)}
            onOpenProviderPortal={() => setProviderPortalOpen(true)}
            onOpenAdminPortal={() => setAdminPortalOpen(true)}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        <Navbar
          language={language}
          onLanguageChange={setLanguage}
          onOpenBooking={scrollToBooking}
          onOpenAbonnements={() => setAbonnementModalOpen(true)}
          onOpenPortal={() => setPatientPortalOpen(true)}
          onOpenAdmin={() => setAdminPortalOpen(true)}
          showDemoBar={showDemoBar}
          onToggleDemoBar={() => setShowDemoBar((prev) => !prev)}
        />
      </header>

      {/* Decorative Botanical Palm Fronds & Floating Ambient Elements */}
      <PalmLeavesDecoration position="left" className="top-[38vh]" swayDuration={13} />
      <PalmLeavesDecoration position="left" className="top-[140vh]" swayDuration={15} />
      <PalmLeavesDecoration position="right" className="top-[230vh]" swayDuration={14} />
      <PalmLeavesDecoration position="right" className="top-[340vh]" swayDuration={16} />
      <FloatingBotanicals />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* Section 1: Hero / About Us with Cursive Layer & Organic Massage Pebble */}
        <HeroSection
          language={language}
          onLearnMore={handleLearnMoreHero}
          onBook={scrollToBooking}
        />

        {/* Section 2: Products with Organic Candle/Stone Pebble & Cursive Layer */}
        <ProductsSection
          language={language}
          onLearnMore={handleLearnMoreProducts}
          onExplore={() => setAbonnementModalOpen(true)}
        />

        {/* Section 3: Services with 4 Circular Glowing Previews & 4 Line-Art Treatment Cards */}
        <ServicesSection
          language={language}
          onSelectService={handleSelectService}
          onBookService={handleBookService}
        />

        {/* Section 4: Signature Meditation Spa Day (3-hour Program from Image 2) */}
        <MeditationProgramSection
          language={language}
          onBookProgram={scrollToBooking}
        />

        {/* Section 5: Date & Time Reservation Engine (From Image 2) */}
        <BookingSection
          language={language}
          onBookingSuccess={(conf) => setBookingConfirmation(conf)}
        />

        {/* Section 6: Enchanting Atmosphere Room Gallery (From Image 2) */}
        <AtmosphereGallerySection
          language={language}
          onBookRoom={() => scrollToBooking()}
        />

        {/* Section 7: Client Testimonials Carousel */}
        <TestimonialsSection
          language={language}
          onBookExperience={scrollToBooking}
        />

        {/* Section 8: Sanctuary Inquiries & Guest Etiquette (Accordion FAQ) */}
        <FAQSection
          language={language}
          onBookClick={scrollToBooking}
        />
      </main>

      {/* Footer with Contacts, Socials & Legal */}
      <Footer
        language={language}
        onOpenBooking={scrollToBooking}
        onOpenAbonnements={() => setAbonnementModalOpen(true)}
      />

      {/* Floating Admin Portal Shortcut Badge (Ctrl+S) */}
      <button
        onClick={() => setAdminPortalOpen((prev) => !prev)}
        className="fixed bottom-4 right-4 z-40 px-3 py-1.5 rounded-full bg-[#0b1213]/90 hover:bg-[#121c1e] border border-[#d6b77c]/40 text-[#d6b77c] text-xs font-mono shadow-2xl backdrop-blur-md flex items-center gap-2 hover:scale-105 transition-all group"
        title="Open Admin Management Console (Keyboard Shortcut: Ctrl + S)"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="hidden sm:inline font-sans text-[11px] text-[#f7f3eb]">Admin Portal</span>
        <span className="px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-[#d6b77c] border border-white/10 group-hover:border-[#d6b77c]">
          Ctrl+S
        </span>
      </button>

      {/* Modals & Dialogs */}
      <BookingConfirmationModal
        confirmation={bookingConfirmation}
        onClose={() => setBookingConfirmation(null)}
        language={language}
      />

      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onBook={handleBookService}
        language={language}
      />

      <AbonnementModal
        isOpen={abonnementModalOpen}
        onClose={() => setAbonnementModalOpen(false)}
        language={language}
        onSelectAbonnement={handleSelectAbonnement}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        language={language}
      />

      {/* Authenticated Portals */}
      <PatientPortalModal
        isOpen={patientPortalOpen}
        onClose={() => setPatientPortalOpen(false)}
        onOpenBooking={scrollToBooking}
        language={language}
      />

      <ProviderPortalModal
        isOpen={providerPortalOpen}
        onClose={() => setProviderPortalOpen(false)}
        language={language}
      />

      <AdminPortalModal
        isOpen={adminPortalOpen}
        onClose={() => setAdminPortalOpen(false)}
        language={language}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SpaAppContent />
    </AuthProvider>
  );
}
