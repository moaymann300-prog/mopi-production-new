import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <FaviconInjector />
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