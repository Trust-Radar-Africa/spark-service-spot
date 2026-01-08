import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Users, Target, Award, Globe } from "lucide-react";
import teamImg from "@/assets/team.jpg";

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
      <section className="relative py-24 bg-gradient-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(38_92%_50%/0.1),transparent_70%)]" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground mb-6">
              About <span className="text-gradient-gold">Multiverse CPA</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              A firm of Certified Public Accountants handling exclusively
              outsourced assignments from firms of accountants in the USA,
              Canada, and Europe.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
                Who We Are
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Our team comprises Certified Public Accountants and Chartered
                Accountants from diverse nationalities and backgrounds. Our
                professionals have been vetted, tried and tested and are members
                in good standing of their respective professional bodies.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Multiverse CPA is an affiliate member firm of International
                Federation of Accountants. Being a reputable licensed
                professional firm of accountants, we guarantee that your affairs
                will be handled in accordance with best international ethical
                and professional standards.
              </p>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted border border-border">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    IFAC Affiliate Member
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Bound by international ethics and professional standards
                  </div>
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
            </div>
          </div>
        </div>
      </section>

      {/* Why Outsource Section */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Why Outsource to{" "}
              <span className="text-accent">Multiverse CPA</span>?
            </h2>
            <p className="text-muted-foreground">
              Discover the advantages of partnering with a globally recognized
              accounting outsourcing firm.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border"
              >
                <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Our Core <span className="text-accent">Values</span>
            </h2>
            <p className="text-muted-foreground">
              The pillars that define our commitment to excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="text-center p-8 rounded-xl bg-card border border-border hover:shadow-card-hover transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-navy">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-4">
            Take the Next Step
          </h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto mb-10">
            Schedule a call to discuss further how we can contribute to the
            mission of your firm.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">
                Schedule a Call
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/services">Explore Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
