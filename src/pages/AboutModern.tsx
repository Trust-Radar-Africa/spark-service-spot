import { Link } from "react-router-dom";
import { LayoutModern } from "@/components/layout/LayoutModern";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Users, Award, Globe, Phone, Send, Mail } from "lucide-react";
import teamImg from "@/assets/team.jpg";
import { AnimatedSection } from "@/components/AnimatedSection";

const benefits = [
  "Handle back office tasks at a fraction of local staff costs",
  "No compromise on quality or professionalism",
  "Staff assigned exclusively under your operational control",
  "Candidates with experience in US, Canada, Australia and Europe financial reporting regimes",
  "Interview candidates to ensure best fit for your firm",
  "Licensed professional firm guaranteeing ethical standards",
  "Expertise in bookkeeping, tax, audit, compilation and financial analysis",
];

export default function AboutModern() {
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
              <Globe className="w-3 h-3 text-qx-orange" />
              <span className="text-xs text-qx-orange uppercase tracking-wider">
                About Multiverse CPA
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-white mb-3">
              Certified Public Accountants for{" "}
              <span className="text-qx-orange">Global Firms</span>
            </h1>
            <p className="text-sm md:text-base text-white/80">
              A firm of Certified Public Accountants handling exclusively outsourced assignments from firms of accountants in the USA, Canada, Europe and Australia.
            </p>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-10 md:py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            <AnimatedSection animation="slide-left">
              <div>
                <h2 className="text-xl md:text-2xl font-heading font-bold text-qx-blue mb-3">
                  Our Team
                </h2>
                <p className="text-body-paragraph text-qx-gray mb-4 leading-relaxed">
                  Our team comprises <span className="font-semibold text-qx-blue">Certified Public Accountants and Chartered Accountants</span> from diverse nationalities and backgrounds. Our professionals have been vetted, tried and tested and are members in good standing of their respective professional bodies.
                </p>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-qx-light-gray border border-gray-100">
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-qx-blue to-qx-blue-dark flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-job-company text-qx-blue">IFAC Affiliate Member</div>
                    <div className="text-job-meta text-qx-gray">Bound by international ethics and professional standards</div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-right">
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={teamImg}
                    alt="Multiverse CPA Professional Team"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-qx-orange text-white p-4 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span className="text-job-title">Global Team</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Why Outsource Section */}
      <section className="py-10 md:py-12 bg-qx-light-gray">
        <div className="container mx-auto px-4 lg:px-8">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto mb-8">
              <h2 className="text-xl md:text-2xl font-heading font-bold text-qx-blue mb-3">
                Why Outsource to <span className="text-qx-orange">Multiverse CPA</span>?
              </h2>
              <p className="text-sm text-qx-gray leading-relaxed mb-3">
                The team at Multiverse CPA will handle all your back office tasks at a fraction of the cost of locally based staff. This will happen <span className="font-semibold text-qx-blue">without compromising on quality</span>. Your accounting firm will enter into a contract with Multiverse CPA but the staff assigned to your firm will be under your exclusive operational control.
              </p>
              <p className="text-sm text-qx-gray leading-relaxed">
                Multiverse CPA being a reputable licensed professional firm of accountants guarantees that your affairs will be handled in accordance with best international ethical and professional standards. Based on your needs, we shall identify the most suitable candidate for the role. We shall allow you to also interview the candidate to ascertain whether they are best fit for the role.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-3 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <AnimatedSection key={index} delay={index * 50}>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100">
                  <CheckCircle2 className="w-5 h-5 text-qx-orange flex-shrink-0 mt-0.5" />
                  <span className="text-body-paragraph text-qx-blue">{benefit}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Take the Next Step CTA Section */}
      <AnimatedSection>
        <section className="py-10 md:py-12 bg-gradient-to-br from-qx-blue via-qx-blue-dark to-qx-blue relative overflow-hidden">
          <div className="absolute inset-0 opacity-15">
            <div className="absolute top-10 right-10 w-48 h-48 bg-qx-orange rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-10 left-10 w-36 h-36 bg-cyan-400 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-heading font-bold text-white mb-2">
                Take the <span className="text-qx-orange">Next Step</span>
              </h2>
              <p className="text-sm text-white/70 max-w-2xl mx-auto">
                We strongly recommend that you schedule a call to discuss further how we can contribute to the mission of your firm.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-3 max-w-4xl mx-auto">
              {/* Schedule a Call */}
              <AnimatedSection delay={100}>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center h-full flex flex-col">
                  <div className="w-12 h-12 rounded-full bg-qx-orange/20 flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6 text-qx-orange" />
                  </div>
                  <h3 className="text-job-title text-white mb-2">Schedule a Call</h3>
                  <p className="text-body-paragraph text-white/70 mb-4 flex-grow">
                    Discuss how we can contribute to the mission of your firm.
                  </p>
                  <Button 
                    className="bg-gradient-to-r from-qx-orange to-amber-500 hover:from-qx-orange-dark hover:to-amber-600 text-white rounded-full w-full"
                    asChild
                  >
                    <Link to="/contact">
                      Book a Call
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </AnimatedSection>

              {/* Request a Candidate */}
              <AnimatedSection delay={200}>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center h-full flex flex-col">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-job-title text-white mb-2">Request a Candidate</h3>
                  <p className="text-body-paragraph text-white/70 mb-4 flex-grow">
                    Need a candidate meeting certain specifications? Send us your request.
                  </p>
                  <Button 
                    className="bg-white hover:bg-white/90 text-qx-blue rounded-full w-full"
                    asChild
                  >
                    <Link to="/employers">
                      Send Request
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </AnimatedSection>

              {/* Contact Us */}
              <AnimatedSection delay={300}>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center h-full flex flex-col">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-job-title text-white mb-2">Contact Us</h3>
                  <p className="text-body-paragraph text-white/70 mb-4 flex-grow">
                    Have enquiries or need clarifications? We're here to help.
                  </p>
                  <Button 
                    className="bg-white hover:bg-white/90 text-qx-blue rounded-full w-full"
                    asChild
                  >
                    <Link to="/contact">
                      Get in Touch
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </LayoutModern>
  );
}