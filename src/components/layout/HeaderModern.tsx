import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
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

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
];

export function HeaderModern() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recruitmentOpen, setRecruitmentOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const location = useLocation();

  const isRecruitmentActive = recruitmentLinks.some(
    (link) => location.pathname === link.href
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex min-h-[100px] items-center justify-between">
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
          <div className="hidden lg:flex items-center gap-3">
            <ThemeSwitcher />
            
            {/* Language Chooser */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-qx-gray hover:text-qx-blue transition-colors rounded-full border border-gray-200 hover:border-qx-blue/30 bg-white">
                  <span className="text-base">{selectedLanguage.flag}</span>
                  <span>{selectedLanguage.code.toUpperCase()}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-white border border-gray-200 shadow-lg z-50">
                {languages.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 cursor-pointer",
                      selectedLanguage.code === lang.code && "bg-qx-light-gray"
                    )}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span className="text-sm font-medium text-qx-blue">{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Language Chooser */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-2 py-1 text-sm text-qx-gray">
                  <span>{selectedLanguage.flag}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36 bg-white border border-gray-200 shadow-lg z-50">
                {languages.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 cursor-pointer",
                      selectedLanguage.code === lang.code && "bg-qx-light-gray"
                    )}
                  >
                    <span>{lang.flag}</span>
                    <span className="text-sm">{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
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

            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
