import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Users, Target, Award, Globe } from "lucide-react";
import teamImg from "@/assets/team.jpg";
import { AnimatedSection } from "@/components/AnimatedSection";

const values = [
  {
    icon: Award,
    title: "Integrity",
    description:
      "We uphold the highest ethical standards in all our dealings, ensuring transparency and trust.",
  },
  {
    icon: Target,
    title: "Competence",
    description:
      "Our team comprises certified professionals with proven expertise across multiple frameworks.",
  },
  {
    icon: Users,
    title: "Dedication",
    description:
      "We are committed to your success, treating it not as an option but as our responsibility.",
  },
  {
    icon: Globe,
    title: "Global Standards",
    description:
      "As an IFAC affiliate, we adhere to international ethics and professional standards.",
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

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 bg-gradient-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(38_92%_50%/0.1),transparent_70%)]" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary-foreground mb-4">
              About <span className="text-gradient-gold">Multiverse CPA</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              A firm of Certified Public Accountants handling exclusively
              outsourced assignments from firms of accountants in the USA,
              Canada, Europe and Australia.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-14 md:py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <AnimatedSection animation="slide-left">
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
                  Who We Are
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed text-sm md:text-base">
                  Our team comprises Certified Public Accountants and Chartered
                  Accountants from diverse nationalities and backgrounds. Our
                  professionals have been vetted, tried and tested and are members
                  in good standing of their respective professional bodies.
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed text-sm md:text-base">
                  Multiverse CPA is an affiliate member firm of International
                  Federation of Accountants. Being a reputable licensed
                  professional firm of accountants, we guarantee that your affairs
                  will be handled in accordance with best international ethical
                  and professional standards. Based on your needs, we shall identify the most suitable 
                  candidate for the role in hand.
                </p>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted border border-border">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">
                      IFAC Affiliate Member
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Bound by international ethics and professional standards
                    </div>
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
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Why Outsource Section */}
      <section className="py-14 md:py-16 bg-muted">
        <div className="container mx-auto px-4 lg:px-8">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3">
                Why Outsource to{" "}
                <span className="text-accent">Multiverse CPA</span>?
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                Discover the advantages of partnering with a globally recognized
                accounting outsourcing firm.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <AnimatedSection key={index} delay={index * 50}>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-foreground text-sm">{benefit}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-14 md:py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3">
                Our Core <span className="text-accent">Values</span>
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                The pillars that define our commitment to excellence.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {values.map((value, index) => (
              <AnimatedSection key={value.title} delay={index * 100}>
                <div className="text-center p-6 rounded-xl bg-card border border-border hover:shadow-card-hover transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
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
        <section className="py-14 md:py-16 bg-gradient-navy">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary-foreground mb-3">
              Take the Next Step
            </h2>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto mb-4 text-sm md:text-base">
              We strongly recommend that you schedule a call to discuss further how we can contribute to the mission of your firm.
            </p>
            <p className="text-primary-foreground/60 max-w-2xl mx-auto mb-8 text-xs md:text-sm">
              If you would like us to refer a candidate meeting certain specifications, send us your request.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">
                  Schedule a Call
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/services">Explore Services</Link>
              </Button>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </Layout>
  );
}
