import { Link } from "react-router-dom";
import { LayoutModern } from "@/components/layout/LayoutModern";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Send, FileSearch, Calculator, BarChart3, FileText, Briefcase } from "lucide-react";
import auditImg from "@/assets/audit-service.jpg";
import bookkeepingImg from "@/assets/bookkeeping-service.jpg";
import consultingImg from "@/assets/consulting-service.jpg";
import { AnimatedSection } from "@/components/AnimatedSection";

interface ServiceCTAProps {
  candidateText?: string;
}

function ServiceCTA({ candidateText = "join your team" }: ServiceCTAProps) {
  return (
    <div className="mt-8 p-5 bg-gradient-to-r from-qx-light-gray to-white rounded-xl border border-gray-100">
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

export default function ServicesModern() {
  return (
    <LayoutModern>
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-qx-blue to-qx-blue-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-qx-orange rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-4">
              <Briefcase className="w-4 h-4 text-qx-orange" />
              <span className="text-filter-label text-qx-orange uppercase tracking-wider">
                Our Services
              </span>
            </div>
            <h1 className="text-hero-headline text-white mb-4">
              Outsourcing Services for{" "}
              <span className="text-qx-orange">Accounting Firms</span>
            </h1>
            <p className="text-hero-subtext text-white/80">
              Comprehensive outsourced accounting solutions tailored to your firm's needs. We act as a one-stop shop for your company's financial requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Bookkeeping Service */}
      <section id="bookkeeping" className="py-14 md:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            <AnimatedSection animation="slide-left">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-qx-orange flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-filter-label text-qx-orange uppercase tracking-wide">
                    Bookkeeping Services
                  </span>
                </div>

                <h2 className="text-section-title text-qx-blue mb-4">
                  Tackle Staff Shortages & Grow Your Practice with{" "}
                  <span className="text-qx-orange">Tailored Bookkeeping</span>
                </h2>

                <div className="space-y-4 text-body-paragraph text-qx-gray leading-relaxed">
                  <p>
                    Accountants often hesitate to offer bookkeeping services due to their low margins and time-consuming nature. At Multiverse CPA, we understand these challenges and make the process simple and hassle-free for your firm.
                  </p>
                  <p>
                    Our team of skilled and experienced bookkeepers handles the routine tasks, allowing you and your team to focus on strategic objectives. This transforms bookkeeping into a profitable service, boosting your firm's revenue and productivity. We strive to take the weight off your shoulders and <Link to="/careers" className="text-qx-orange hover:underline font-medium">provide you</Link> with an experience that is seamless, efficient, and valuable.
                  </p>
                  <p>
                    We have professionals with solid experience in the use of bookkeeping software such as <span className="font-semibold text-qx-blue">Xero, QuickBooks, Sage, Hubdoc and Dext</span>. We are continually updating our skills to ensure that we stay on top of the latest advancements in the industry.
                  </p>
                  <p>
                    We will assign a full time or part time staff member to your firm depending on your needs. The assigned staff will work exclusively under the directions of your firm.
                  </p>
                </div>

                <ServiceCTA candidateText="join your bookkeeping team" />
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-right">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl sticky top-24">
                <img
                  src={bookkeepingImg}
                  alt="Bookkeeping Services"
                  className="w-full h-full object-cover"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Tax Preparation Service */}
      <section id="tax" className="py-14 md:py-16 bg-qx-light-gray">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            <AnimatedSection animation="slide-right">
              <div className="lg:order-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-qx-orange flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-filter-label text-qx-orange uppercase tracking-wide">
                    Tax Preparation
                  </span>
                </div>

                <h2 className="text-section-title text-qx-blue mb-4">
                  Tax Preparation Outsourcing for{" "}
                  <span className="text-qx-orange">Accounting Firms</span>
                </h2>

                <div className="space-y-4 text-body-paragraph text-qx-gray leading-relaxed">
                  <p>
                    Tax preparation is high volume work demanding accuracy and attention to detail. Our skilled professional team handles the tax returns on behalf of clients of other firms of accountants. We eliminate the seasonal rush and reduce internal pressure.
                  </p>
                  <p>
                    Our <Link to="/careers" className="text-qx-orange hover:underline font-medium">professionals</Link> have experience in the use of diverse tax preparation software and have successfully handled tax preparation engagements for firms of accountants in the <span className="font-semibold text-qx-blue">USA, Ireland, UK</span> among other jurisdictions.
                  </p>
                  <p>
                    Our tax preparation outsourcing services for CPA Firms can help you deal with the compressing tax season by building a team of professionals and keeping your accounts, records, reports, and more as per the taxation legislation and compliances. We provide year-round and year-end outsourced tax preparation services to meet your tailored need for accounting and taxation resources.
                  </p>
                  <p>
                    Our highly experienced tax preparers help you achieve high tax benefits without stretching out your budget. Our tax preparation services eliminate complexity and resources otherwise engaged in matching tax details and preparing returns for clients.
                  </p>
                  <p>
                    Thus, outsourcing tax preparation to Multiverse CPA helps accounting firms to concentrate on onboarding more revenue-generating clients and providing them value-added services.
                  </p>
                </div>

                <ServiceCTA candidateText="join your team" />
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-left">
              <div className="lg:order-1 aspect-[4/3] rounded-2xl overflow-hidden shadow-xl sticky top-24">
                <img
                  src={auditImg}
                  alt="Tax Preparation Services"
                  className="w-full h-full object-cover"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Audit Service */}
      <section id="audit" className="py-14 md:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            <AnimatedSection animation="slide-left">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-qx-orange flex items-center justify-center">
                    <FileSearch className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-filter-label text-qx-orange uppercase tracking-wide">
                    Audit & Review
                  </span>
                </div>

                <h2 className="text-section-title text-qx-blue mb-4">
                  Outsourced Audit Service{" "}
                  <span className="text-qx-orange">Tailored for Your Business</span>
                </h2>

                <div className="space-y-4 text-body-paragraph text-qx-gray leading-relaxed">
                  <p>
                    Multiverse CPA Audit Division provides outsourced audit services remotely to other firms of accountants. We also provide review and compilation of financial statements.
                  </p>
                  <p>
                    Our team comprises qualified and vetted experienced accountants who are <Link to="/careers" className="text-qx-orange hover:underline font-medium">members in good standing</Link> of their respective professional bodies.
                  </p>
                  <p>
                    We have handled engagements under <span className="font-semibold text-qx-blue">US GAAP, Canada GAAP, FRS 102, FRS 105, IFRS</span> among other financial reporting frameworks.
                  </p>
                  <p>
                    Our team has experience in the use of diverse audit tools such as CaseWare, Voyager Auditmate, Myworkingpapers, Audit Assistant among others. We handle all the stages of the audit process from planning, execution and finalization.
                  </p>
                </div>

                <ServiceCTA candidateText="join your audit team" />
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-right">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl sticky top-24">
                <img
                  src={auditImg}
                  alt="Audit Services"
                  className="w-full h-full object-cover"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Consulting Service */}
      <section id="consulting" className="py-14 md:py-16 bg-qx-light-gray">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            <AnimatedSection animation="slide-right">
              <div className="lg:order-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-qx-orange flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-filter-label text-qx-orange uppercase tracking-wide">
                    Consulting Services
                  </span>
                </div>

                <h2 className="text-section-title text-qx-blue mb-4">
                  Outsourced Consulting Services for{" "}
                  <span className="text-qx-orange">Strategic Growth</span>
                </h2>

                <div className="space-y-4 text-body-paragraph text-qx-gray leading-relaxed">
                  <p>
                    Over the last few years, the business landscape has become a lot more complex and cut-throat, forcing companies to adapt a more forward-looking approach. Businesses that leverage data to identify risks & opportunities, predict trends & patterns, and facilitate strategic decision-making are more likely to drive efficiencies and increase sales.
                  </p>
                  <p>
                    Our consulting division handles diverse assignments based on the terms of reference of clients. We have handled <span className="font-semibold text-qx-blue">financial analysis, preparation of budget plans to aid in government contracting work, financial statement preparation, Payroll services, Engagement Quality Control Reviews</span> etc.
                  </p>
                  <p className="font-medium text-qx-blue">How does it work?</p>
                  <p>
                    A typical scenario is a USA based CPA firm which has been contracted to offer payroll services for one of its clients. We assign one of our team members to work for the CPA firm either full time or part time depending on the demands of the role.
                  </p>
                  <p>
                    Our team comprises professionals with superior excel skills utilizing such tools as <span className="font-semibold text-qx-blue">Vlookup, Pivot Tables and other complex formulae</span>. We are also agile enough to learn new software and other financial tools. <Link to="/careers" className="text-qx-orange hover:underline font-medium">View our current vacancies</Link>.
                  </p>
                </div>

                <ServiceCTA candidateText="join your team" />
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-left">
              <div className="lg:order-1 aspect-[4/3] rounded-2xl overflow-hidden shadow-xl sticky top-24">
                <img
                  src={consultingImg}
                  alt="Consulting Services"
                  className="w-full h-full object-cover"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <AnimatedSection>
        <section className="py-14 md:py-16 bg-gradient-to-br from-qx-blue via-qx-blue-dark to-qx-blue relative overflow-hidden">
          <div className="absolute inset-0 opacity-15">
            <div className="absolute top-10 right-10 w-64 h-64 bg-qx-orange rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-10 left-10 w-48 h-48 bg-cyan-400 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          </div>

          <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
            <h2 className="text-section-title text-white mb-3">
              Ready to <span className="text-qx-orange">Partner</span> With Us?
            </h2>
            <p className="text-hero-subtext text-white/70 max-w-2xl mx-auto mb-8">
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
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-full px-8 py-6 text-base"
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
