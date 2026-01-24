import { useState, useEffect, useMemo } from 'react';
import { CandidateFilters, ExperienceLevel, CandidateApplication, CANDIDATE_SALARY_LABELS } from '@/types/admin';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchableSelect } from '@/components/ui/searchable-select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Download,
  Trash2,
  FileText,
  Loader2,
  RefreshCw,
  Users,
  Clock,
  Globe,
  ExternalLink,
  SlidersHorizontal,
  MapPin,
  Flag,
  Eye,
  Briefcase,
  Mail,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { BulkActionsBar } from '@/components/admin/BulkActionsBar';
import { useBulkSelection } from '@/hooks/useBulkSelection';
import { Link } from 'react-router-dom';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { SortableTableHead, useSorting } from '@/components/admin/SortableTableHead';
import { exportToCSV } from '@/utils/csvExport';
import ItemsPerPageSelect from '@/components/admin/ItemsPerPageSelect';
import { ItemsPerPageOption } from '@/hooks/useItemsPerPage';
import { useCandidatesStore } from '@/stores/candidatesStore';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { useAuditLogger } from '@/stores/auditLogStore';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const experienceLevels: { value: ExperienceLevel; label: string }[] = [
  { value: '0-3', label: '0-3 years' },
  { value: '3-7', label: '3-7 years' },
  { value: '7-10', label: '7-10 years' },
  { value: '10+', label: 'Over 10 years' },
];

import { COUNTRIES, NATIONALITIES } from '@/data/countries';

const nationalityOptions = NATIONALITIES.map((n) => ({ value: n, label: n }));
const countryOptions = COUNTRIES.map((c) => ({ value: c.name, label: c.name }));

const getStoredItemsPerPage = (): ItemsPerPageOption => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('admin-candidates-items-per-page');
    if (stored && [5, 10, 25, 50].includes(Number(stored))) {
      return Number(stored) as ItemsPerPageOption;
    }
  }
  return 5;
};

