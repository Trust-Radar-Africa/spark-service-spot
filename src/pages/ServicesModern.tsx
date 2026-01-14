import { Link } from "react-router-dom";
import { LayoutModern } from "@/components/layout/LayoutModern";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Send, FileSearch, Calculator, BarChart3, FileText, Briefcase, CheckCircle2 } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

interface ServiceCTAProps {
  candidateText?: string;
}

function ServiceCTA({ candidateText = "join your team" }: ServiceCTAProps) {
  return (
    <div className="mt-6 p-5 bg-gradient-to-r from-qx-blue/5 to-qx-orange/5 rounded-xl border border-qx-blue/10">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button 
            className="bg-gradient-to-r from-qx-orange to-amber-500 hover:from-qx-orange-dark hover:to-amber-600 text-white rounded-full"
            asChild
          >
            <Link to="/contact">
              <Phone className="mr-2 h-4 w-4" />
              Schedule a Call
            </Link>
          </Button>
          <Button 
            variant="outline"
            className="border-qx-blue text-qx-blue hover:bg-qx-blue hover:text-white rounded-full"
            asChild
          >
            <Link to="/employers">
              <Send className="mr-2 h-4 w-4" />
              Request a Candidate
            </Link>
          </Button>
        </div>
        <p className="text-body-paragraph text-qx-gray text-sm">
          Feel free to <Link to="/contact" className="text-qx-orange hover:underline font-medium">schedule a call</Link> to discuss further on how we can partner together. 
          If you would like us to refer a candidate to {candidateText}, <Link to="/employers" className="text-qx-orange hover:underline font-medium">send us your request</Link>.
        </p>
      </div>
    </div>
  );
}

const services = [
  {
    id: "bookkeeping",
    icon: Calculator,
    label: "Bookkeeping Services",
    title: "Tackle Staff Shortages & Grow Your Practice with Tailored Bookkeeping",
    highlight: "Tailored Bookkeeping",
    content: [
      "Accountants often hesitate to offer bookkeeping services due to their low margins and time-consuming nature. At Multiverse CPA, we understand these challenges and make the process simple and hassle-free for your firm.",
      "Our team of skilled and experienced bookkeepers handles the routine tasks, allowing you and your team to focus on strategic objectives. This transforms bookkeeping into a profitable service, boosting your firm's revenue and productivity.",
      "We have professionals with solid experience in the use of bookkeeping software such as **Xero, QuickBooks, Sage, Hubdoc and Dext**. We are continually updating our skills to ensure that we stay on top of the latest advancements in the industry.",
      "We will assign a full time or part time staff member to your firm depending on your needs. The assigned staff will work exclusively under the directions of your firm."
    ],
    candidateText: "join your bookkeeping team",
    features: ["Xero", "QuickBooks", "Sage", "Hubdoc", "Dext"],
  },
  {
    id: "tax",
    icon: FileText,
    label: "Tax Preparation",
    title: "Tax Preparation Outsourcing for Accounting Firms",
    highlight: "Accounting Firms",
    content: [
      "Tax preparation is high volume work demanding accuracy and attention to detail. Our skilled professional team handles the tax returns on behalf of clients of other firms of accountants. We eliminate the seasonal rush and reduce internal pressure.",
      "Our professionals have experience in the use of diverse tax preparation software and have successfully handled tax preparation engagements for firms of accountants in the **USA, Ireland, UK** among other jurisdictions.",
      "Our tax preparation outsourcing services for CPA Firms can help you deal with the compressing tax season by building a team of professionals and keeping your accounts, records, reports, and more as per the taxation legislation and compliances.",
      "Our highly experienced tax preparers help you achieve high tax benefits without stretching out your budget. Outsourcing tax preparation to Multiverse CPA helps accounting firms concentrate on onboarding more revenue-generating clients."
    ],
    candidateText: "join your team",
    features: ["USA", "Ireland", "UK", "Year-round support"],
  },
  {
    id: "audit",
    icon: FileSearch,
    label: "Audit & Review",
    title: "Outsourced Audit Service Tailored for Your Business",
    highlight: "Tailored for Your Business",
    content: [
      "Multiverse CPA Audit Division provides outsourced audit services remotely to other firms of accountants. We also provide review and compilation of financial statements.",
      "Our team comprises qualified and vetted experienced accountants who are members in good standing of their respective professional bodies.",
      "We have handled engagements under **US GAAP, Canada GAAP, FRS 102, FRS 105, IFRS** among other financial reporting frameworks.",
      "Our team has experience in the use of diverse audit tools such as CaseWare, Voyager Auditmate, Myworkingpapers, Audit Assistant among others. We handle all the stages of the audit process from planning, execution and finalization."
    ],
    candidateText: "join your audit team",
    features: ["US GAAP", "IFRS", "FRS 102", "CaseWare"],
  },
  {
    id: "consulting",
    icon: BarChart3,
    label: "Consulting Services",
    title: "Outsourced Consulting Services for Strategic Growth",
    highlight: "Strategic Growth",
    content: [
      "Over the last few years, the business landscape has become a lot more complex and cut-throat, forcing companies to adapt a more forward-looking approach. Businesses that leverage data to identify risks & opportunities, predict trends & patterns, and facilitate strategic decision-making are more likely to drive efficiencies and increase sales.",
      "Our consulting division handles diverse assignments based on the terms of reference of clients. We have handled **financial analysis, preparation of budget plans to aid in government contracting work, financial statement preparation, Payroll services, Engagement Quality Control Reviews** etc.",
      "A typical scenario is a USA based CPA firm which has been contracted to offer payroll services for one of its clients. We assign one of our team members to work for the CPA firm either full time or part time depending on the demands of the role.",
      "Our team comprises professionals with superior excel skills utilizing such tools as **Vlookup, Pivot Tables and other complex formulae**. We are also agile enough to learn new software and other financial tools."
    ],
    candidateText: "join your team",
    features: ["Financial Analysis", "Budget Plans", "Payroll", "Excel Expertise"],
  },
];

