import { Link } from "react-router-dom";
import { LayoutModern } from "@/components/layout/LayoutModern";
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

export default function ServicesModern() {
  return (
    <LayoutModern>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-qx-blue to-qx-blue-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-qx-orange rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
              <span className="text-xs font-semibold text-qx-orange uppercase tracking-wider">
                Our Services
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-white mb-6">
              Outsourcing Services for{" "}
              <span className="text-qx-orange">Accounting Firms</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Comprehensive outsourced accounting solutions tailored to your firm's needs. We act as a one-stop shop for your company's financial requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      {services.map((service, index) => (
        <section
          key={service.id}
          id={service.id}
          className={`py-20 ${index % 2 === 0 ? "bg-white" : "bg-qx-light-gray"}`}
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className={`grid lg:grid-cols-2 gap-16 items-center`}>
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-qx-orange flex items-center justify-center">
                    <service.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-qx-orange uppercase tracking-wide">
                    {service.subtitle}
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-qx-blue mb-6">
                  {service.title}
                </h2>

                <p className="text-qx-gray mb-8 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-qx-orange flex-shrink-0 mt-0.5" />
                      <span className="text-qx-blue">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-4">
                  <Button 
                    className="bg-qx-orange hover:bg-qx-orange-dark text-white rounded-full px-6"
                    asChild
                  >
                    <Link to="/contact">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-qx-blue text-qx-blue hover:bg-qx-blue hover:text-white rounded-full px-6"
                    asChild
                  >
                    <Link to="/contact">Request More Info</Link>
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
      <section className="py-20 bg-qx-blue">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Partner With Us?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-10">
            Schedule a call to discuss further how we can contribute to the mission of your firm.
          </p>
          <Button 
            className="bg-qx-orange hover:bg-qx-orange-dark text-white rounded-full px-8 py-6 text-base"
            asChild
          >
            <Link to="/contact">
              Book a Free Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </LayoutModern>
  );
}
