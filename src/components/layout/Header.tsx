import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
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

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recruitmentOpen, setRecruitmentOpen] = useState(false);
  const location = useLocation();

  const isRecruitmentActive = recruitmentLinks.some(
    (link) => location.pathname === link.href
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-navy flex items-center justify-center">
              <span className="text-lg font-bold text-gold font-serif">M</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-serif font-bold text-foreground tracking-tight">
                Multiverse
              </span>
              <span className="text-xs font-semibold text-accent tracking-widest uppercase">
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
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                  location.pathname === item.href
                    ? "text-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 flex items-center gap-1",
                    isRecruitmentActive
                      ? "text-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  Recruitment
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56 bg-background border border-border shadow-lg z-50">
                {recruitmentLinks.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex flex-col items-start gap-1 px-3 py-2 cursor-pointer",
                        location.pathname === item.href && "bg-muted"
                      )}
                    >
                      <span className="font-medium">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="/contact"
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                location.pathname === "/contact"
                  ? "text-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              Contact
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <ThemeSwitcher />
            <Button variant="gold" size="lg" asChild>
              <Link to="/contact">Schedule a Call</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "px-4 py-3 text-base font-medium rounded-md transition-colors duration-200",
                    location.pathname === item.href
                      ? "text-accent bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
                    "w-full flex items-center justify-between py-2 text-base font-medium rounded-md transition-colors duration-200",
                    isRecruitmentActive
                      ? "text-accent"
                      : "text-muted-foreground"
                  )}
                >
                  Recruitment
                  <ChevronDown className={cn("w-4 h-4 transition-transform", recruitmentOpen && "rotate-180")} />
                </button>
                {recruitmentOpen && (
                  <div className="mt-2 ml-4 space-y-1 border-l-2 border-border pl-4">
                    {recruitmentLinks.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          "block py-2 text-sm font-medium transition-colors",
                          location.pathname === item.href
                            ? "text-accent"
                            : "text-muted-foreground hover:text-foreground"
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
                  "px-4 py-3 text-base font-medium rounded-md transition-colors duration-200",
                  location.pathname === "/contact"
                    ? "text-accent bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>

              <div className="pt-4 px-4">
                <Button variant="gold" size="lg" className="w-full" asChild>
                  <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                    Schedule a Call
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
