import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LayoutModern } from '@/components/layout/LayoutModern';
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
  Users,
  Rocket,
  Heart,
  Globe,
  Search,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Filter,
} from 'lucide-react';
import { useJobPostingsStore, getExperienceLabel } from '@/stores/jobPostingsStore';

const benefits = [
  { icon: Rocket, text: 'Challenging and rewarding environment' },
  { icon: Users, text: 'Build your own knowledge and expertise' },
  { icon: Heart, text: 'Extensive training and development' },
  { icon: Globe, text: 'Work remotely with international firms' },
];

const JOBS_PER_PAGE = 4;

export default function CareersModern() {
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

      const matchesLocation = locationFilter === 'all' || job.location === locationFilter;

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
    window.scrollTo({
      top: document.getElementById('vacancies')?.offsetTop || 0,
      behavior: 'smooth',
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setExperienceFilter('all');
    setLocationFilter('all');
    setCurrentPage(1);
  };

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
              <Briefcase className="w-4 h-4 text-qx-orange" />
              <span className="text-sm font-medium text-white">
                {activeJobs.length} Open Positions
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-white mb-6">
              Join Our <span className="text-qx-orange">Global Team</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed mb-8">
              We provide a challenging and rewarding environment and the chance for you to build
              your own knowledge and expertise.
            </p>
            <Button
              className="bg-qx-orange hover:bg-qx-orange-dark text-white rounded-full px-8"
              asChild
            >
              <a href="#vacancies">
                Browse Opportunities
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-qx-blue mb-6">
                Why Work With Us?
              </h2>
              <p className="text-qx-gray mb-8 leading-relaxed">
                Our dedication to providing outstanding levels of client service means we are always
                on the lookout for bright and ambitious individuals. When you join our team, you
                will be assigned to work remotely with one of the firms with which we have a
                contractual relationship.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.text}
                    className="flex items-start gap-3 p-4 rounded-xl bg-qx-light-gray"
                  >
                    <div className="w-8 h-8 rounded-lg bg-qx-orange/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-4 h-4 text-qx-orange" />
                    </div>
                    <span className="text-sm text-qx-blue">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-qx-light-gray rounded-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-qx-blue mb-4">Career Growth</h3>
              <p className="text-qx-gray mb-6">
                We provide extensive training and development to help you achieve your best. At
                Multiverse CPA, you will be valued as an individual, mentored as a future leader,
                and recognized for your accomplishments and potential.
              </p>
              <Button className="bg-qx-orange hover:bg-qx-orange-dark text-white rounded-full" asChild>
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
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-qx-blue mb-4">Open Positions</h2>
            <p className="text-qx-gray">
              Explore our current openings and find your next opportunity.
            </p>
          </div>

          {/* Filters */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-qx-gray" />
                  <Input
                    placeholder="Search jobs..."
                    className="pl-10 border-gray-200 focus:border-qx-orange focus:ring-qx-orange"
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
                  <SelectTrigger className="border-gray-200">
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
                  <SelectTrigger className="border-gray-200">
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
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-qx-gray">
                    Showing {filteredJobs.length} of {activeJobs.length} jobs
                  </p>
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-qx-orange hover:text-qx-orange-dark">
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-6 max-w-4xl mx-auto">
            {paginatedJobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
                <Briefcase className="w-12 h-12 text-qx-gray mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-qx-blue mb-2">No jobs found</h3>
                <p className="text-qx-gray mb-4">
                  Try adjusting your search or filters to find opportunities.
                </p>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="border-qx-orange text-qx-orange hover:bg-qx-orange hover:text-white"
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              paginatedJobs.map((job) => {
                const isExpanded = expandedJobs.has(job.id);
                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    {/* Job Header */}
                    <div className="p-6 sm:p-8">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-qx-blue mb-2">{job.title}</h3>
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-qx-light-gray text-xs text-qx-gray">
                              <MapPin className="w-3 h-3" />
                              {job.location}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-qx-light-gray text-xs text-qx-gray">
                              <Clock className="w-3 h-3" />
                              {getExperienceLabel(job.experience_required)}
                            </span>
                            {job.salary_range && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-qx-orange/10 text-xs text-qx-orange">
                                <DollarSign className="w-3 h-3" />
                                {job.salary_range}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-qx-gray mb-4">{job.description}</p>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleJobExpand(job.id)}
                        className="text-qx-orange hover:text-qx-orange-dark hover:bg-qx-orange/5"
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
                      <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0 border-t border-gray-100">
                        <div className="grid md:grid-cols-2 gap-8 py-6">
                          {job.requirements && (
                            <div>
                              <h4 className="font-bold text-qx-blue mb-3 text-sm uppercase tracking-wide">
                                Requirements
                              </h4>
                              <div className="space-y-2 text-sm text-qx-gray whitespace-pre-line">
                                {job.requirements}
                              </div>
                            </div>
                          )}
                          {job.benefits && (
                            <div>
                              <h4 className="font-bold text-qx-blue mb-3 text-sm uppercase tracking-wide">
                                Benefits
                              </h4>
                              <div className="space-y-2 text-sm text-qx-gray whitespace-pre-line">
                                {job.benefits}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-gray-100">
                          <Button
                            className="bg-qx-orange hover:bg-qx-orange-dark text-white rounded-full"
                            asChild
                          >
                            <Link to={`/apply?job=${encodeURIComponent(job.title)}`}>
                              Apply Now
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                          <p className="text-xs text-qx-gray">
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
            <Link to="/apply">
              Submit Your Resume
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </LayoutModern>
  );
}
