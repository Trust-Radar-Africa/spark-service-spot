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
  TrendingUp,
  Globe,
  Award,
  Briefcase
} from "lucide-react";
import auditImg from "@/assets/audit-service.jpg";
import bookkeepingImg from "@/assets/bookkeeping-service.jpg";
import consultingImg from "@/assets/consulting-service.jpg";
import { HeroCarousel } from "@/components/HeroCarousel";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
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
    title: "Consulting Services",
    description: "Strategic consulting to drive informed business decisions.",
    icon: TrendingUp,
    image: consultingImg,
    href: "/services#analysis",
  },
  {
    title: "Audit, Review and Compilation Engagements",
    description: "Comprehensive audit, review and compilation of financial statements.",
    icon: BarChart3,
    image: auditImg,
    href: "/services#audit",
  },
];

export default function IndexModern() {
  return (
    <LayoutModern>
      {/* Hero Carousel */}
      <HeroCarousel variant="modern" />

      {/* Welcome to Multiverse CPA Section - Right after carousel */}
      <section className="py-10 md:py-12 bg-gradient-to-b from-white to-qx-light-gray relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-qx-blue/5 to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/4 h-1/2 bg-gradient-to-tl from-qx-orange/5 to-transparent" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-qx-blue/10 border border-qx-blue/20 mb-2">
                <Globe className="w-3 h-3 text-qx-blue" />
                <span className="text-xs text-qx-blue">About Us</span>
              </div>
              <h2 className="text-xl md:text-2xl font-heading font-bold text-qx-blue mb-1.5">
                Welcome to <span className="text-qx-orange">Multiverse CPA</span>
              </h2>
              <p className="text-sm text-qx-gray max-w-2xl mx-auto">
                Your premier destination for exceptional outsourced offshore accounting solutions.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            <AnimatedSection delay={100}>
              <div className="space-y-5">
                <p className="text-body-paragraph text-qx-gray leading-relaxed">
                  As one of the standout outsource offshore accounting firms in the world, our team has handled diverse assignments from the <span className="font-semibold text-qx-blue">US, Canada, Australia and Europe</span>.
                </p>
                
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-qx-blue/10 shadow-sm">
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-qx-blue to-qx-blue-dark flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-job-title text-qx-blue mb-1">IFAC Affiliated</h4>
                    <p className="text-body-paragraph text-qx-gray text-sm leading-relaxed">
                      Affiliated to the International Federation of Accountants, bound by international ethics and professional standards.
                    </p>
                  </div>
                </div>

                <p className="text-body-paragraph text-qx-gray leading-relaxed">
                  We have built our reputation on the robust pillars of <span className="font-semibold text-qx-blue">integrity, competence, and dedication</span>. Our mission is to streamline your business operations with impeccable accounting solutions.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="space-y-5">
                <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <h4 className="text-job-title text-qx-blue mb-3 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-qx-orange" />
                    Our Range of Services
                  </h4>
                  <ul className="grid grid-cols-2 gap-2.5">
                    {["Bookkeeping", "Tax Preparation", "Consulting Services", "Audit, Review and Compilation Engagements"].map((service) => (
                      <li key={service} className="flex items-center gap-2 text-body-paragraph text-qx-gray text-sm">
                        <CheckCircle2 className="w-4 h-4 text-qx-orange flex-shrink-0" />
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-body-paragraph text-qx-gray leading-relaxed">
                  We are <span className="font-semibold text-qx-blue">setting the standards in consulting practice</span>, reducing the need to communicate with multiple accounting outsourcing companies.
                </p>

                <div className="p-4 bg-gradient-to-r from-qx-orange/10 to-amber-50 rounded-xl border border-qx-orange/20">
                  <p className="text-body-paragraph text-qx-blue-dark font-medium italic text-sm leading-relaxed">
                    "At Multiverse CPA, we do not see your success as an option, but a commitment."
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <AnimatedSection>
        <section className="py-8 md:py-10 bg-qx-light-gray relative overflow-hidden">
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
              {stats.map((stat, index) => (
                <AnimatedSection key={stat.label} delay={index * 100}>
                  <div className="hover-lift glass-card rounded-lg p-3 md:p-4 text-center group bg-white">
                    <div className={`w-10 h-10 md:w-11 md:h-11 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-2 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-5 h-5 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-qx-blue to-qx-blue-dark bg-clip-text text-transparent mb-0.5">
                      {stat.value}
                    </div>
                    <div className="text-xs text-qx-gray">
                      {stat.label}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Services Section */}
      <section className="py-10 md:py-12 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-qx-light-gray/50 to-transparent" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-qx-blue/10 border border-qx-blue/20 mb-2">
                <TrendingUp className="w-3 h-3 text-qx-blue" />
                <span className="text-xs text-qx-blue">Our Services</span>
              </div>
              <h2 className="text-xl md:text-2xl font-heading font-bold text-qx-blue mb-1.5">
                Our <span className="text-qx-orange">Outsourcing</span> Services
              </h2>
              <p className="text-sm text-qx-gray max-w-xl mx-auto">
                Comprehensive solutions to help your firm scale efficiently.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service, index) => (
              <AnimatedSection key={service.title} delay={index * 100}>
                <Link
                  to={service.href}
                  className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 block"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-qx-blue/90 via-qx-blue/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-qx-orange to-amber-400 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <service.icon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-job-title text-sm text-qx-blue group-hover:text-qx-orange transition-colors duration-300">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-body-paragraph text-qx-gray text-sm mb-3 line-clamp-2">
                      {service.description}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-qx-orange text-xs font-medium group-hover:gap-2 transition-all duration-300">
                      Learn More
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-10 md:py-12 bg-gradient-to-br from-qx-blue via-qx-blue-dark to-qx-blue relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-48 h-48 bg-qx-orange rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 left-10 w-36 h-36 bg-qx-light-blue rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-2">
                <Zap className="w-3 h-3 text-qx-orange" />
                <span className="text-xs text-white/90">Why Choose Us</span>
              </div>
              <h2 className="text-xl md:text-2xl font-heading font-bold text-white mb-1.5">
                Why Choose <span className="text-qx-orange">Multiverse CPA</span>
              </h2>
              <p className="text-sm text-white/70 max-w-xl mx-auto">
                Strategic growth through bespoke talent and tech support.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {whyChoose.map((item, index) => (
              <AnimatedSection key={item.title} delay={index * 100}>
                <div className="group bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/20 hover:border-qx-orange/30 transition-all duration-300 hover:-translate-y-1 h-full">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-job-title text-sm text-white mb-1.5 group-hover:text-qx-orange transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-body-paragraph text-white/70 text-sm line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsCarousel variant="modern" />

      {/* Dual CTA Section */}
      <AnimatedSection>
        <section className="py-10 md:py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-qx-blue via-qx-blue-dark to-qx-blue" />
          
          <div className="absolute inset-0">
            <div className="absolute top-6 left-6 w-20 h-20 bg-qx-orange/30 rounded-full blur-2xl animate-float" />
            <div className="absolute bottom-6 right-6 w-24 h-24 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          </div>
          
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-6">
              {/* For Employers */}
              <div className="text-center md:text-left p-5 md:p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-qx-orange/20 border border-qx-orange/30 mb-3">
                  <Users className="w-3 h-3 text-qx-orange" />
                  <span className="text-xs text-white/90">For Employers</span>
                </div>
                <h3 className="text-lg font-heading font-semibold text-white mb-2">
                  Seeking Potential <span className="text-qx-orange">Candidates</span>?
                </h3>
                <p className="text-body-paragraph text-white/70 mb-6">
                  Let us help you find the perfect accounting professionals for your firm. Send us your requirements and we will match you with top talent.
                </p>
                <Button 
                  className="bg-gradient-to-r from-qx-orange to-amber-500 hover:from-qx-orange-dark hover:to-amber-600 text-white rounded-full px-8 py-6 text-base font-semibold shadow-lg shadow-qx-orange/30 hover:shadow-xl hover:shadow-qx-orange/40 transition-all duration-300 hover:-translate-y-1"
                  asChild
                >
                  <Link to="/employers">
                    Send Us Your Request
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              {/* For Candidates */}
              <div className="text-center md:text-left p-6 md:p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/30 mb-4">
                  <Briefcase className="w-3.5 h-3.5 text-white" />
                  <span className="text-filter-label text-white/90">For Candidates</span>
                </div>
                <h3 className="text-job-title text-2xl text-white mb-3">
                  Looking for Your Next <span className="text-qx-orange">Opportunity</span>?
                </h3>
                <p className="text-body-paragraph text-white/70 mb-6">
                  Join our team of dedicated professionals and be part of a leading outsource accounting firm. Explore our current openings.
                </p>
                <Button 
                  className="bg-white hover:bg-white/90 text-qx-blue rounded-full px-8 py-6 text-base font-semibold shadow-lg transition-all duration-300 hover:-translate-y-1"
                  asChild
                >
                  <Link to="/careers">
                    View Current Careers
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </LayoutModern>
  );
}
