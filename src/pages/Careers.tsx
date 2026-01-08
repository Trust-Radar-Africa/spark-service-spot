import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Clock, Briefcase, CheckCircle2 } from "lucide-react";

const benefits = [
  "Challenging and rewarding environment",
  "Build your own knowledge and expertise",
  "Extensive training and development",
  "Valued as an individual, mentored as a future leader",
  "Recognized for your accomplishments and potential",
  "Work remotely with international firms",
];

const vacancies = [
  {
    id: "audit-seniors-dublin",
    title: "Audit Seniors",
    company: "CA Firm in Dublin, Ireland",
    location: "100% Remote",
    type: "Full-time",
    description:
      "Join an accountancy firm based in Dublin, Ireland to work exclusively remotely in their assurance team.",
    responsibilities: [
      "Financial reporting and Statutory filing and compliance assurance engagements",
      "Supervise multiple concurrent engagements",
      "Direct the preparation and completion of reports, accounts and financial statements",
      "Ensure assignments are run within budget, time and resource requirements",
      "Mentor assistants in career development",
    ],
    requirements: [
      "Fully Qualified ACA, CA, CPA or equivalent",
      "Strong External Audit experience",
      "Minimum 5 years experience in a well established firm",
      "Resume with 3 referees (one from previous firm)",
      "Member in good standing of a recognized professional body",
    ],
    deadline: "February 13, 2026",
  },
  {
    id: "audit-seniors-atlanta",
    title: "Audit Seniors",
    company: "CPA Firm in Atlanta, Georgia",
    location: "100% Remote",
    type: "Full-time",
    description:
      "Join an accountancy firm based in Atlanta, Georgia to work exclusively remotely in their assurance team.",
    responsibilities: [
      "Completion of audit working papers in accordance with US GAAP",
      "Preparation of US GAAP compliant financial statements",
      "Perform review and compilation of financial statements",
      "Liaise with clients to address audit and review issues",
    ],
    requirements: [
      "Fully Qualified ACA, ACCA, CA, CPA or equivalent",
      "Strong External Audit experience",
      "Minimum 5 years experience in a well established firm",
      "Resume with 3 referees (one from previous firm)",
    ],
    deadline: "February 13, 2026",
  },
];

export default function Careers() {
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
              Join Our <span className="text-gradient-gold">Team</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              At Multiverse CPA, we provide a challenging and rewarding
              environment and the chance for you to build your own knowledge and
              expertise.
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
                Why Work With <span className="text-accent">Us</span>?
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Our dedication to providing outstanding levels of client service
                means we are always on the lookout for bright and ambitious
                individuals to join our team of professionals. When you join our
                team, you will be assigned to work remotely with one of the
                firms of accountants with which we have a contractual
                relationship.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-muted rounded-2xl p-8 border border-border">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                Career Growth
              </h3>
              <p className="text-muted-foreground mb-6">
                We provide extensive training and development to help you
                achieve your best. At Multiverse CPA, you will be valued as an
                individual, mentored as a future leader, and recognized for your
                accomplishments and potential.
              </p>
              <Button variant="gold" asChild>
                <a href="#vacancies">
                  View Open Positions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Vacancies Section */}
      <section id="vacancies" className="py-24 bg-muted">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Available <span className="text-accent">Vacancies</span>
            </h2>
            <p className="text-muted-foreground">
              Explore our current openings and find your next opportunity.
            </p>
          </div>

          <div className="space-y-8 max-w-4xl mx-auto">
            {vacancies.map((vacancy) => (
              <div
                key={vacancy.id}
                className="bg-card rounded-2xl p-8 border border-border shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                      {vacancy.title}
                    </h3>
                    <p className="text-accent font-medium">{vacancy.company}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {vacancy.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm text-muted-foreground">
                      <Briefcase className="w-4 h-4" />
                      {vacancy.type}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 text-sm text-accent">
                      <Clock className="w-4 h-4" />
                      Closes: {vacancy.deadline}
                    </span>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">
                  {vacancy.description}
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="font-semibold text-foreground mb-4">
                      The Role
                    </h4>
                    <ul className="space-y-2">
                      {vacancy.responsibilities.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-4">
                      Requirements
                    </h4>
                    <ul className="space-y-2">
                      {vacancy.requirements.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-6 border-t border-border">
                  <Button variant="gold" size="lg" asChild>
                    <Link to="/contact">
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <p className="text-sm text-muted-foreground self-center">
                    Should you not be shortlisted, your details will be
                    considered for other opportunities.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-navy">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-4">
            Don't See a Suitable Role?
          </h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto mb-10">
            Send us your resume and we'll keep you in mind for future
            opportunities that match your skills and experience.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/contact">
              Submit Your Resume
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