export default function CandidatesPage() {
  const { candidates, isLoading, fetchCandidates, deleteCandidate } = useCandidatesStore();
  const { canDelete, isViewer } = useAdminPermissions();
  const { user } = useAdminAuth();
  const { logAction } = useAuditLogger();
  const [filters, setFilters] = useState<CandidateFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<ItemsPerPageOption>(getStoredItemsPerPage);
  const [candidateToDelete, setCandidateToDelete] = useState<CandidateApplication | null>(null);
  const [candidateToView, setCandidateToView] = useState<CandidateApplication | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const { toast } = useToast();
  const { sortKey, sortDirection, handleSort, sortData } = useSorting<CandidateApplication>();

  const hasActiveFilters = !!(filters.search || filters.nationality || filters.country || filters.location || filters.experience || filters.job_applied || filters.expected_salary);
  const activeFilterCount = [filters.nationality, filters.country, filters.location, filters.experience, filters.job_applied, filters.expected_salary].filter(Boolean).length;

  // Get unique job titles for filter
  const jobOptions = useMemo(() => {
    const jobs = [...new Set(candidates.map((c) => c.job_applied).filter(Boolean))].sort();
    return jobs.map((j) => ({ value: j!, label: j! }));
  }, [candidates]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handleItemsPerPageChange = (value: ItemsPerPageOption) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    localStorage.setItem('admin-candidates-items-per-page', String(value));
  };

  // Format experience for export (e.g., "3-7" -> "3-7 years")
  const formatExperienceForExport = (exp: ExperienceLevel): string => {
    const labels: Record<ExperienceLevel, string> = {
      '0-3': '0-3 years',
      '3-7': '3-7 years',
      '7-10': '7-10 years',
      '10+': 'Over 10 years',
    };
    return labels[exp] || exp;
  };

  // Handle CSV export with all candidate fields
  const handleExportCSV = () => {
    const exportData = filteredCandidates.map((c) => ({
      first_name: c.first_name,
      last_name: c.last_name,
      email: c.email,
      nationality: c.nationality,
      country: c.country,
      expected_salary_label: c.expected_salary ? CANDIDATE_SALARY_LABELS[c.expected_salary] || c.expected_salary : '',
      experience_label: formatExperienceForExport(c.experience),
      cv_url: c.cv_url || '',
      cover_letter_url: c.cover_letter_url || '',
    }));

    exportToCSV(exportData, 'candidates', [
      { key: 'first_name', header: 'First Name' },
      { key: 'last_name', header: 'Last Name' },
      { key: 'email', header: 'Email Address' },
      { key: 'nationality', header: 'Nationality' },
      { key: 'country', header: 'Country of Residence' },
      { key: 'expected_salary_label', header: 'Expected Annual Salary (USD)' },
      { key: 'experience_label', header: 'Years of Experience' },
      { key: 'cv_url', header: 'CV / Resume' },
      { key: 'cover_letter_url', header: 'Cover Letter' },
    ]);
    toast({
      title: 'Export successful',
      description: `Exported ${filteredCandidates.length} candidates to CSV.`,
    });
  };

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    let filtered = [...candidates];
    if (filters.experience) {
      filtered = filtered.filter((c) => c.experience === filters.experience);
    }
    if (filters.nationality) {
      filtered = filtered.filter((c) =>
        c.nationality.toLowerCase().includes(filters.nationality!.toLowerCase())
      );
    }
    if (filters.country) {
      filtered = filtered.filter((c) =>
        c.country?.toLowerCase().includes(filters.country!.toLowerCase())
      );
    }
    if (filters.location) {
      filtered = filtered.filter((c) =>
        c.location?.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    if (filters.job_applied) {
      filtered = filtered.filter((c) => c.job_applied === filters.job_applied);
    }
    if (filters.expected_salary) {
      filtered = filtered.filter((c) => c.expected_salary === filters.expected_salary);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.first_name.toLowerCase().includes(search) ||
          c.last_name.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search) ||
          c.job_applied?.toLowerCase().includes(search)
      );
    }
    return filtered;
  }, [candidates, filters]);

  // Sort and paginate
  const sortedCandidates = sortData(filteredCandidates);

  // Bulk selection
  const {
    selectedItems,
    selectedCount,
    toggleItem,
    selectAll,
    clearSelection,
    isSelected,
    allSelected,
  } = useBulkSelection(sortedCandidates);

  const totalPages = Math.max(1, Math.ceil(sortedCandidates.length / itemsPerPage));
  const validCurrentPage = currentPage > totalPages ? 1 : currentPage;
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedCandidates.length);
  const paginatedCandidates = sortedCandidates.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleRefresh = async () => {
    await fetchCandidates();
    toast({
      title: 'Refreshed',
      description: 'Candidate list has been refreshed.',
    });
  };

  // Helper function to trigger file download
  const triggerDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCV = async (candidate: CandidateApplication) => {
    if (!candidate.cv_url) {
      toast({
        title: 'No CV available',
        description: `${candidate.first_name} ${candidate.last_name} has not uploaded a CV.`,
        variant: 'destructive',
      });
      return;
    }
    
    // Log the download action
    if (user) {
      logAction(
        'download',
        'candidates',
        candidate.id,
        `CV: ${candidate.first_name} ${candidate.last_name}`,
        { id: String(user.id), name: user.name, email: user.email, role: user.role || 'super_admin' }
      );
    }
    
    // Trigger actual download
    const filename = `CV_${candidate.first_name}_${candidate.last_name}.docx`;
    triggerDownload(candidate.cv_url, filename);
    
    toast({
      title: 'Download started',
      description: `Downloading CV for ${candidate.first_name} ${candidate.last_name}`,
    });
  };

  const handleDownloadCoverLetter = async (candidate: CandidateApplication) => {
    if (!candidate.cover_letter_url) {
      toast({
        title: 'No cover letter available',
        description: `${candidate.first_name} ${candidate.last_name} has not uploaded a cover letter.`,
        variant: 'destructive',
      });
      return;
    }
    
    // Log the download action
    if (user) {
      logAction(
        'download',
        'candidates',
        candidate.id,
        `Cover Letter: ${candidate.first_name} ${candidate.last_name}`,
        { id: String(user.id), name: user.name, email: user.email, role: user.role || 'super_admin' }
      );
    }
    
    // Trigger actual download
    const filename = `CoverLetter_${candidate.first_name}_${candidate.last_name}.docx`;
    triggerDownload(candidate.cover_letter_url, filename);
    
    toast({
      title: 'Download started',
      description: `Downloading cover letter for ${candidate.first_name} ${candidate.last_name}`,
    });
  };

  const handleBulkDownloadCVs = () => {
    const candidatesWithCV = selectedItems.filter(c => c.cv_url);
    if (candidatesWithCV.length === 0) {
      toast({
        title: 'No CVs available',
        description: 'None of the selected candidates have uploaded CVs.',
        variant: 'destructive',
      });
      return;
    }
    
    candidatesWithCV.forEach((c) => handleDownloadCV(c));
    toast({
      title: 'Bulk download started',
      description: `Downloading ${candidatesWithCV.length} CVs.`,
    });
  };

  const handleBulkDownloadCoverLetters = () => {
    const candidatesWithCL = selectedItems.filter(c => c.cover_letter_url);
    if (candidatesWithCL.length === 0) {
      toast({
        title: 'No cover letters available',
        description: 'None of the selected candidates have uploaded cover letters.',
        variant: 'destructive',
      });
      return;
    }
    
    candidatesWithCL.forEach((c) => handleDownloadCoverLetter(c));
    toast({
      title: 'Bulk download started',
      description: `Downloading ${candidatesWithCL.length} cover letters.`,
    });
  };

  const handleDelete = async () => {
    if (!candidateToDelete || !canDelete('candidates')) {
      toast({
        title: 'Permission denied',
        description: 'You do not have permission to delete candidates.',
        variant: 'destructive',
      });
      return;
    }
    setIsDeleting(true);
    try {
      deleteCandidate(candidateToDelete.id);
      // Log the action
      if (user) {
        logAction(
          'delete',
          'candidates',
          candidateToDelete.id,
          `${candidateToDelete.first_name} ${candidateToDelete.last_name}`,
          { id: String(user.id), name: user.name, email: user.email, role: user.role || 'super_admin' }
        );
      }
      toast({
        title: 'Candidate deleted',
        description: `${candidateToDelete.first_name} ${candidateToDelete.last_name} has been removed.`,
      });
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'Could not delete candidate',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setCandidateToDelete(null);
    }
  };

  const handleBulkDelete = () => {
    if (!canDelete('candidates')) {
      toast({
        title: 'Permission denied',
        description: 'You do not have permission to delete candidates.',
        variant: 'destructive',
      });
      return;
    }
    for (const item of selectedItems) {
      deleteCandidate(item.id);
      if (user) {
        logAction(
          'delete',
          'candidates',
          item.id,
          `${item.first_name} ${item.last_name}`,
          { id: String(user.id), name: user.name, email: user.email, role: user.role || 'super_admin' }
        );
      }
    }
    toast({
      title: 'Candidates deleted',
      description: `Deleted ${selectedCount} candidates.`,
    });
    clearSelection();
    setBulkDeleteOpen(false);
  };

  const handleBulkExport = () => {
    const exportData = selectedItems.map((c) => ({
      first_name: c.first_name,
      last_name: c.last_name,
      email: c.email,
      nationality: c.nationality,
      country: c.country,
      expected_salary_label: c.expected_salary ? CANDIDATE_SALARY_LABELS[c.expected_salary] || c.expected_salary : '',
      experience_label: formatExperienceForExport(c.experience),
      cv_url: c.cv_url || '',
      cover_letter_url: c.cover_letter_url || '',
    }));

    exportToCSV(exportData, 'candidates_selected', [
      { key: 'first_name', header: 'First Name' },
      { key: 'last_name', header: 'Last Name' },
      { key: 'email', header: 'Email Address' },
      { key: 'nationality', header: 'Nationality' },
      { key: 'country', header: 'Country of Residence' },
      { key: 'expected_salary_label', header: 'Expected Annual Salary (USD)' },
      { key: 'experience_label', header: 'Years of Experience' },
      { key: 'cv_url', header: 'CV / Resume' },
      { key: 'cover_letter_url', header: 'Cover Letter' },
    ]);
    toast({
      title: 'Export successful',
      description: `Exported ${selectedCount} candidates to CSV.`,
    });
  };

  const getExperienceBadgeVariant = (experience: ExperienceLevel) => {
    switch (experience) {
      case '0-3':
        return 'secondary';
      case '3-7':
        return 'default';
      case '7-10':
        return 'default';
      case '10+':
        return 'default';
      default:
        return 'secondary';
    }
  };

  // Calculate stats
  const stats = {
    total: candidates.length,
    thisWeek: candidates.filter((c) => {
      const created = new Date(c.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return created >= weekAgo;
    }).length,
    uniqueNationalities: new Set(candidates.map((c) => c.nationality)).size,
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (validCurrentPage <= 3) {
        pages.push(1, 2, 3, 'ellipsis', totalPages);
      } else if (validCurrentPage >= totalPages - 2) {
        pages.push(1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, 'ellipsis', validCurrentPage, 'ellipsis', totalPages);
      }
    }
    return pages;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Candidate Applications</h1>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" asChild title="View Page">
                <Link to="/apply" target="_blank">
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
            <p className="text-muted-foreground">
              Manage and filter candidate resumes
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline" disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Candidates</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.thisWeek}</p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Globe className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.uniqueNationalities}</p>
                <p className="text-sm text-muted-foreground">Nationalities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg border overflow-hidden">
          {/* Main search row */}
          <div className="p-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or job..."
                className="pl-10"
                value={filters.search || ''}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Expandable filters */}
          <Collapsible open={filtersExpanded} onOpenChange={setFiltersExpanded}>
            <CollapsibleContent>
              <div className="px-4 pb-4 border-t border-border pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Briefcase className="h-3 w-3" />
                      Job Applied
                    </label>
                    <SearchableSelect
                      options={jobOptions}
                      value={filters.job_applied || ''}
                      onValueChange={(value) => setFilters({ ...filters, job_applied: value })}
                      placeholder="All Jobs"
                      searchPlaceholder="Search job..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Flag className="h-3 w-3" />
                      Nationality
                    </label>
                    <SearchableSelect
                      options={nationalityOptions}
                      value={filters.nationality || ''}
                      onValueChange={(value) => setFilters({ ...filters, nationality: value })}
                      placeholder="All Nationalities"
                      searchPlaceholder="Search nationality..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Globe className="h-3 w-3" />
                      Country
                    </label>
                    <SearchableSelect
                      options={countryOptions}
                      value={filters.country || ''}
                      onValueChange={(value) => setFilters({ ...filters, country: value })}
                      placeholder="All Countries"
                      searchPlaceholder="Search country..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" />
                      City/Location
                    </label>
                    <Input
                      placeholder="Filter by location..."
                      value={filters.location || ''}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      Experience
                    </label>
                    <Select
                      value={filters.experience || 'all'}
                      onValueChange={(value) =>
                        setFilters({
                          ...filters,
                          experience: value === 'all' ? undefined : (value as ExperienceLevel),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        {experienceLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <DollarSign className="h-3 w-3" />
                      Expected Salary
                    </label>
                    <Select
                      value={filters.expected_salary || 'all'}
                      onValueChange={(value) =>
                        setFilters({
                          ...filters,
                          expected_salary: value === 'all' ? undefined : value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Ranges" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ranges</SelectItem>
                        {Object.entries(CANDIDATE_SALARY_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="ghost"
                      onClick={() => setFilters({})}
                      className="text-muted-foreground w-full"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Results summary */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {filteredCandidates.length} of {candidates.length} candidates
              </p>
              <Button variant="ghost" size="sm" onClick={() => setFilters({})}>
                Clear filters
              </Button>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {!isViewer && (
          <BulkActionsBar
            selectedCount={selectedCount}
            totalCount={filteredCandidates.length}
            onSelectAll={selectAll}
            allSelected={allSelected}
            onDelete={canDelete('candidates') ? () => setBulkDeleteOpen(true) : undefined}
            onExport={handleBulkExport}
            onClearSelection={clearSelection}
          />
        )}

        {/* Bulk Download Actions */}
        {selectedCount > 0 && !isViewer && (
          <div className="flex flex-wrap gap-2 p-3 bg-accent/50 rounded-lg border">
            <span className="text-sm text-muted-foreground flex items-center mr-2">
              <Download className="h-4 w-4 mr-1.5" />
              Bulk Downloads:
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDownloadCVs}
            >
              <Download className="h-4 w-4 mr-2" />
              Download CVs ({selectedItems.filter(c => c.cv_url).length}/{selectedCount})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDownloadCoverLetters}
            >
              <FileText className="h-4 w-4 mr-2" />
              Download Cover Letters ({selectedItems.filter(c => c.cover_letter_url).length}/{selectedCount})
            </Button>
          </div>
        )}

        {/* Table */}
        <div className="bg-card rounded-lg border overflow-hidden">
          {isLoading ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]"><div className="h-4 w-4 bg-muted animate-pulse rounded" /></TableHead>
                    <TableHead><div className="h-4 w-16 bg-muted animate-pulse rounded" /></TableHead>
                    <TableHead><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableHead>
                    <TableHead><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableHead>
                    <TableHead><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableHead>
                    <TableHead><div className="h-4 w-16 bg-muted animate-pulse rounded" /></TableHead>
                    <TableHead><div className="h-4 w-16 bg-muted animate-pulse rounded" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><div className="h-4 w-4 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell><div className="h-4 w-28 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell><div className="h-4 w-32 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell><div className="h-6 w-20 bg-muted animate-pulse rounded-full" /></TableCell>
                      <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell><div className="flex gap-2"><div className="h-8 w-8 bg-muted animate-pulse rounded" /></div></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : paginatedCandidates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No candidates found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or wait for new applications.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={selectAll}
                        aria-label="Select all"
                        disabled={isViewer}
                      />
                    </TableHead>
                    <SortableTableHead
                      sortKey="first_name"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    >
                      Name
                    </SortableTableHead>
                    <SortableTableHead
                      sortKey="job_applied"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    >
                      Job Applied
                    </SortableTableHead>
                    <SortableTableHead
                      sortKey="nationality"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                      className="hidden lg:table-cell"
                    >
                      Nationality
                    </SortableTableHead>
                    <SortableTableHead
                      sortKey="experience"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    >
                      Experience
                    </SortableTableHead>
                    <SortableTableHead
                      sortKey="expected_salary"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                      className="hidden md:table-cell"
                    >
                      Expected Salary
                    </SortableTableHead>
                    <SortableTableHead
                      sortKey="created_at"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                      className="hidden sm:table-cell"
                    >
                      Applied
                    </SortableTableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCandidates.map((candidate) => (
                    <TableRow key={candidate.id} className={isSelected(candidate.id) ? 'bg-muted/50' : ''}>
                      <TableCell>
                        <Checkbox
                          checked={isSelected(candidate.id)}
                          onCheckedChange={() => toggleItem(candidate.id)}
                          aria-label={`Select ${candidate.first_name} ${candidate.last_name}`}
                          disabled={isViewer}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {candidate.first_name} {candidate.last_name}
                        </div>
                        <div className="text-xs text-muted-foreground">{candidate.email}</div>
                      </TableCell>
                      <TableCell>
                        {candidate.job_applied ? (
                          <Badge variant="outline" className="flex items-center gap-1 w-fit">
                            <Briefcase className="h-3 w-3" />
                            {candidate.job_applied}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{candidate.nationality}</TableCell>
                      <TableCell>
                        <Badge variant={getExperienceBadgeVariant(candidate.experience)}>
                          {candidate.experience} yrs
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {candidate.expected_salary ? (
                          <span className="text-sm">
                            {CANDIDATE_SALARY_LABELS[candidate.expected_salary] || candidate.expected_salary}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {new Date(candidate.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCandidateToView(candidate)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {!isViewer && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownloadCV(candidate)}
                              title="Download CV"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          {!isViewer && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownloadCoverLetter(candidate)}
                              title="Download Cover Letter"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          )}
                          {canDelete('candidates') && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setCandidateToDelete(candidate)}
                              className="text-destructive hover:text-destructive"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{endIndex} of {filteredCandidates.length} candidates
              </p>
              <ItemsPerPageSelect value={itemsPerPage} onChange={handleItemsPerPageChange} />
            </div>
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => goToPage(validCurrentPage - 1)}
                      className={validCurrentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {getPageNumbers().map((page, index) =>
                    page === 'ellipsis' ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <span className="px-3 py-2">...</span>
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => goToPage(page)}
                          isActive={validCurrentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => goToPage(validCurrentPage + 1)}
                      className={validCurrentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </div>

      {/* View Candidate Details Sheet */}
      <Sheet open={!!candidateToView} onOpenChange={() => setCandidateToView(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Candidate Details</SheetTitle>
            <SheetDescription>
              Full application information
            </SheetDescription>
          </SheetHeader>
          {candidateToView && (
            <div className="mt-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{candidateToView.first_name} {candidateToView.last_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {candidateToView.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nationality</p>
                    <p className="font-medium flex items-center gap-1">
                      <Flag className="h-3 w-3" />
                      {candidateToView.nationality}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <Badge variant={getExperienceBadgeVariant(candidateToView.experience)}>
                      {candidateToView.experience} years
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Location */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="font-medium">{candidateToView.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">City/Location</p>
                    <p className="font-medium">{candidateToView.location || '—'}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Job Applied */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Job Application
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Position Applied For</p>
                    {candidateToView.job_applied ? (
                      <Badge variant="outline" className="mt-1">
                        {candidateToView.job_applied}
                      </Badge>
                    ) : (
                      <p className="text-muted-foreground">General Application</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Salary</p>
                    {candidateToView.expected_salary ? (
                      <p className="font-medium flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {CANDIDATE_SALARY_LABELS[candidateToView.expected_salary] || candidateToView.expected_salary}
                      </p>
                    ) : (
                      <p className="text-muted-foreground">—</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Applied On</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(candidateToView.created_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Documents */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents
                </h3>
                {isViewer ? (
                  <p className="text-sm text-muted-foreground">You don't have permission to download documents.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => handleDownloadCV(candidateToView)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download CV / Resume
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => handleDownloadCoverLetter(candidateToView)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Download Cover Letter
                    </Button>
                  </div>
                )}
              </div>

              {/* Actions */}
              {canDelete('candidates') && (
                <>
                  <Separator />
                  <div className="pt-2">
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => {
                        setCandidateToView(null);
                        setCandidateToDelete(candidateToView);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Candidate
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!candidateToDelete} onOpenChange={() => setCandidateToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Candidate</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <strong>
                {candidateToDelete?.first_name} {candidateToDelete?.last_name}
              </strong>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCandidateToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected Candidates</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCount} selected candidates?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              Delete {selectedCount} Candidates
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
