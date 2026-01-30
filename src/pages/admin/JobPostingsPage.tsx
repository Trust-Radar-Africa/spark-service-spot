import { useState, useEffect, useMemo } from 'react';
import { JobPosting, JobPostingFormData, ExperienceLevel, WorkType } from '@/types/admin';
import AdminLayout from '@/components/admin/AdminLayout';
import JobPostingForm from '@/components/admin/JobPostingForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { useToast } from '@/hooks/use-toast';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  RefreshCw,
  Briefcase,
  MapPin,
  Clock,
  Eye,
  EyeOff,
  ExternalLink,
  Download,
  SlidersHorizontal,
  Globe,
  Building2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useJobPostingsStore, getExperienceLabel, WORK_TYPE_LABELS } from '@/stores/jobPostingsStore';
import { SortableTableHead, useSorting } from '@/components/admin/SortableTableHead';
import { exportToCSV } from '@/utils/csvExport';
import ItemsPerPageSelect from '@/components/admin/ItemsPerPageSelect';
import { ItemsPerPageOption } from '@/hooks/useItemsPerPage';
import { SearchableSelect, SearchableSelectOption } from '@/components/ui/searchable-select';
import { BulkActionsBar } from '@/components/admin/BulkActionsBar';
import { useBulkSelection } from '@/hooks/useBulkSelection';
import { formatSalaryRange } from '@/utils/currencyUtils';
import { format } from 'date-fns';
import { COUNTRIES } from '@/data/countries';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { useAuditLogger } from '@/stores/auditLogStore';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { ApiErrorState } from '@/components/admin/ApiErrorState';
import { TableLoadingSkeleton, CardsLoadingSkeleton } from '@/components/admin/LoadingState';
import { NoDataState, NoResultsState } from '@/components/admin/EmptyState';

const experienceLevels: { value: ExperienceLevel; label: string }[] = [
  { value: '0-3', label: '0-3 years' },
  { value: '3-7', label: '3-7 years' },
  { value: '7-10', label: '7-10 years' },
  { value: '10+', label: '10+ years' },
];

const countryOptions = COUNTRIES.map((c) => ({ value: c.name, label: c.name }));

const getStoredItemsPerPage = (): ItemsPerPageOption => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('admin-jobs-items-per-page');
    if (stored && [5, 10, 25, 50].includes(Number(stored))) {
      return Number(stored) as ItemsPerPageOption;
    }
  }
  return 5;
};


