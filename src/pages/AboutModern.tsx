import { Link } from "react-router-dom";
import { LayoutModern } from "@/components/layout/LayoutModern";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Users, Target, Award, Globe, Shield, Zap } from "lucide-react";
import teamImg from "@/assets/team.jpg";
import { AnimatedSection } from "@/components/AnimatedSection";

const values = [
  {
    icon: Award,
    title: "Integrity",
    description: "We uphold the highest ethical standards in all our dealings.",
  },
  {
    icon: Target,
    title: "Competence",
    description: "Certified professionals with proven expertise across multiple frameworks.",
  },
  {
    icon: Users,
    title: "Dedication",
    description: "Committed to your success as our responsibility.",
  },
  {
    icon: Globe,
    title: "Global Standards",
    description: "IFAC affiliate adhering to international ethics.",
  },
];

const benefits = [
  "Handle back office tasks at a fraction of local staff costs",
  "No compromise on quality or professionalism",
  "Staff assigned exclusively under your operational control",
  "Access to candidates experienced in US, Canada, Australia, and Europe",
  "Interview candidates to ensure best fit for your firm",
  "Licensed professional firm guaranteeing ethical standards",
];

const approach = [
  {
    icon: Users,
    title: "People",
    description: "1,100+ dedicated, certified accountants ready to support your firm.",
  },
  {
    icon: Zap,
    title: "Process",
    description: "Proven workflows and four-eyed review ensuring consistent quality.",
  },
  {
    icon: Shield,
    title: "Platforms",
    description: "Secure, compliant technology infrastructure backing every engagement.",
  },
];

export default function AboutModern() {
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
              <span className="text-filter-label text-qx-orange uppercase tracking-wider">
                About Us
              </span>
            </div>
            <h1 className="text-hero-headline text-white mb-4">
              Your Partner in{" "}
              <span className="text-qx-orange">Accounting Excellence</span>
            </h1>
            <p className="text-hero-subtext text-white/80">
              A firm of Certified Public Accountants handling exclusively outsourced assignments from firms of accountants in the USA, Canada, Europe and Australia.
            </p>
          </div>
        </div>
      </section>

      {/* People, Process, Platforms */}
      <AnimatedSection>
        <section className="py-12 md:py-14 bg-white border-b">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              {approach.map((item, index) => (
                <AnimatedSection key={item.title} delay={index * 100}>
                  <div className="flex items-start gap-4 p-5 rounded-xl bg-qx-light-gray">
                    <div className="w-10 h-10 rounded-lg bg-qx-orange flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-job-title text-qx-blue mb-1">{item.title}</h3>
                      <p className="text-body-paragraph text-qx-gray">{item.description}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Main Content Section */}
      <section className="py-14 md:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <AnimatedSection animation="slide-left">
              <div>
                <h2 className="text-section-title text-qx-blue mb-4">
                  Who We Are
                </h2>
                <p className="text-body-paragraph text-qx-gray mb-4">
                  Our team comprises Certified Public Accountants and Chartered Accountants from diverse nationalities and backgrounds. Our professionals have been vetted, tried and tested and are members in good standing of their respective professional bodies.
                </p>
                <p className="text-body-paragraph text-qx-gray mb-6">
                  Multiverse CPA is an affiliate member firm of International Federation of Accountants. Being a reputable licensed professional firm of accountants, we guarantee that your affairs will be handled in accordance with best international ethical and professional standards.
                </p>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-qx-light-gray border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-qx-orange flex items-center justify-center flex-shrink-0">
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
                  <div className="text-job-salary text-2xl">10+</div>
                  <div className="text-job-meta text-white/80">Years Excellence</div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Why Outsource Section */}
      <section className="py-14 md:py-16 bg-qx-light-gray">
        <div className="container mx-auto px-4 lg:px-8">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-section-title text-qx-blue mb-3">
                Why Outsource to Multiverse CPA?
              </h2>
              <p className="text-section-subtitle text-qx-gray">
                Discover the advantages of partnering with a globally recognized accounting outsourcing firm.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
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

      {/* Values Section */}
      <section className="py-14 md:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-section-title text-qx-blue mb-3">
                Our Core Values
              </h2>
              <p className="text-section-subtitle text-qx-gray">
                The pillars that define our commitment to excellence.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {values.map((value, index) => (
              <AnimatedSection key={value.title} delay={index * 100}>
                <div className="text-center p-6 rounded-xl bg-qx-light-gray border border-gray-100 hover:shadow-lg hover:border-qx-orange/20 transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-full bg-qx-orange/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-qx-orange" />
                  </div>
                  <h3 className="text-job-title text-qx-blue mb-2">
                    {value.title}
                  </h3>
                  <p className="text-body-paragraph text-qx-gray">
                    {value.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <AnimatedSection>
        <section className="py-14 md:py-16 bg-qx-blue">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-section-title text-white mb-3">
              Take the Next Step
            </h2>
            <p className="text-hero-subtext text-white/70 max-w-2xl mx-auto mb-8">
              Schedule a call to discuss further how we can contribute to the mission of your firm.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
                <Link to="/services">Explore Services</Link>
              </Button>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </LayoutModern>
  );
}
