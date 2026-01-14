import { LayoutModern } from '@/components/layout/LayoutModern';
import EmployerRequestForm from '@/components/EmployerRequestForm';
import { Building2, Users, Clock, CheckCircle, ArrowRight } from 'lucide-react';

export default function EmployersModern() {
  return (
    <LayoutModern>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Building2 className="w-4 h-4" />
              <span className="text-filter-label">For Employers</span>
            </div>
            <h1 className="text-hero-headline text-foreground mb-6">
              Hire Top Accounting
              <span className="text-primary"> Professionals</span>
            </h1>
            <p className="text-hero-subtext text-muted-foreground mb-8">
              Access our curated talent pool of qualified accountants, auditors, and finance 
              professionals ready to make an immediate impact on your team.
            </p>
            <a href="#request-form" className="inline-flex items-center gap-2 text-primary text-job-company hover:gap-3 transition-all">
              Submit a request <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-job-title text-foreground mb-2">Pre-Screened Talent</h3>
              <p className="text-body-paragraph text-muted-foreground">
                Every candidate is thoroughly vetted for qualifications and experience
              </p>
            </div>
            <div className="group">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-job-title text-foreground mb-2">48-Hour Response</h3>
              <p className="text-body-paragraph text-muted-foreground">
                Receive curated candidate profiles within 24-48 hours of submission
              </p>
            </div>
            <div className="group">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Building2 className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-job-title text-foreground mb-2">Industry Focus</h3>
              <p className="text-body-paragraph text-muted-foreground">
                Specialized exclusively in accounting and finance recruitment
              </p>
            </div>
            <div className="group">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-job-title text-foreground mb-2">Hiring Guarantee</h3>
              <p className="text-body-paragraph text-muted-foreground">
                Free replacement if the placement doesn't meet expectations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="request-form" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-section-title text-foreground mb-4">
                Submit Your Hiring Request
              </h2>
              <p className="text-section-subtitle text-muted-foreground">
                Tell us about your ideal candidate and we'll do the matching
              </p>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl p-8 md:p-10 shadow-xl shadow-primary/5">
              <EmployerRequestForm />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-job-salary text-4xl text-primary mb-2">500+</p>
              <p className="text-job-meta text-muted-foreground">Placements Made</p>
            </div>
            <div>
              <p className="text-job-salary text-4xl text-primary mb-2">150+</p>
              <p className="text-job-meta text-muted-foreground">Client Companies</p>
            </div>
            <div>
              <p className="text-job-salary text-4xl text-primary mb-2">95%</p>
              <p className="text-job-meta text-muted-foreground">Success Rate</p>
            </div>
            <div>
              <p className="text-job-salary text-4xl text-primary mb-2">48h</p>
              <p className="text-job-meta text-muted-foreground">Avg. Response Time</p>
            </div>
          </div>
        </div>
      </section>
    </LayoutModern>
  );
}
