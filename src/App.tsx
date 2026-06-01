import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCMS } from "@/hooks/useCMS";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Injects the CMS favicon into <head> dynamically
function FaviconInjector() {
  const cms = useCMS();
  useEffect(() => {
    const url = cms.faviconLogo?.url;
    if (!url) return;
    // Remove existing favicon links
    document.querySelectorAll('link[rel~="icon"]').forEach(el => el.remove());
    // Create new favicon link
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = url.endsWith('.png') ? 'image/png' : url.endsWith('.svg') ? 'image/svg+xml' : url.endsWith('.ico') ? 'image/x-icon' : 'image/png';
    link.href = url + '?v=' + Date.now();
    document.head.appendChild(link);
  }, [cms.faviconLogo?.url]);
  return null;
}

// Floating WhatsApp Button — visible on all pages when user scrolls
function FloatingWhatsApp() {
  const cms = useCMS();
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(true);

  const whatsappUrl = cms.settings.whatsapp_number
    ? `https://wa.me/${cms.settings.whatsapp_number.replace(/[^0-9]/g, '')}`
    : 'https://wa.me/201000000000';

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Stop pulse after 4 seconds
  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 9999,
width: '72px',
        height: '72px',
        borderRadius: '50%',
        background: '#25D366',
        boxShadow: '0 4px 20px rgba(37,211,102,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.7) translateY(20px)',
        pointerEvents: visible ? 'auto' : 'none',
        textDecoration: 'none',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.12) translateY(-2px)';
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 28px rgba(37,211,102,0.6)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1) translateY(0)';
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(37,211,102,0.45)';
      }}
    >
      {/* Pulse ring */}
      {pulse && (
        <span style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'rgba(37,211,102,0.4)',
          animation: 'wa-pulse 1.5s ease-out infinite',
        }} />
      )}
      {/* WhatsApp SVG icon */}
<svg viewBox="0 0 32 32" width="40" height="40" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.002 3C9.374 3 4 8.373 4 15.001c0 2.122.556 4.112 1.528 5.84L4 29l8.368-1.51A12.005 12.005 0 0 0 16.002 28C22.629 28 28 22.626 28 16.001 28 9.374 22.629 3 16.002 3zm5.99 16.603c-.248.698-1.458 1.37-1.994 1.404-.536.034-1.044.255-3.522-.735-3-1.197-4.924-4.27-5.072-4.469-.146-.198-1.19-1.582-1.19-3.018 0-1.436.752-2.143 1.02-2.436.267-.293.583-.366.777-.366.195 0 .389.002.558.01.18.009.42-.068.657.501.248.594.845 2.054.918 2.202.073.147.122.32.024.516-.097.196-.146.318-.292.488-.146.17-.307.38-.438.51-.146.147-.299.306-.128.6.17.293.755 1.245 1.62 2.016 1.113.992 2.053 1.3 2.346 1.446.292.147.462.122.633-.073.17-.196.732-.854.927-1.148.194-.293.389-.244.657-.146.267.097 1.7.801 1.993.948.292.147.487.22.558.342.073.122.073.698-.174 1.396z"/>
      </svg>
      <style>{`
        @keyframes wa-pulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          70%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </a>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <FaviconInjector />
        <FloatingWhatsApp />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
