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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
  Globe,
  Building2,
  SlidersHorizontal,
} from 'lucide-react';
import { useJobPostingsStore, getExperienceLabel, WORK_TYPE_LABELS, WORK_TYPE_OPTIONS } from '@/stores/jobPostingsStore';
import { ExperienceLevel, WorkType } from '@/types/admin';
import { AnimatedSection } from '@/components/AnimatedSection';

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
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [workTypeFilter, setWorkTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedJobs, setExpandedJobs] = useState<Set<number>>(new Set());
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Get unique countries for filter
  const countries = useMemo(() => {
    const ctrs = new Set(activeJobs.map((job) => job.country));
    return Array.from(ctrs).sort();
  }, [activeJobs]);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return activeJobs.filter((job) => {
      const matchesSearch =
        !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.country.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesExperience =
        experienceFilter === 'all' || job.experience_required === experienceFilter;

      const matchesCountry = countryFilter === 'all' || job.country === countryFilter;

      const matchesLocation =
        !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());

      const matchesWorkType = workTypeFilter === 'all' || job.work_type === workTypeFilter;

      return matchesSearch && matchesExperience && matchesCountry && matchesLocation && matchesWorkType;
    });
  }, [activeJobs, searchQuery, experienceFilter, countryFilter, locationFilter, workTypeFilter]);

  const hasActiveFilters = searchQuery || experienceFilter !== 'all' || countryFilter !== 'all' || locationFilter || workTypeFilter !== 'all';

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
    setCountryFilter('all');
    setLocationFilter('');
    setWorkTypeFilter('all');
    setCurrentPage(1);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 bg-gradient-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(38_92%_50%/0.1),transparent_70%)]" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground mb-4">
              Join Our <span className="text-gradient-gold">Team</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed mb-6">
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

      {/* Vacancies Section - Now immediately after hero */}
      <AnimatedSection animation="fade-up">
        <section id="vacancies" className="py-14 md:py-16 bg-muted">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">
                Available <span className="text-accent">Vacancies</span>
              </h2>
              <p className="text-muted-foreground">
                Explore our current openings and find your next opportunity.
              </p>
            </div>

            {/* Filters */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                {/* Main search row */}
                <div className="p-4 flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search jobs by title, description, or location..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setFiltersExpanded(!filtersExpanded)}
                    className="gap-2"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {[experienceFilter !== 'all', countryFilter !== 'all', locationFilter, workTypeFilter !== 'all'].filter(Boolean).length}
                      </Badge>
                    )}
                  </Button>
                </div>

                {/* Expandable filters */}
                <Collapsible open={filtersExpanded} onOpenChange={setFiltersExpanded}>
                  <CollapsibleContent>
                    <div className="px-4 pb-4 border-t border-border pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            Experience
                          </label>
                          <Select
                            value={experienceFilter}
                            onValueChange={(value) => {
                              setExperienceFilter(value);
                              setCurrentPage(1);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="All levels" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All levels</SelectItem>
                              <SelectItem value="0-3">0-3 years</SelectItem>
                              <SelectItem value="3-7">3-7 years</SelectItem>
                              <SelectItem value="7-10">7-10 years</SelectItem>
                              <SelectItem value="10+">10+ years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                            <Globe className="h-3 w-3" />
                            Country
                          </label>
                          <Select
                            value={countryFilter}
                            onValueChange={(value) => {
                              setCountryFilter(value);
                              setCurrentPage(1);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="All countries" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All countries</SelectItem>
                              {countries.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                            <MapPin className="h-3 w-3" />
                            City/Location
                          </label>
                          <Input
                            placeholder="e.g. London, Dublin..."
                            value={locationFilter}
                            onChange={(e) => {
                              setLocationFilter(e.target.value);
                              setCurrentPage(1);
                            }}
                          />
                        </div>

                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                            <Building2 className="h-3 w-3" />
                            Work Type
                          </label>
                          <Select
                            value={workTypeFilter}
                            onValueChange={(value) => {
                              setWorkTypeFilter(value);
                              setCurrentPage(1);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="All types" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All types</SelectItem>
                              {WORK_TYPE_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Results summary */}
                {hasActiveFilters && (
                  <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-t border-border">
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
            <div className="space-y-4 max-w-4xl mx-auto">
              {paginatedJobs.length === 0 ? (
                <div className="bg-card rounded-2xl p-10 border border-border text-center">
                  <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No jobs found</h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Try adjusting your search or filters to find opportunities.
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear all filters
                  </Button>
                </div>
              ) : (
                paginatedJobs.map((job, index) => {
                  const isExpanded = expandedJobs.has(job.id);
                  return (
                    <AnimatedSection key={job.id} animation="fade-up" delay={index * 100}>
                      <div className="bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
                        {/* Job Header */}
                        <div className="p-5 sm:p-6">
                          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                            <div>
                              <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground mb-2">
                                {job.title}
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="gap-1.5 text-xs">
                                  <MapPin className="w-3 h-3" />
                                  {job.country}
                                </Badge>
                                <Badge variant="outline" className="gap-1.5 text-xs">
                                  <Clock className="w-3 h-3" />
                                  {getExperienceLabel(job.experience_required)}
                                </Badge>
                                <Badge className="gap-1.5 text-xs bg-accent/10 text-accent border-accent/20 hover:bg-accent/20">
                                  <Building2 className="w-3 h-3" />
                                  {WORK_TYPE_LABELS[job.work_type]}
                                </Badge>
                                {job.salary_range && (
                                  <Badge variant="secondary" className="gap-1.5 text-xs">
                                    <DollarSign className="w-3 h-3" />
                                    {job.salary_range}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{job.description}</p>

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
                          <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 border-t border-border">
                            <div className="grid md:grid-cols-2 gap-6 py-5">
                              {job.requirements && (
                                <div>
                                  <h4 className="font-semibold text-foreground mb-3 text-sm">Requirements</h4>
                                  <div className="space-y-2 text-sm text-muted-foreground whitespace-pre-line">
                                    {job.requirements}
                                  </div>
                                </div>
                              )}
                              {job.benefits && (
                                <div>
                                  <h4 className="font-semibold text-foreground mb-3 text-sm">Benefits</h4>
                                  <div className="space-y-2 text-sm text-muted-foreground whitespace-pre-line">
                                    {job.benefits}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-4 pt-5 border-t border-border">
                              <Button variant="gold" size="lg" asChild>
                                <Link to={`/apply?job=${encodeURIComponent(job.title)}`}>
                                  Apply Now
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                              </Button>
                              <p className="text-xs text-muted-foreground self-center">
                                Should you not be shortlisted, your details will be considered for other
                                opportunities.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </AnimatedSection>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10">
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
      </AnimatedSection>

      {/* Why Join Us Section - Now after vacancies */}
      <AnimatedSection animation="fade-up">
        <section className="py-14 md:py-16 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <AnimatedSection animation="slide-left">
                <div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                    Why Work With <span className="text-accent">Us</span>?
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                    Our dedication to providing outstanding levels of client service means we are always
                    on the lookout for bright and ambitious individuals to join our team of
                    professionals. When you join our team, you will be assigned to work remotely with
                    one of the firms of accountants with which we have a contractual relationship.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {benefits.map((benefit, index) => (
                      <AnimatedSection key={benefit} animation="fade-up" delay={index * 50}>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-foreground text-sm">{benefit}</span>
                        </div>
                      </AnimatedSection>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="slide-right">
                <div className="bg-muted rounded-2xl p-6 border border-border">
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3">Career Growth</h3>
                  <p className="text-muted-foreground mb-5 text-sm">
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
              </AnimatedSection>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection animation="fade-up">
        <section className="py-14 md:py-16 bg-gradient-navy">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-3">
              Don't See a Suitable Role?
            </h2>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto mb-8 text-sm">
              Send us your resume and we will keep you in mind for future opportunities that match your
              skills and experience.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/apply">
                Submit Your Resume
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </AnimatedSection>
    </Layout>
  );
}
