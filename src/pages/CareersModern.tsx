import { Link } from "react-router-dom";
import { LayoutModern } from "@/components/layout/LayoutModern";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Clock, Briefcase, CheckCircle2, Users, Rocket, Heart, Globe } from "lucide-react";

const benefits = [
  { icon: Rocket, text: "Challenging and rewarding environment" },
  { icon: Users, text: "Build your own knowledge and expertise" },
  { icon: Heart, text: "Extensive training and development" },
  { icon: Globe, text: "Work remotely with international firms" },
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

export default function CareersModern() {
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
                Careers
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join Our{" "}
              <span className="text-qx-orange">Global Team</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              We provide a challenging and rewarding environment and the chance for you to build your own knowledge and expertise.
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-qx-blue mb-6">
                Why Work With Us?
              </h2>
              <p className="text-qx-gray mb-8 leading-relaxed">
                Our dedication to providing outstanding levels of client service means we are always on the lookout for bright and ambitious individuals. When you join our team, you will be assigned to work remotely with one of the firms with which we have a contractual relationship.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit.text} className="flex items-start gap-3 p-4 rounded-xl bg-qx-light-gray">
                    <div className="w-8 h-8 rounded-lg bg-qx-orange/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-4 h-4 text-qx-orange" />
                    </div>
                    <span className="text-sm text-qx-blue">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-qx-light-gray rounded-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-qx-blue mb-4">
                Career Growth
              </h3>
              <p className="text-qx-gray mb-6">
                We provide extensive training and development to help you achieve your best. At Multiverse CPA, you will be valued as an individual, mentored as a future leader, and recognized for your accomplishments and potential.
              </p>
              <Button 
                className="bg-qx-orange hover:bg-qx-orange-dark text-white rounded-full"
                asChild
              >
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
      <section id="vacancies" className="py-20 bg-qx-light-gray">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-qx-blue mb-4">
              Open Positions
            </h2>
            <p className="text-qx-gray">
              Explore our current openings and find your next opportunity.
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {vacancies.map((vacancy) => (
              <div
                key={vacancy.id}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-qx-blue mb-1">
                      {vacancy.title}
                    </h3>
                    <p className="text-qx-orange font-medium">{vacancy.company}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-qx-light-gray text-xs text-qx-gray">
                      <MapPin className="w-3 h-3" />
                      {vacancy.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-qx-light-gray text-xs text-qx-gray">
                      <Briefcase className="w-3 h-3" />
                      {vacancy.type}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-qx-orange/10 text-xs text-qx-orange">
                      <Clock className="w-3 h-3" />
                      Closes: {vacancy.deadline}
                    </span>
                  </div>
                </div>

                <p className="text-qx-gray mb-6">
                  {vacancy.description}
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="font-bold text-qx-blue mb-3 text-sm uppercase tracking-wide">
                      The Role
                    </h4>
                    <ul className="space-y-2">
                      {vacancy.responsibilities.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-qx-gray"
                        >
                          <CheckCircle2 className="w-4 h-4 text-qx-orange flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-qx-blue mb-3 text-sm uppercase tracking-wide">
                      Requirements
                    </h4>
                    <ul className="space-y-2">
                      {vacancy.requirements.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-qx-gray"
                        >
                          <CheckCircle2 className="w-4 h-4 text-qx-orange flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-gray-100">
                  <Button 
                    className="bg-qx-orange hover:bg-qx-orange-dark text-white rounded-full"
                    asChild
                  >
                    <Link to="/contact">
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <p className="text-xs text-qx-gray">
                    Should you not be shortlisted, your details will be considered for other opportunities.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-qx-blue">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Don't See a Suitable Role?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-10">
            Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <Button 
            className="bg-qx-orange hover:bg-qx-orange-dark text-white rounded-full px-8 py-6 text-base"
            asChild
          >
            <Link to="/contact">
              Submit Your Resume
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </LayoutModern>
  );
}
