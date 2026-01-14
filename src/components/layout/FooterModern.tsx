import { Link } from "react-router-dom";
import { Mail, Globe, Building2, ArrowRight, Linkedin, Twitter, Facebook, Instagram, Youtube, ExternalLink, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/stores/settingsStore";

const getSocialIcon = (iconName: string) => {
  switch (iconName.toLowerCase()) {
    case 'linkedin':
      return Linkedin;
    case 'twitter':
      return Twitter;
    case 'facebook':
      return Facebook;
    case 'instagram':
      return Instagram;
    case 'youtube':
      return Youtube;
    default:
      return ExternalLink;
  }
};

const services = [
  { name: "Bookkeeping", href: "/services#bookkeeping" },
  { name: "Tax Preparation", href: "/services#tax" },
  { name: "Audit & Review", href: "/services#audit" },
  { name: "Consulting", href: "/services#consulting" },
];

const company = [
  { name: "About Us", href: "/about" },
  { name: "Careers", href: "/careers" },
  { name: "For Employers", href: "/employers" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function FooterModern() {
  const { socialLinks } = useSettingsStore();
  const enabledLinks = socialLinks.filter((link) => link.enabled);

  return (
    <footer className="bg-qx-blue text-white">
      {/* CTA Strip */}
      <div className="bg-gradient-to-r from-qx-orange to-amber-500 py-8">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              Ready to Partner With Multiverse CPA?
            </h3>
            <p className="text-white/90 text-sm">
              Schedule a call to discuss how we can contribute to your firm's mission.
            </p>
          </div>
          <Button 
            className="bg-white text-qx-orange hover:bg-gray-100 rounded-full px-8 shadow-lg"
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
          {/* Brand & Contact Info */}
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
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              A firm of Certified Public Accountants handling exclusively outsourced assignments from firms in the USA, Canada, Europe and Australia.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Building2 className="w-4 h-4 text-qx-orange flex-shrink-0" />
              <span>IFAC Affiliate Member</span>
            </div>
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

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-qx-orange mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <Phone className="w-4 h-4 text-qx-orange flex-shrink-0 mt-0.5" />
                <a
                  href="tel:+18885566382"
                  className="text-white/60 hover:text-qx-orange transition-colors"
                >
                  +1 888 556 6382
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Mail className="w-4 h-4 text-qx-orange flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:info@multiversecpa.com"
                  className="text-white/60 hover:text-qx-orange transition-colors"
                >
                  info@multiversecpa.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-qx-orange flex-shrink-0 mt-0.5" />
                <span className="text-white/60">
                  500 Westover Dr #31297<br />
                  Sanford, NC 27330
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Globe className="w-4 h-4 text-qx-orange flex-shrink-0 mt-0.5" />
                <span className="text-white/60">
                  USA, Canada, Europe, Australia
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
          <div className="flex items-center gap-6">
            {/* Social Links */}
            {enabledLinks.length > 0 && (
              <div className="flex items-center gap-3">
                {enabledLinks.map((link) => {
                  const Icon = getSocialIcon(link.icon);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-qx-orange hover:text-white transition-colors"
                      aria-label={link.platform}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            )}
            <span className="text-white/40 text-xs">
              Integrity • Competence • Dedication
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
