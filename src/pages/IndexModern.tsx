import { Link } from "react-router-dom";
import { LayoutModern } from "@/components/layout/LayoutModern";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Shield, 
  Star, 
  Handshake,
  FileSearch,
  Calculator,
  BarChart3,
  Sparkles,
  Zap,
  TrendingUp
} from "lucide-react";
import auditImg from "@/assets/audit-service.jpg";
import bookkeepingImg from "@/assets/bookkeeping-service.jpg";
import consultingImg from "@/assets/consulting-service.jpg";
import { HeroCarousel } from "@/components/HeroCarousel";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import { AnimatedSection } from "@/components/AnimatedSection";

const stats = [
  { icon: Handshake, value: "100+", label: "Accounting Firms Served", color: "from-orange-500 to-amber-400" },
  { icon: Users, value: "50+", label: "Dedicated Accountants", color: "from-blue-500 to-cyan-400" },
  { icon: Star, value: "98%", label: "CSAT Score", color: "from-purple-500 to-pink-400" },
  { icon: Shield, value: "0", label: "Data Breaches in 10 Years", color: "from-emerald-500 to-teal-400" },
];

const whyChoose = [
  {
    title: "Customised Engagement Models",
    description: "Flexible engagement models with dedicated experts tailored to your firm's unique requirements.",
    icon: FileSearch,
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500",
  },
  {
    title: "Certified Professionals",
    description: "CPAs and Chartered Accountants highly skilled in US GAAP, IFRS, and local accounting standards.",
    icon: Users,
    gradient: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-500",
  },
  {
    title: "Four-Eyed Review",
    description: "Every piece of work undergoes detailed review before reaching you, ensuring consistent quality.",
    icon: CheckCircle2,
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-500",
  },
  {
    title: "Security & Compliance",
    description: "GDPR-compliant with ISO 27001 security and ISO 9001 quality management certifications.",
    icon: Shield,
    gradient: "from-orange-500/20 to-amber-500/20",
    iconColor: "text-orange-500",
  },
];

const services = [
  {
    title: "Bookkeeping",
    description: "Professional bookkeeping using Xero, QuickBooks, Sage, and more.",
    icon: Calculator,
    image: bookkeepingImg,
    href: "/services#bookkeeping",
  },
  {
    title: "Tax Preparation",
    description: "Expert tax preparation ensuring compliance and optimization.",
    icon: FileSearch,
    image: auditImg,
    href: "/services#tax",
  },
  {
    title: "Audit & Review",
    description: "Audit, review and compilation of financial statements.",
    icon: BarChart3,
    image: consultingImg,
    href: "/services#audit",
  },
];

export default function IndexModern() {
  return (
    <LayoutModern>
      {/* Hero Carousel */}
      <HeroCarousel variant="modern" />
      
      {/* Scroll Indicator */}
      <ScrollIndicator variant="modern" />

      {/* Stats Section */}
      <AnimatedSection>
        <section className="py-12 md:py-16 bg-gradient-to-b from-white to-qx-light-gray relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-48 h-48 bg-qx-orange/5 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-qx-blue/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
          
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="text-center mb-8 md:mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-qx-orange/10 border border-qx-orange/20 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-qx-orange" />
                <span className="text-xs font-semibold text-qx-orange">Industry Leaders</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-qx-blue mb-2">
                Market Leaders in <span className="text-gradient-vibrant">Accounting Outsourcing</span>
              </h2>
              <p className="text-qx-gray max-w-xl mx-auto">
                Trusted by future-focused accountancy firms to deliver speed, accuracy, and massive cost savings.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {stats.map((stat, index) => (
                <AnimatedSection key={stat.label} delay={index * 100}>
                  <div className="hover-lift glass-card rounded-xl p-4 md:p-5 text-center group">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-qx-blue to-qx-blue-dark bg-clip-text text-transparent mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-qx-gray font-medium">
                      {stat.label}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Why Choose Section */}
      <section className="py-14 md:py-16 bg-gradient-to-br from-qx-blue via-qx-blue-dark to-qx-blue relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-64 h-64 bg-qx-orange rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-qx-light-blue rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-3">
                <Zap className="w-3.5 h-3.5 text-qx-orange" />
                <span className="text-xs font-semibold text-white/90">Why Choose Us</span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-montserrat font-bold text-white mb-2">
                Why Choose <span className="text-qx-orange">Multiverse CPA</span>
              </h2>
              <p className="text-white/70 max-w-xl mx-auto text-sm md:text-base">
                We align with your firm's goals and help achieve strategic growth through bespoke talent and tech support.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {whyChoose.map((item, index) => (
              <AnimatedSection key={item.title} delay={index * 100}>
                <div className="group bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/10 hover:bg-white/20 hover:border-qx-orange/30 transition-all duration-300 hover:-translate-y-1 h-full">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className={`w-5 h-5 md:w-6 md:h-6 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-sm md:text-base font-montserrat font-bold text-white mb-1.5 group-hover:text-qx-orange transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-white/70 text-xs md:text-sm leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-14 md:py-16 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-qx-light-gray/50 to-transparent" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-qx-blue/10 border border-qx-blue/20 mb-3">
                <TrendingUp className="w-3.5 h-3.5 text-qx-blue" />
                <span className="text-xs font-semibold text-qx-blue">Our Services</span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-montserrat font-bold text-qx-blue mb-2">
                Our <span className="text-qx-orange">Outsourcing</span> Services
              </h2>
              <p className="text-qx-gray max-w-xl mx-auto text-sm md:text-base">
                Comprehensive solutions designed to help your firm scale efficiently and profitably.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {services.map((service, index) => (
              <AnimatedSection key={service.title} delay={index * 100}>
                <Link
                  to={service.href}
                  className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 block"
                >
                  <div className="aspect-[16/9] overflow-hidden relative">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-qx-blue/90 via-qx-blue/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  </div>
                  <div className="p-5 md:p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-qx-orange to-amber-400 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                        <service.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-montserrat font-bold text-qx-blue group-hover:text-qx-orange transition-colors duration-300">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-qx-gray text-sm mb-4 leading-relaxed line-clamp-2">
                      {service.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-qx-orange text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                      Learn More
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsCarousel variant="modern" />

      {/* CTA Section */}
      <AnimatedSection>
        <section className="py-14 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-qx-blue via-qx-blue-dark to-qx-blue" />
          
          <div className="absolute inset-0">
            <div className="absolute top-6 left-6 w-24 h-24 bg-qx-orange/30 rounded-full blur-2xl animate-float" />
            <div className="absolute bottom-6 right-6 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          </div>
          
          <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-qx-orange" />
              <span className="text-xs font-semibold text-white/90">Get Started Today</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-montserrat font-bold text-white mb-3">
              Ready to Scale Your <span className="text-qx-orange">Accounting Firm</span>?
            </h2>
            <p className="text-white/70 max-w-xl mx-auto mb-8 text-sm md:text-base">
              Schedule a free consultation to discover how our People, Process & Platforms approach can transform your operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                className="bg-gradient-to-r from-qx-orange to-amber-500 hover:from-qx-orange-dark hover:to-amber-600 text-white rounded-full px-8 py-6 text-base font-semibold shadow-lg shadow-qx-orange/30 hover:shadow-xl hover:shadow-qx-orange/40 transition-all duration-300 hover:-translate-y-1"
                asChild
              >
                <Link to="/contact">
                  Book a Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-full px-8 py-6 text-base font-semibold transition-all duration-300"
                asChild
              >
                <Link to="/careers">View Open Positions</Link>
              </Button>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </LayoutModern>
  );
}
