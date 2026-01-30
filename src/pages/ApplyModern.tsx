import { useSearchParams, Link } from 'react-router-dom';
import { LayoutModern } from '@/components/layout/LayoutModern';
import CandidateApplicationForm from '@/components/CandidateApplicationForm';
import { ArrowLeft, Briefcase } from 'lucide-react';
import { useJobPostingsStore } from '@/stores/jobPostingsStore';

export default function ApplyModern() {
  const [searchParams] = useSearchParams();
  const jobParam = searchParams.get('job') || undefined;
  const { getJobById } = useJobPostingsStore();

  // Try to get job by ID first, fallback to treating param as title for backwards compatibility
  const jobId = jobParam ? parseInt(jobParam, 10) : undefined;
  const job = jobId && !isNaN(jobId) ? getJobById(jobId) : undefined;
  const jobTitle = job?.title || (jobParam && isNaN(parseInt(jobParam, 10)) ? jobParam : undefined);

  return (
    <LayoutModern>
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-qx-blue to-qx-blue-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-qx-orange rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8">
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Careers
          </Link>
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-qx-orange/20 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-qx-orange" />
              </div>
              {jobTitle && (
                <span className="px-3 py-1 bg-qx-orange/20 text-qx-orange text-filter-label rounded-full">
                  {jobTitle}
                </span>
              )}
            </div>
            <h1 className="text-hero-headline text-white mb-4">
              Apply for a Position
            </h1>
            <p className="text-hero-subtext text-white/80">
              Complete the form below to submit your application. We accept Word documents (.docx)
              only for CVs and cover letters.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-qx-light-gray">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <CandidateApplicationForm jobTitle={jobTitle} jobId={jobId} />
            </div>
          </div>
        </div>
      </section>
    </LayoutModern>
  );
}