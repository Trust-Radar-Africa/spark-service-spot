import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
];

export function HeaderModern() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-qx-blue flex items-center justify-center">
              <span className="text-base font-bold text-white font-sans">M</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-bold text-qx-blue font-sans tracking-tight">
                Multiverse
              </span>
              <span className="text-[10px] font-semibold text-qx-orange tracking-wider uppercase">
                CPA
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors duration-200",
                  location.pathname === item.href
                    ? "text-qx-orange"
                    : "text-qx-gray hover:text-qx-blue"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-4">
            <ThemeSwitcher />
            <Button 
              className="bg-qx-orange hover:bg-qx-orange-dark text-white rounded-full px-6"
              asChild
            >
              <Link to="/contact">
                Book a Free Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeSwitcher />
            <button
              type="button"
              className="p-2 rounded-md text-qx-blue"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200",
                    location.pathname === item.href
                      ? "text-qx-orange bg-qx-orange/5"
                      : "text-qx-gray hover:text-qx-blue hover:bg-gray-50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 px-4">
                <Button 
                  className="w-full bg-qx-orange hover:bg-qx-orange-dark text-white rounded-full"
                  asChild
                >
                  <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                    Book a Free Consultation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
