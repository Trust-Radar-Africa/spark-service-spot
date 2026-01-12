import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Globe, Users, Award, Shield } from "lucide-react";
import teamImg from "@/assets/team.jpg";
import auditImg from "@/assets/audit-service.jpg";
import bookkeepingImg from "@/assets/bookkeeping-service.jpg";
import consultingImg from "@/assets/consulting-service.jpg";
import { HeroCarousel } from "@/components/HeroCarousel";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
const services = [
  {
    title: "Bookkeeping",
    description: "Professional bookkeeping using Xero, QuickBooks, Sage, and more to boost your firm's productivity.",
    image: bookkeepingImg,
    href: "/services#bookkeeping",
  },
  {
    title: "Tax Preparation",
    description: "Expert tax preparation services ensuring compliance and optimization.",
    image: auditImg,
    href: "/services#tax",
  },
  {
    title: "Audit & Review",
    description: "Audit, review and compilation of financial statements under multiple frameworks.",
    image: consultingImg,
    href: "/services#audit",
  },
];

const stats = [
  { label: "Countries Served", value: "15+" },
  { label: "Professional Accountants", value: "50+" },
  { label: "Client Firms", value: "100+" },
  { label: "Years Experience", value: "10+" },
];

const features = [
  {
    icon: Globe,
    title: "Global Reach",
    description: "Serving clients across USA, Canada, Australia, and Europe.",
  },
  {
    icon: Shield,
    title: "IFAC Affiliated",
    description: "Bound by international ethics and professional standards.",
  },
  {
    icon: Users,
    title: "Dedicated Teams",
    description: "Staff assigned exclusively to your firm under your control.",
  },
  {
    icon: Award,
    title: "Certified Experts",
    description: "CPAs and Chartered Accountants in good standing.",
  },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Carousel */}
      <HeroCarousel variant="classic" />

      {/* Stats Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl md:text-5xl font-serif font-bold text-accent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Why Choose <span className="text-accent">Multiverse CPA</span>?
            </h2>
            <p className="text-muted-foreground">
              We handle your back office tasks at a fraction of the cost without
              compromising on quality.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-card border border-border hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Our <span className="text-accent">Services</span>
            </h2>
            <p className="text-muted-foreground">
              We act as a one-stop shop for your company's financial needs, reducing the need to communicate with multiple accounting outsourcing companies.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Link
                key={service.title}
                to={service.href}
                className="group relative overflow-hidden rounded-2xl bg-card shadow-card hover:shadow-card-hover transition-all duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/50 to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-2xl font-bold text-primary-foreground mb-2 group-hover:text-gold transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-primary-foreground/70 text-sm mb-4">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-gold text-sm font-semibold">
                    Learn More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsCarousel variant="classic" />

      {/* About Preview Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={teamImg}
                  alt="Multiverse CPA Team"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground p-6 rounded-xl shadow-gold">
                <div className="text-3xl font-serif font-bold">10+</div>
                <div className="text-sm font-medium">Years of Excellence</div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
                Your Trusted Partner in{" "}
                <span className="text-accent">Accounting Excellence</span>
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Multiverse CPA is a firm of Certified Public Accountants
                handling exclusively outsourced assignments from firms of
                accountants in the USA, Canada, Europe and Australia. Our team comprises
                CPAs and Chartered Accountants from diverse nationalities and
                backgrounds who have been vetted, tried and tested.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "IFAC Affiliate Member",
                  "Fully vetted and certified professionals",
                  "Experience across multiple jurisdictions",
                  "Full operational control remains with you",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <Button variant="gold" size="lg" asChild>
                <Link to="/about">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-navy">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-4">
            Ready to Transform Your Accounting Operations?
          </h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto mb-10">
            Schedule a call to discuss how we can contribute to the mission of
            your firm. Let us handle the back office while you focus on growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">
                Schedule a Meeting
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/careers">Join Our Team</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
