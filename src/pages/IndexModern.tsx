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
  Play
} from "lucide-react";
import auditImg from "@/assets/audit-service.jpg";
import bookkeepingImg from "@/assets/bookkeeping-service.jpg";
import consultingImg from "@/assets/consulting-service.jpg";
import teamImg from "@/assets/team.jpg";

const stats = [
  { icon: Handshake, value: "100+", label: "Accounting Firms Served" },
  { icon: Users, value: "50+", label: "Dedicated Accountants" },
  { icon: Star, value: "98%", label: "CSAT Score" },
  { icon: Shield, value: "0", label: "Data Breaches in 10 Years" },
];

const whyChoose = [
  {
    title: "Customised Engagement Models",
    description: "Flexible engagement models with dedicated experts tailored to your firm's unique requirements.",
    icon: FileSearch,
  },
  {
    title: "Certified Professionals",
    description: "CPAs and Chartered Accountants highly skilled in US GAAP, IFRS, and local accounting standards.",
    icon: Users,
  },
  {
    title: "Four-Eyed Review",
    description: "Every piece of work undergoes detailed review before reaching you, ensuring consistent quality.",
    icon: CheckCircle2,
  },
  {
    title: "Security & Compliance",
    description: "GDPR-compliant with ISO 27001 security and ISO 9001 quality management certifications.",
    icon: Shield,
  },
];

const services = [
  {
    title: "Outsourced Audit Support",
    description: "Expert audit and assurance services under US GAAP, IFRS, and FRS frameworks.",
    icon: FileSearch,
    image: auditImg,
    href: "/services#audit",
  },
  {
    title: "Outsourced Bookkeeping",
    description: "Professional bookkeeping using Xero, QuickBooks, Sage, and more.",
    icon: Calculator,
    image: bookkeepingImg,
    href: "/services#bookkeeping",
  },
  {
    title: "Consulting Services",
    description: "Financial analysis, budget planning, and strategic consulting.",
    icon: BarChart3,
    image: consultingImg,
    href: "/services#consulting",
  },
];

export default function IndexModern() {
  return (
    <LayoutModern>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-qx-blue via-qx-blue-dark to-qx-blue min-h-[90vh] flex items-center overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-96 h-96 bg-qx-orange rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-qx-light-blue rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
                <span className="text-xs font-semibold text-qx-orange uppercase tracking-wider">
                  IFAC Affiliate Member
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Global Leaders in{" "}
                <span className="text-qx-orange">Accounting Outsourcing</span>
              </h1>

              <p className="text-lg text-white/80 mb-8 max-w-xl leading-relaxed">
                Helping accountants grow their firm's capacity and profitability with outsourcing solutions that follow a three-pronged approach: <strong className="text-qx-orange">People, Process & Platforms</strong>.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-qx-orange hover:bg-qx-orange-dark text-white rounded-full px-8 py-6 text-base"
                  asChild
                >
                  <Link to="/contact">
                    Book a Free Consultation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6 text-base"
                  asChild
                >
                  <Link to="/services">
                    <Play className="mr-2 h-4 w-4" />
                    See How It Works
                  </Link>
                </Button>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="relative">
                <img
                  src={teamImg}
                  alt="Multiverse CPA Team"
                  className="rounded-2xl shadow-2xl"
                />
                {/* Floating stat cards */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-qx-blue">100+</div>
                  <div className="text-sm text-qx-gray">Firms Served</div>
                </div>
                <div className="absolute -top-6 -right-6 bg-qx-orange rounded-xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-white">98%</div>
                  <div className="text-sm text-white/80">CSAT Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-qx-blue mb-4">
              Market Leaders in Accounting Outsourcing
            </h2>
            <p className="text-qx-gray max-w-2xl mx-auto">
              Trusted by future-focused accountancy firms to deliver speed, accuracy, and massive cost savings.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-14 h-14 rounded-xl bg-qx-blue/5 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-7 h-7 text-qx-orange" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-qx-blue mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-qx-gray">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-qx-light-gray">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-qx-blue mb-4">
              Why Choose Multiverse CPA
            </h2>
            <p className="text-qx-gray max-w-2xl mx-auto">
              We understand and align with your firm's goals and help achieve strategic growth through bespoke talent and tech support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChoose.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg hover:border-qx-orange/20 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-qx-orange/10 flex items-center justify-center mb-4 group-hover:bg-qx-orange group-hover:text-white transition-colors">
                  <item.icon className="w-6 h-6 text-qx-orange group-hover:text-white" />
                </div>
                <h3 className="text-lg font-bold text-qx-blue mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-qx-gray leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-qx-blue mb-4">
              Our Outsourcing Services
            </h2>
            <p className="text-qx-gray max-w-2xl mx-auto">
              Comprehensive solutions designed to help your firm scale efficiently and profitably.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link
                key={service.title}
                to={service.href}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-qx-orange/10 flex items-center justify-center">
                      <service.icon className="w-5 h-5 text-qx-orange" />
                    </div>
                    <h3 className="text-lg font-bold text-qx-blue group-hover:text-qx-orange transition-colors">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-sm text-qx-gray mb-4">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-qx-orange text-sm font-semibold">
                    Learn More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-qx-blue">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Scale Your Accounting Firm?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-10">
            Schedule a free consultation to discover how our People, Process & Platforms approach can transform your operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-qx-orange hover:bg-qx-orange-dark text-white rounded-full px-8 py-6 text-base"
              asChild
            >
              <Link to="/contact">
                Book a Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6 text-base"
              asChild
            >
              <Link to="/careers">View Open Positions</Link>
            </Button>
          </div>
        </div>
      </section>
    </LayoutModern>
  );
}
