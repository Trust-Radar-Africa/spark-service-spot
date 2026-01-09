import { Link } from "react-router-dom";
import { LayoutModern } from "@/components/layout/LayoutModern";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Users, Target, Award, Globe, Shield, Zap } from "lucide-react";
import teamImg from "@/assets/team.jpg";

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
      <section className="relative py-20 bg-gradient-to-br from-qx-blue to-qx-blue-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-qx-orange rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
              <span className="text-xs font-semibold text-qx-orange uppercase tracking-wider">
                About Us
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-white mb-6">
              Your Partner in{" "}
              <span className="text-qx-orange">Accounting Excellence</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              A firm of Certified Public Accountants handling exclusively outsourced assignments from firms of accountants in the USA, Canada, Europe and Australia.
            </p>
          </div>
        </div>
      </section>

      {/* People, Process, Platforms */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {approach.map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-6 rounded-xl bg-qx-light-gray">
                <div className="w-12 h-12 rounded-lg bg-qx-orange flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-montserrat font-bold text-qx-blue mb-1">{item.title}</h3>
                  <p className="text-sm text-qx-gray">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-qx-blue mb-6">
                Who We Are
              </h2>
              <p className="text-qx-gray mb-6 leading-relaxed">
                Our team comprises Certified Public Accountants and Chartered Accountants from diverse nationalities and backgrounds. Our professionals have been vetted, tried and tested and are members in good standing of their respective professional bodies.
              </p>
              <p className="text-qx-gray mb-8 leading-relaxed">
                Multiverse CPA is an affiliate member firm of International Federation of Accountants. Being a reputable licensed professional firm of accountants, we guarantee that your affairs will be handled in accordance with best international ethical and professional standards.
              </p>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-qx-light-gray border border-gray-100">
                <div className="w-12 h-12 rounded-lg bg-qx-orange flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-qx-blue">IFAC Affiliate Member</div>
                  <div className="text-sm text-qx-gray">Bound by international ethics and professional standards</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={teamImg}
                  alt="Multiverse CPA Professional Team"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-qx-orange text-white p-4 rounded-xl shadow-lg">
                <div className="text-2xl font-bold">10+</div>
                <div className="text-sm text-white/80">Years Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Outsource Section */}
      <section className="py-20 bg-qx-light-gray">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-qx-blue mb-4">
              Why Outsource to Multiverse CPA?
            </h2>
            <p className="text-qx-gray">
              Discover the advantages of partnering with a globally recognized accounting outsourcing firm.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-100"
              >
                <CheckCircle2 className="w-5 h-5 text-qx-orange flex-shrink-0 mt-0.5" />
                <span className="text-qx-blue">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-qx-blue mb-4">
              Our Core Values
            </h2>
            <p className="text-qx-gray">
              The pillars that define our commitment to excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="text-center p-8 rounded-xl bg-qx-light-gray border border-gray-100 hover:shadow-lg hover:border-qx-orange/20 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-qx-orange/10 flex items-center justify-center mx-auto mb-5">
                  <value.icon className="w-7 h-7 text-qx-orange" />
                </div>
                <h3 className="text-lg font-montserrat font-bold text-qx-blue mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-qx-gray">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-qx-blue">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Take the Next Step
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-10">
            Schedule a call to discuss further how we can contribute to the mission of your firm.
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
              <Link to="/services">Explore Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </LayoutModern>
  );
}
