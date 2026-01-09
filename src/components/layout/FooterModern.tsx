import { Link } from "react-router-dom";
import { Mail, Globe, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export function FooterModern() {
  return (
    <footer className="bg-qx-blue text-white">
      {/* CTA Strip */}
      <div className="bg-qx-orange py-8">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              Ready to Scale Your Accounting Firm?
            </h3>
            <p className="text-white/80 text-sm">
              Get a free consultation and discover how we can help.
            </p>
          </div>
          <Button 
            className="bg-white text-qx-orange hover:bg-gray-100 rounded-full px-8"
            asChild
          >
            <Link to="/contact">
              Book a Free Consultation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="text-base font-bold text-qx-orange font-sans">M</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-bold tracking-tight">
                  Multiverse
                </span>
                <span className="text-[10px] font-semibold text-qx-orange tracking-wider uppercase">
                  CPA
                </span>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Global leaders in accounting outsourcing. Helping accountants grow their firm's capacity and profitability.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-qx-orange mb-4">
              Services
            </h3>
            <ul className="space-y-2">
              {services.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-white/60 hover:text-qx-orange transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-qx-orange mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              {company.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-white/60 hover:text-qx-orange transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-qx-orange mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-qx-orange" />
                <a
                  href="mailto:info@multiversecpa.com"
                  className="text-white/60 hover:text-qx-orange transition-colors"
                >
                  info@multiversecpa.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-qx-orange" />
                <span className="text-white/60">
                  USA, Canada, Europe, Australia
                </span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-qx-orange" />
                <span className="text-white/60">
                  IFAC Affiliate Member
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Multiverse CPA. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-white/40 text-xs">
              People • Process • Platforms
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
