import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeVersionProvider, useThemeVersion } from "@/contexts/ThemeVersionContext";

// Classic theme pages
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";

// Modern theme pages
import IndexModern from "./pages/IndexModern";
import AboutModern from "./pages/AboutModern";
import ServicesModern from "./pages/ServicesModern";
import BlogModern from "./pages/BlogModern";
import CareersModern from "./pages/CareersModern";
import ContactModern from "./pages/ContactModern";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ThemedRoutes() {
  const { version } = useThemeVersion();
  
  if (version === "modern") {
    return (
      <Routes>
        <Route path="/" element={<IndexModern />} />
        <Route path="/about" element={<AboutModern />} />
        <Route path="/services" element={<ServicesModern />} />
        <Route path="/blog" element={<BlogModern />} />
        <Route path="/careers" element={<CareersModern />} />
        <Route path="/contact" element={<ContactModern />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeVersionProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ThemedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeVersionProvider>
  </QueryClientProvider>
);

export default App;
