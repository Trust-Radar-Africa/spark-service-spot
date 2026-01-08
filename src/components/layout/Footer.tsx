import { Link } from "react-router-dom";
import { Mail, Globe, Building2 } from "lucide-react";

const services = [
  { name: "Outsourced Audit", href: "/services#audit" },
  { name: "Bookkeeping", href: "/services#bookkeeping" },
  { name: "Consulting", href: "/services#consulting" },
];

const company = [
  { name: "About Us", href: "/about" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-gradient-navy text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                <span className="text-lg font-bold text-gold font-serif">M</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-serif font-bold tracking-tight">
                  Multiverse
                </span>
                <span className="text-xs font-semibold text-gold tracking-widest uppercase">
                  CPA
                </span>
              </div>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Your premier destination for exceptional outsourced accounting solutions. 
              Affiliated with the International Federation of Accountants.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-6 text-gold">
              Our Services
            </h3>
            <ul className="space-y-3">
              {services.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-primary-foreground/70 hover:text-gold transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-6 text-gold">
              Company
            </h3>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-primary-foreground/70 hover:text-gold transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-6 text-gold">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-gold" />
                <a
                  href="mailto:info@multiversecpa.com"
                  className="text-primary-foreground/70 hover:text-gold transition-colors"
                >
                  info@multiversecpa.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Globe className="w-5 h-5 text-gold" />
                <span className="text-primary-foreground/70">
                  USA, Canada, Europe, Australia
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Building2 className="w-5 h-5 text-gold" />
                <span className="text-primary-foreground/70">
                  IFAC Affiliate Member
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} Multiverse CPA. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-primary-foreground/50 text-xs">
              Integrity • Competence • Dedication
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
