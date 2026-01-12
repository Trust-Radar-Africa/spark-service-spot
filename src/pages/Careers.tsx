import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  ArrowRight,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle2,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  DollarSign,
} from 'lucide-react';
import { useJobPostingsStore, getExperienceLabel } from '@/stores/jobPostingsStore';
import { ExperienceLevel } from '@/types/admin';

const benefits = [
  'Challenging and rewarding environment',
  'Build your own knowledge and expertise',
  'Extensive training and development',
  'Valued as an individual, mentored as a future leader',
  'Recognized for your accomplishments and potential',
  'Work remotely with international firms',
];

const JOBS_PER_PAGE = 4;

export default function Careers() {
  const { getActiveJobs } = useJobPostingsStore();
  const activeJobs = getActiveJobs();

  const [searchQuery, setSearchQuery] = useState('');
  const [experienceFilter, setExperienceFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedJobs, setExpandedJobs] = useState<Set<number>>(new Set());

  // Get unique locations for filter
  const locations = useMemo(() => {
    const locs = new Set(activeJobs.map((job) => job.location));
    return Array.from(locs).sort();
  }, [activeJobs]);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return activeJobs.filter((job) => {
      const matchesSearch =
        !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesExperience =
        experienceFilter === 'all' || job.experience_required === experienceFilter;

      const matchesLocation =
        locationFilter === 'all' || job.location === locationFilter;

      return matchesSearch && matchesExperience && matchesLocation;
    });
  }, [activeJobs, searchQuery, experienceFilter, locationFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE
  );

  const toggleJobExpand = (jobId: number) => {
    setExpandedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      return next;
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: document.getElementById('vacancies')?.offsetTop || 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setExperienceFilter('all');
    setLocationFilter('all');
    setCurrentPage(1);
  };

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
            <p className="text-xl text-primary-foreground/80 leading-relaxed mb-8">
              At Multiverse CPA, we provide a challenging and rewarding environment and the chance
              for you to build your own knowledge and expertise.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg" asChild>
                <a href="#vacancies">
                  View {activeJobs.length} Open Positions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
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
                Our dedication to providing outstanding levels of client service means we are always
                on the lookout for bright and ambitious individuals to join our team of
                professionals. When you join our team, you will be assigned to work remotely with
                one of the firms of accountants with which we have a contractual relationship.
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
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Career Growth</h3>
              <p className="text-muted-foreground mb-6">
                We provide extensive training and development to help you achieve your best. At
                Multiverse CPA, you will be valued as an individual, mentored as a future leader,
                and recognized for your accomplishments and potential.
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
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Available <span className="text-accent">Vacancies</span>
            </h2>
            <p className="text-muted-foreground">
              Explore our current openings and find your next opportunity.
            </p>
          </div>

          {/* Filters */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                <Select
                  value={experienceFilter}
                  onValueChange={(value) => {
                    setExperienceFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All experience levels</SelectItem>
                    <SelectItem value="0-3">0-3 years</SelectItem>
                    <SelectItem value="3-7">3-7 years</SelectItem>
                    <SelectItem value="7-10">7-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={locationFilter}
                  onValueChange={(value) => {
                    setLocationFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All locations</SelectItem>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(searchQuery || experienceFilter !== 'all' || locationFilter !== 'all') && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredJobs.length} of {activeJobs.length} jobs
                  </p>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-6 max-w-4xl mx-auto">
            {paginatedJobs.length === 0 ? (
              <div className="bg-card rounded-2xl p-12 border border-border text-center">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No jobs found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filters to find opportunities.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear all filters
                </Button>
              </div>
            ) : (
              paginatedJobs.map((job) => {
                const isExpanded = expandedJobs.has(job.id);
                return (
                  <div
                    key={job.id}
                    className="bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
                  >
                    {/* Job Header */}
                    <div className="p-6 sm:p-8">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-2">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="gap-1.5">
                              <MapPin className="w-3 h-3" />
                              {job.location}
                            </Badge>
                            <Badge variant="outline" className="gap-1.5">
                              <Clock className="w-3 h-3" />
                              {getExperienceLabel(job.experience_required)}
                            </Badge>
                            {job.salary_range && (
                              <Badge variant="secondary" className="gap-1.5">
                                <DollarSign className="w-3 h-3" />
                                {job.salary_range}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{job.description}</p>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleJobExpand(job.id)}
                        className="text-accent hover:text-accent/80"
                      >
                        {isExpanded ? (
                          <>
                            Show less <ChevronUp className="ml-1 h-4 w-4" />
                          </>
                        ) : (
                          <>
                            View details <ChevronDown className="ml-1 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0 border-t border-border">
                        <div className="grid md:grid-cols-2 gap-8 py-6">
                          {job.requirements && (
                            <div>
                              <h4 className="font-semibold text-foreground mb-4">Requirements</h4>
                              <div className="space-y-2 text-sm text-muted-foreground whitespace-pre-line">
                                {job.requirements}
                              </div>
                            </div>
                          )}
                          {job.benefits && (
                            <div>
                              <h4 className="font-semibold text-foreground mb-4">Benefits</h4>
                              <div className="space-y-2 text-sm text-muted-foreground whitespace-pre-line">
                                {job.benefits}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-4 pt-6 border-t border-border">
                          <Button variant="gold" size="lg" asChild>
                            <Link to="/contact">
                              Apply Now
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                          <p className="text-sm text-muted-foreground self-center">
                            Should you not be shortlisted, your details will be considered for other
                            opportunities.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-navy">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-4">
            Don't See a Suitable Role?
          </h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto mb-10">
            Send us your resume and we'll keep you in mind for future opportunities that match your
            skills and experience.
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
