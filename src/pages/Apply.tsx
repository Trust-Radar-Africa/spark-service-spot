import { useSearchParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import CandidateApplicationForm from '@/components/CandidateApplicationForm';
import { ArrowLeft, Briefcase } from 'lucide-react';

export default function Apply() {
  const [searchParams] = useSearchParams();
  const jobTitle = searchParams.get('job') || undefined;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(38_92%_50%/0.1),transparent_70%)]" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8">
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Careers
          </Link>
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-accent" />
              </div>
              {jobTitle && (
                <span className="px-3 py-1 bg-accent/20 text-accent text-sm font-medium rounded-full">
                  {jobTitle}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-4">
              Apply for a Position
            </h1>
            <p className="text-primary-foreground/80">
              Complete the form below to submit your application. We accept Word documents (.docx)
              only for CVs and cover letters.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-card">
              <CandidateApplicationForm jobTitle={jobTitle} />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
