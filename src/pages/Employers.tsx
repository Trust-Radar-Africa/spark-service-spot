import { Layout } from '@/components/layout/Layout';
import EmployerRequestForm from '@/components/EmployerRequestForm';
import { Building2, Users, Clock, CheckCircle } from 'lucide-react';

export default function Employers() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Find Top Accounting Talent
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Partner with us to access a curated pool of qualified accountants, auditors, 
              and finance professionals ready to join your team.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Pre-Screened Candidates</h3>
              <p className="text-sm text-muted-foreground">
                All candidates are verified and pre-screened for qualifications
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Quick Turnaround</h3>
              <p className="text-sm text-muted-foreground">
                Receive matching profiles within 24-48 hours
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Industry Expertise</h3>
              <p className="text-sm text-muted-foreground">
                Specialized in accounting and finance recruitment
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-sm text-muted-foreground">
                Replacement guarantee if the hire doesn't work out
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Submit Your Recruitment Request
              </h2>
              <p className="text-muted-foreground">
                Tell us about your hiring needs and we will match you with qualified candidates
              </p>
            </div>

            <div className="bg-card border rounded-xl p-6 md:p-8 shadow-sm">
              <EmployerRequestForm />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
