import { Link } from 'react-router-dom';
import { LayoutModern } from '@/components/layout/LayoutModern';
import EmployerRequestForm from '@/components/EmployerRequestForm';
import { Building2, Users, Clock, CheckCircle, ArrowRight, Send, Globe, Award } from 'lucide-react';
import { AnimatedSection } from '@/components/AnimatedSection';

const benefits = [
  {
    icon: Users,
    title: "Vetted Professionals",
    description: "CPAs and Chartered Accountants who are members in good standing of their professional bodies"
  },
  {
    icon: Globe,
    title: "Global Experience",
    description: "Candidates with experience from USA, Canada, Australia and Europe"
  },
  {
    icon: Clock,
    title: "Flexible Arrangements",
    description: "Full-time or part-time staff based on your needs, working under your direction"
  },
  {
    icon: Award,
    title: "IFAC Standards",
    description: "All work handled in accordance with international ethical and professional standards"
  },
];

export default function EmployersModern() {
  return (
    <LayoutModern>
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-qx-blue to-qx-blue-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-qx-orange rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-cyan-400 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-4">
              <Building2 className="w-4 h-4 text-qx-orange" />
              <span className="text-filter-label text-white uppercase tracking-wider">
                For Employers
              </span>
            </div>
            <h1 className="text-hero-headline text-white mb-4">
              Request a <span className="text-qx-orange">Candidate</span>
            </h1>
            <p className="text-hero-subtext text-white/80 mb-4">
              If you would like us to refer a candidate meeting certain specifications, send us your request.
            </p>
            <p className="text-body-paragraph text-white/70 mb-6">
              Based on your needs, we shall identify the most suitable candidate for the role. We have candidates with experience handling bookkeeping, tax, audit, compilation and financial analysis. We shall allow you to interview the candidate to ascertain whether they are best fit for the role.
            </p>
            <a 
              href="#request-form" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-qx-orange to-amber-500 hover:from-qx-orange-dark hover:to-amber-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-qx-orange/30"
            >
              <Send className="w-4 h-4" />
              Submit Your Request
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-14 md:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-section-title text-qx-blue mb-3">
                Why Choose <span className="text-qx-orange">Multiverse CPA</span> Candidates?
              </h2>
              <p className="text-section-subtitle text-qx-gray">
                Access our pool of qualified, experienced accounting professionals.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <AnimatedSection key={benefit.title} delay={index * 100}>
                <div className="group p-6 rounded-xl bg-qx-light-gray border border-gray-100 hover:shadow-lg hover:border-qx-orange/20 transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-gradient-to-br from-qx-orange/20 to-qx-orange/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <benefit.icon className="w-6 h-6 text-qx-orange" />
                  </div>
                  <h3 className="text-job-title text-qx-blue mb-2">{benefit.title}</h3>
                  <p className="text-body-paragraph text-qx-gray">
                    {benefit.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-14 md:py-16 bg-qx-light-gray">
        <div className="container mx-auto px-4 lg:px-8">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-section-title text-qx-blue mb-4 text-center">
                How It Works
              </h2>
              <div className="space-y-4 text-body-paragraph text-qx-gray leading-relaxed">
                <p>
                  Your accounting firm will enter into a contract with Multiverse CPA but the staff assigned to your firm will be under your <span className="font-semibold text-qx-blue">exclusive operational control</span>.
                </p>
                <p>
                  A typical scenario is a USA-based CPA firm which has been contracted to offer services for one of its clients. We assign one of our team members to work for the CPA firm either full time or part time depending on the demands of the role.
                </p>
                <p>
                  The assigned staff will work exclusively under the directions of your firm, ensuring seamless integration with your existing team and workflows.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Form Section */}
      <section id="request-form" className="py-14 md:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-10">
                <h2 className="text-section-title text-qx-blue mb-3">
                  Submit Your Request
                </h2>
                <p className="text-section-subtitle text-qx-gray">
                  Tell us about your ideal candidate and we'll match you with the right professional.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <div className="bg-qx-light-gray border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
                <EmployerRequestForm />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <AnimatedSection>
        <section className="py-14 md:py-16 bg-gradient-to-br from-qx-blue via-qx-blue-dark to-qx-blue relative overflow-hidden">
          <div className="absolute inset-0 opacity-15">
            <div className="absolute top-10 right-10 w-64 h-64 bg-qx-orange rounded-full blur-3xl animate-float" />
          </div>

          <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
            <h2 className="text-section-title text-white mb-3">
              Prefer to Discuss First?
            </h2>
            <p className="text-hero-subtext text-white/70 max-w-xl mx-auto mb-8">
              Schedule a call to discuss your specific requirements and how we can help.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-qx-orange to-amber-500 hover:from-qx-orange-dark hover:to-amber-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-qx-orange/30"
            >
              Schedule a Call
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </AnimatedSection>
    </LayoutModern>
  );
}