function formatContent(text: string) {
  // Convert **text** to bold
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, index) => 
    index % 2 === 1 ? <span key={index} className="font-semibold text-qx-blue">{part}</span> : part
  );
}

export default function ServicesModern() {
  return (
    <LayoutModern>
      {/* Hero Section */}
      <section className="relative py-10 md:py-12 bg-gradient-to-br from-qx-blue to-qx-blue-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-48 h-48 bg-qx-orange rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-3">
              <Briefcase className="w-3 h-3 text-qx-orange" />
              <span className="text-xs text-qx-orange uppercase tracking-wider">
                Our Services
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-white mb-3">
              Outsourcing Services for{" "}
              <span className="text-qx-orange">Accounting Firms</span>
            </h1>
            <p className="text-sm md:text-base text-white/80">
              Comprehensive outsourced accounting solutions tailored to your firm's needs. We act as a one-stop shop for your company's financial requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Services Navigation */}
      <section className="py-6 bg-white border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {services.map((service) => (
              <a
                key={service.id}
                href={`#${service.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-qx-light-gray hover:bg-qx-orange hover:text-white text-qx-blue text-sm font-medium transition-colors"
              >
                <service.icon className="w-4 h-4" />
                {service.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Services List */}
      {services.map((service, index) => (
        <section
          key={service.id}
          id={service.id}
          className={`py-10 md:py-12 ${index % 2 === 0 ? "bg-white" : "bg-qx-light-gray"}`}
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <AnimatedSection>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-qx-orange to-amber-400 flex items-center justify-center shadow-lg">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-filter-label text-qx-orange uppercase tracking-wide">
                    {service.label}
                  </span>
                </div>

                <h2 className="text-section-title text-qx-blue mb-6">
                  {service.title.split(service.highlight)[0]}
                  <span className="text-qx-orange">{service.highlight}</span>
                  {service.title.split(service.highlight)[1] || ''}
                </h2>

                {/* Features Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-qx-blue/10 text-qx-blue text-sm font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="space-y-4 text-body-paragraph text-qx-gray leading-relaxed">
                  {service.content.map((paragraph, pIndex) => (
                    <p key={pIndex}>{formatContent(paragraph)}</p>
                  ))}
                  {service.id !== "bookkeeping" && (
                    <p>
                      <Link to="/careers" className="text-qx-orange hover:underline font-medium">
                        View our current vacancies →
                      </Link>
                    </p>
                  )}
                </div>

                <ServiceCTA candidateText={service.candidateText} />
              </AnimatedSection>
            </div>
          </div>
        </section>
      ))}

      {/* Final CTA Section */}
      <AnimatedSection>
        <section className="py-10 md:py-12 bg-gradient-to-br from-qx-blue via-qx-blue-dark to-qx-blue relative overflow-hidden">
          <div className="absolute inset-0 opacity-15">
            <div className="absolute top-10 right-10 w-48 h-48 bg-qx-orange rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-10 left-10 w-36 h-36 bg-cyan-400 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          </div>

          <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-white mb-2">
              Ready to <span className="text-qx-orange">Partner</span> With Us?
            </h2>
            <p className="text-sm text-white/70 max-w-2xl mx-auto mb-6">
              Schedule a call to discuss further how we can contribute to the mission of your firm.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                className="bg-gradient-to-r from-qx-orange to-amber-500 hover:from-qx-orange-dark hover:to-amber-600 text-white rounded-full px-8 py-6 text-base"
                asChild
              >
                <Link to="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  Book a Free Consultation
                </Link>
              </Button>
              <Button 
                className="bg-white hover:bg-white/90 text-qx-blue rounded-full px-8 py-6 text-base"
                asChild
              >
                <Link to="/employers">
                  <Send className="mr-2 h-5 w-5" />
                  Request a Candidate
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </LayoutModern>
  );
}