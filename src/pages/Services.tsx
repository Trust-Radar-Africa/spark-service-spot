import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, FileSearch, Calculator, BarChart3 } from "lucide-react";
import auditImg from "@/assets/audit-service.jpg";
import bookkeepingImg from "@/assets/bookkeeping-service.jpg";
import consultingImg from "@/assets/consulting-service.jpg";

const services = [
  {
    id: "audit",
    icon: FileSearch,
    title: "Outsourced Audit Support",
    subtitle: "Expert Audit & Assurance Services",
    description:
      "Multiverse CPA Audit Division provides outsourced audit services remotely to other firms of accountants. We also provide review and compilation of financial statements.",
    image: auditImg,
    features: [
      "Qualified experienced accountants in good standing",
      "Engagements under US GAAP, Canada GAAP, FRS 102, FRS 105, IFRS",
      "Experience with Caseware, Voyager Auditmate, Myworkingpapers, Audit Assistant",
      "Review and compilation of financial statements",
    ],
  },
  {
    id: "bookkeeping",
    icon: Calculator,
    title: "Outsourced Bookkeeping",
    subtitle: "Professional Bookkeeping Services",
    description:
      "Accountants often hesitate to offer bookkeeping services due to their low margins and time-consuming nature. At Multiverse CPA, we make the process simple and hassle-free for your firm.",
    image: bookkeepingImg,
    features: [
      "Skilled and experienced bookkeepers handling routine tasks",
      "Transform bookkeeping into a profitable service",
      "Experience with Xero, QuickBooks, Sage, Hubdoc and Dext",
      "Full-time or part-time staff based on your needs",
    ],
  },
  {
    id: "consulting",
    icon: BarChart3,
    title: "Outsourced Consulting Services",
    subtitle: "Strategic Financial Consulting",
    description:
      "Our consulting division handles diverse assignments based on the terms of reference of clients. We bring superior expertise to your most complex financial challenges.",
    image: consultingImg,
    features: [
      "Financial analysis and reporting",
      "Budget plans for government contracting work",
      "Financial statement preparation",
      "Engagement Quality Control Reviews",
      "Advanced Excel skills with Vlookup, Pivot Tables, complex formulas",
    ],
  },
];

export default function Services() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(38_92%_50%/0.1),transparent_70%)]" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground mb-6">
              Our <span className="text-gradient-gold">Services</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              Comprehensive outsourced accounting solutions tailored to your
              firm's needs. We act as a one-stop shop for your company's
              financial requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      {services.map((service, index) => (
        <section
          key={service.id}
          id={service.id}
          className={`py-24 ${index % 2 === 0 ? "bg-background" : "bg-muted"}`}
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div
              className={`grid lg:grid-cols-2 gap-16 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-accent" />
                  </div>
                  <span className="text-sm font-semibold text-accent uppercase tracking-wide">
                    {service.subtitle}
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
                  {service.title}
                </h2>

                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-4 mb-8">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-4">
                  <Button variant="gold" size="lg" asChild>
                    <Link to="/contact">
                      Schedule a Call
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/careers">Send a Request</Link>
                  </Button>
                </div>
              </div>

              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-navy">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-4">
            Ready to Partner With Us?
          </h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto mb-10">
            Schedule a call to discuss further how we can contribute to the
            mission of your firm. Let us handle the complexities while you focus
            on growth.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/contact">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
