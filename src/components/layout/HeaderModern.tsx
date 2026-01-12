import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Blog", href: "/blog" },
];

const recruitmentLinks = [
  { name: "Job Openings", href: "/careers", description: "Browse available positions" },
  { name: "For Employers", href: "/employers", description: "Submit recruitment requests" },
];

export function HeaderModern() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recruitmentOpen, setRecruitmentOpen] = useState(false);
  const location = useLocation();

  const isRecruitmentActive = recruitmentLinks.some(
    (link) => location.pathname === link.href
  );

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

            {/* Recruitment Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1",
                    isRecruitmentActive
                      ? "text-qx-orange"
                      : "text-qx-gray hover:text-qx-blue"
                  )}
                >
                  Recruitment
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56 bg-white border border-gray-200 shadow-lg z-50">
                {recruitmentLinks.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex flex-col items-start gap-1 px-3 py-2 cursor-pointer",
                        location.pathname === item.href && "bg-gray-50"
                      )}
                    >
                      <span className="font-medium text-qx-blue">{item.name}</span>
                      <span className="text-xs text-qx-gray">{item.description}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="/contact"
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors duration-200",
                location.pathname === "/contact"
                  ? "text-qx-orange"
                  : "text-qx-gray hover:text-qx-blue"
              )}
            >
              Contact
            </Link>
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

              {/* Mobile Recruitment Section */}
              <div className="px-4 py-2">
                <button
                  onClick={() => setRecruitmentOpen(!recruitmentOpen)}
                  className={cn(
                    "w-full flex items-center justify-between py-2 text-base font-medium rounded-lg transition-colors duration-200",
                    isRecruitmentActive
                      ? "text-qx-orange"
                      : "text-qx-gray"
                  )}
                >
                  Recruitment
                  <ChevronDown className={cn("w-4 h-4 transition-transform", recruitmentOpen && "rotate-180")} />
                </button>
                {recruitmentOpen && (
                  <div className="mt-2 ml-4 space-y-1 border-l-2 border-gray-200 pl-4">
                    {recruitmentLinks.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          "block py-2 text-sm font-medium transition-colors",
                          location.pathname === item.href
                            ? "text-qx-orange"
                            : "text-qx-gray hover:text-qx-blue"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/contact"
                className={cn(
                  "px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200",
                  location.pathname === "/contact"
                    ? "text-qx-orange bg-qx-orange/5"
                    : "text-qx-gray hover:text-qx-blue hover:bg-gray-50"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>

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
