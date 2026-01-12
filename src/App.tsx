import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeVersionProvider, useThemeVersion } from "@/contexts/ThemeVersionContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";

// Classic theme pages
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Careers from "./pages/Careers";
import Apply from "./pages/Apply";
import Contact from "./pages/Contact";

// Modern theme pages
import IndexModern from "./pages/IndexModern";
import AboutModern from "./pages/AboutModern";
import ServicesModern from "./pages/ServicesModern";
import BlogModern from "./pages/BlogModern";
import BlogPostModern from "./pages/BlogPostModern";
import CareersModern from "./pages/CareersModern";
import ApplyModern from "./pages/ApplyModern";
import ContactModern from "./pages/ContactModern";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import CandidatesPage from "./pages/admin/CandidatesPage";
import JobPostingsPage from "./pages/admin/JobPostingsPage";
import EmployerRequestsPage from "./pages/admin/EmployerRequestsPage";
import BlogManagementPage from "./pages/admin/BlogManagementPage";
import ProtectedRoute from "./components/admin/ProtectedRoute";

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
        <Route path="/blog/:slug" element={<BlogPostModern />} />
        <Route path="/careers" element={<CareersModern />} />
        <Route path="/apply" element={<ApplyModern />} />
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
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/apply" element={<Apply />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeVersionProvider>
      <AdminAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/candidates"
                element={
                  <ProtectedRoute>
                    <CandidatesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/jobs"
                element={
                  <ProtectedRoute>
                    <JobPostingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/employers"
                element={
                  <ProtectedRoute>
                    <EmployerRequestsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/blog"
                element={
                  <ProtectedRoute>
                    <BlogManagementPage />
                  </ProtectedRoute>
                }
              />
              {/* Public Routes */}
              <Route path="/*" element={<ThemedRoutes />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AdminAuthProvider>
    </ThemeVersionProvider>
  </QueryClientProvider>
);

export default App;