export default function JobPostingsPage() {
  const { jobs, isLoading, error, fetchJobs, addJob, updateJob, deleteJob, toggleJobStatus } = useJobPostingsStore();
  const { canDelete, canCreate, canUpdate, isViewer } = useAdminPermissions();
  const { user } = useAdminAuth();
  const { logAction } = useAuditLogger();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [countryFilter, setCountryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [workTypeFilter, setWorkTypeFilter] = useState<WorkType | ''>('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [salaryFilter, setSalaryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<ItemsPerPageOption>(getStoredItemsPerPage);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [viewingJob, setViewingJob] = useState<JobPosting | null>(null);
  const [deletingJob, setDeletingJob] = useState<JobPosting | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const { toast } = useToast();
  const { sortKey, sortDirection, handleSort, sortData } = useSorting<JobPosting>();

  const hasActiveFilters = !!(searchQuery || countryFilter || locationFilter || workTypeFilter || experienceFilter || salaryFilter || statusFilter !== 'all');
  const activeFilterCount = [countryFilter, locationFilter, workTypeFilter, experienceFilter, salaryFilter, statusFilter !== 'all' ? statusFilter : ''].filter(Boolean).length;

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleItemsPerPageChange = (value: ItemsPerPageOption) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    localStorage.setItem('admin-jobs-items-per-page', String(value));
  };



  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, countryFilter, locationFilter, workTypeFilter, experienceFilter, salaryFilter]);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let filtered = [...jobs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((job) =>
        statusFilter === 'active' ? job.is_active : !job.is_active
      );
    }

    if (countryFilter) {
      filtered = filtered.filter((job) => job.country === countryFilter);
    }

    if (locationFilter) {
      filtered = filtered.filter((job) => job.location.toLowerCase().includes(locationFilter.toLowerCase()));
    }

    if (workTypeFilter) {
      filtered = filtered.filter((job) => job.work_type === workTypeFilter);
    }

    if (experienceFilter) {
      filtered = filtered.filter((job) => job.experience_required === experienceFilter);
    }

    if (salaryFilter) {
      filtered = filtered.filter((job) => {
        if (!job.salary_range) return false;
        const minSalary = parseInt(job.salary_range.split('-')[0].replace(/\D/g, '')) || 0;
        switch (salaryFilter) {
          case '0-50000': return minSalary < 50000;
          case '50000-100000': return minSalary >= 50000 && minSalary < 100000;
          case '100000-150000': return minSalary >= 100000 && minSalary < 150000;
          case '150000+': return minSalary >= 150000;
          default: return true;
        }
      });
    }

    return sortData(filtered);
  }, [jobs, searchQuery, statusFilter, countryFilter, locationFilter, workTypeFilter, experienceFilter, salaryFilter, sortKey, sortDirection]);

  // Bulk selection
  const {
    selectedIds,
    selectedItems,
    selectedCount,
    toggleItem,
    selectAll,
    clearSelection,
    isSelected,
    allSelected,
  } = useBulkSelection(filteredJobs);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / itemsPerPage));
  const validCurrentPage = currentPage > totalPages ? 1 : currentPage;
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredJobs.length);
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
  };

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

  const handleExportCSV = () => {
    const dataToExport = selectedCount > 0 ? selectedItems : filteredJobs;
    exportToCSV(
      dataToExport,
      'job_postings',
      [
        { key: 'title', header: 'Job Title' },
        { key: 'location', header: 'Location' },
        { key: 'experience_required', header: 'Experience Required' },
        { key: 'salary_range', header: 'Salary Range' },
        { key: 'is_active', header: 'Active' },
        { key: 'created_at', header: 'Created At' },
      ]
    );
    toast({
      title: 'Export complete',
      description: `Exported ${dataToExport.length} job postings to CSV.`,
    });
  };

  const handleRefresh = async () => {
    await fetchJobs();
    toast({
      title: 'Refreshed',
      description: 'Job postings have been refreshed.',
    });
  };

  const handleCreate = () => {
    setEditingJob(null);
    setIsFormOpen(true);
  };

  const handleEdit = (job: JobPosting) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: JobPostingFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (editingJob) {
        updateJob(editingJob.id, data);
        // Log update action
        if (user) {
          logAction(
            'update',
            'jobs',
            editingJob.id,
            data.title,
            { id: String(user.id), name: user.name, email: user.email, role: user.role || 'super_admin' }
          );
        }
        toast({
          title: 'Job updated',
          description: `"${data.title}" has been updated.`,
        });
      } else {
        addJob(data);
        // Log create action
        if (user) {
          logAction(
            'create',
            'jobs',
            'new',
            data.title,
            { id: String(user.id), name: user.name, email: user.email, role: user.role || 'super_admin' }
          );
        }
        toast({
          title: 'Job created',
          description: `"${data.title}" has been created.`,
        });
      }

      setIsFormOpen(false);
      setEditingJob(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save job posting',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingJob) return;
    if (!canDelete('jobs')) {
      toast({
        title: 'Permission denied',
        description: 'You do not have permission to delete job postings.',
        variant: 'destructive',
      });
      return;
    }
    setIsDeleting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      deleteJob(deletingJob.id);
      // Log delete action
      if (user) {
        logAction(
          'delete',
          'jobs',
          deletingJob.id,
          deletingJob.title,
          { id: String(user.id), name: user.name, email: user.email, role: user.role || 'super_admin' }
        );
      }
      toast({
        title: 'Job deleted',
        description: `"${deletingJob.title}" has been removed.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete job posting',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeletingJob(null);
    }
  };

  const handleBulkDelete = async () => {
    if (!canDelete('jobs')) {
      toast({
        title: 'Permission denied',
        description: 'You do not have permission to delete job postings.',
        variant: 'destructive',
      });
      return;
    }
    setIsDeleting(true);
    try {
      for (const item of selectedItems) {
        deleteJob(item.id);
        if (user) {
          logAction(
            'delete',
            'jobs',
            item.id,
            item.title,
            { id: String(user.id), name: user.name, email: user.email, role: user.role || 'super_admin' }
          );
        }
      }
      toast({
        title: 'Jobs deleted',
        description: `Deleted ${selectedCount} job postings.`,
      });
      clearSelection();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete some jobs',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setBulkDeleteOpen(false);
    }
  };

  const handleToggleStatus = (job: JobPosting) => {
    toggleJobStatus(job.id);
    // Log activate/deactivate action
    if (user) {
      logAction(
        job.is_active ? 'deactivate' : 'activate',
        'jobs',
        job.id,
        job.title,
        { id: String(user.id), name: user.name, email: user.email, role: user.role || 'super_admin' }
      );
    }
    toast({
      title: job.is_active ? 'Job deactivated' : 'Job activated',
      description: `"${job.title}" is now ${job.is_active ? 'hidden from' : 'visible on'} the Careers page.`,
    });
  };

  const activeCount = jobs.filter((j) => j.is_active).length;
  const inactiveCount = jobs.filter((j) => !j.is_active).length;

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold">Job Postings</h1>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" asChild title="View Page">
                  <Link to="/careers" target="_blank">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Create and manage job advertisements for the Careers page
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 sm:mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              {canCreate('jobs') && (
                <Button onClick={handleCreate} size="sm">
                  <Plus className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">New Job</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-card rounded-lg border p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold">{jobs.length}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-green-500/10 rounded-lg">
                <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold">{activeCount}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-muted rounded-lg">
                <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold">{inactiveCount}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Inactive</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        <BulkActionsBar
          selectedCount={selectedCount}
          totalCount={filteredJobs.length}
          onSelectAll={selectAll}
          allSelected={allSelected}
          onDelete={() => setBulkDeleteOpen(true)}
          onExport={handleExportCSV}
          onClearSelection={clearSelection}
        />

        {/* Filters */}
        <div className="bg-card rounded-lg border overflow-hidden">
          {/* Main search row */}
          <div className="p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, location, or description..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
              <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-border pt-3 sm:pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Globe className="h-3 w-3" />
                      Country
                    </label>
                    <SearchableSelect
                      options={countryOptions}
                      value={countryFilter}
                      onValueChange={setCountryFilter}
                      placeholder="All Countries"
                      searchPlaceholder="Search country..."
                      anyOptionLabel="All Countries"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" />
                      City/Location
                    </label>
                    <Input
                      placeholder="Filter by location..."
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Building2 className="h-3 w-3" />
                      Work Type
                    </label>
                    <Select
                      value={workTypeFilter || 'all'}
                      onValueChange={(value) => setWorkTypeFilter(value === 'all' ? '' : value as WorkType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border shadow-lg z-50">
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="on-site">On-site</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      Experience
                    </label>
                    <Select
                      value={experienceFilter || 'all'}
                      onValueChange={(value) => setExperienceFilter(value === 'all' ? '' : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Levels" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border shadow-lg z-50">
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
                      <Eye className="h-3 w-3" />
                      Status
                    </label>
                    <Select
                      value={statusFilter}
                      onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border shadow-lg z-50">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSearchQuery('');
                        setCountryFilter('');
                        setLocationFilter('');
                        setWorkTypeFilter('');
                        setExperienceFilter('');
                        setStatusFilter('all');
                      }}
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
            <div className="flex items-center justify-between px-3 sm:px-4 py-3 bg-muted/50 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {filteredJobs.length} of {jobs.length} jobs
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setCountryFilter('');
                  setLocationFilter('');
                  setWorkTypeFilter('');
                  setExperienceFilter('');
                  setStatusFilter('all');
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border overflow-hidden">
          {error ? (
            <ApiErrorState
              title="Failed to load job postings"
              message={error}
              onRetry={fetchJobs}
            />
          ) : isLoading ? (
            <div className="p-4">
              <TableLoadingSkeleton rows={5} columns={6} />
            </div>
          ) : jobs.length === 0 ? (
            <NoDataState entityName="job postings" onRefresh={fetchJobs} />
          ) : paginatedJobs.length === 0 ? (
            <NoResultsState onClearFilters={() => {
              setSearchQuery('');
              setCountryFilter('');
              setLocationFilter('');
              setWorkTypeFilter('');
              setExperienceFilter('');
              setStatusFilter('all');
            }} />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={selectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <SortableTableHead
                      sortKey="title"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    >
                      Job Title
                    </SortableTableHead>
                    <SortableTableHead
                      sortKey="country"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                      className="hidden lg:table-cell"
                    >
                      Country
                    </SortableTableHead>
                    <SortableTableHead
                      sortKey="location"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                      className="hidden md:table-cell"
                    >
                      Location
                    </SortableTableHead>
                    <SortableTableHead
                      sortKey="work_type"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                      className="hidden lg:table-cell"
                    >
                      Work Type
                    </SortableTableHead>
                    <SortableTableHead
                      sortKey="experience_required"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                      className="hidden xl:table-cell"
                    >
                      Experience
                    </SortableTableHead>
                    <SortableTableHead
                      sortKey="is_active"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    >
                      Status
                    </SortableTableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <Checkbox
                          checked={isSelected(job.id)}
                          onCheckedChange={() => toggleItem(job.id)}
                          aria-label={`Select ${job.title}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{job.title}</div>
                        {job.salary_range && (
                          <div className="text-sm text-muted-foreground">
                            {formatSalaryRange(job.salary_range, job.country, job.currency_override)}
                          </div>
                        )}
                        <div className="md:hidden text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {job.country}{job.location ? ` - ${job.location}` : ''}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="truncate max-w-[120px]">{job.country}</span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {job.location ? (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="truncate max-w-[120px]">{job.location}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant={job.work_type === 'remote' ? 'default' : 'secondary'}>
                          {WORK_TYPE_LABELS[job.work_type]}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          {getExperienceLabel(job.experience_required)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={job.is_active}
                            onCheckedChange={() => handleToggleStatus(job)}
                            disabled={isViewer}
                          />
                          <Badge variant={job.is_active ? 'default' : 'secondary'} className="hidden sm:inline-flex">
                            {job.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setViewingJob(job)}
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {canUpdate('jobs') && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(job)}
                                title="Edit"
                                disabled={isViewer}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}
                            {canDelete('jobs') && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeletingJob(job)}
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
                Showing {startIndex + 1}-{endIndex} of {filteredJobs.length}
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

      {/* Create/Edit Sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingJob ? 'Edit Job Posting' : 'Create Job Posting'}</SheetTitle>
            <SheetDescription>
              {editingJob
                ? 'Update the job details below.'
                : 'Fill in the details to create a new job posting.'}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <JobPostingForm
              initialData={editingJob || undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingJob(null);
              }}
              isLoading={isSubmitting}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* View Job Details Sheet */}
      <Sheet open={!!viewingJob} onOpenChange={() => setViewingJob(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Job Posting Details</SheetTitle>
            <SheetDescription>
              {viewingJob?.is_active ? 'Active' : 'Inactive'} posting
              {viewingJob?.created_at && ` • Created ${format(new Date(viewingJob.created_at), 'MMMM d, yyyy')}`}
            </SheetDescription>
          </SheetHeader>
          {viewingJob && (
            <div className="mt-6 space-y-6">
              {/* Title and View Link */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{viewingJob.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={viewingJob.is_active ? 'default' : 'secondary'}>
                        {viewingJob.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{WORK_TYPE_LABELS[viewingJob.work_type]}</Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/careers#job-${viewingJob.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                      View Posting <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Location & Experience */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                  Location & Requirements
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{viewingJob.country}</p>
                      <p className="text-sm text-muted-foreground">Country</p>
                    </div>
                  </div>
                  {viewingJob.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{viewingJob.location}</p>
                        <p className="text-sm text-muted-foreground">City/Region</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{getExperienceLabel(viewingJob.experience_required)}</p>
                      <p className="text-sm text-muted-foreground">Experience Required</p>
                    </div>
                  </div>
                  {viewingJob.salary_range && (
                    <div className="flex items-start gap-3">
                      <Briefcase className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">
                          {formatSalaryRange(viewingJob.salary_range, viewingJob.country, viewingJob.currency_override)}
                        </p>
                        <p className="text-sm text-muted-foreground">Salary Range</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                  Description
                </h4>
                <p className="text-sm bg-muted p-4 rounded-lg whitespace-pre-wrap">
                  {viewingJob.description}
                </p>
              </div>

              {/* Requirements */}
              {viewingJob.requirements && (
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                    Requirements
                  </h4>
                  <p className="text-sm bg-muted p-4 rounded-lg whitespace-pre-wrap">
                    {viewingJob.requirements}
                  </p>
                </div>
              )}

              {/* Benefits */}
              {viewingJob.benefits && (
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                    Benefits
                  </h4>
                  <p className="text-sm bg-muted p-4 rounded-lg whitespace-pre-wrap">
                    {viewingJob.benefits}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t flex gap-2">
                {canUpdate('jobs') && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setViewingJob(null);
                      handleEdit(viewingJob);
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Job
                  </Button>
                )}
                <Button variant="outline" onClick={() => setViewingJob(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingJob} onOpenChange={() => setDeletingJob(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job Posting</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>"{deletingJob?.title}"</strong>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingJob(null)}>
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

      {/* Bulk Delete Confirmation */}
      <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedCount} Job Postings</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCount} selected job postings? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                `Delete ${selectedCount} Jobs`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
