import { useState, useEffect, useMemo } from 'react';
import { JobPosting, JobPostingFormData, ExperienceLevel } from '@/types/admin';
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
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useJobPostingsStore, getExperienceLabel } from '@/stores/jobPostingsStore';
import { SortableTableHead, useSorting } from '@/components/admin/SortableTableHead';
import { exportToCSV } from '@/utils/csvExport';
import ItemsPerPageSelect from '@/components/admin/ItemsPerPageSelect';
import { ItemsPerPageOption } from '@/hooks/useItemsPerPage';
import { SearchableSelect, SearchableSelectOption } from '@/components/ui/searchable-select';
import { BulkActionsBar } from '@/components/admin/BulkActionsBar';
import { useBulkSelection } from '@/hooks/useBulkSelection';
import { formatSalaryRange } from '@/utils/currencyUtils';

const experienceLevels: { value: ExperienceLevel; label: string }[] = [
  { value: '0-3', label: '0-3 years' },
  { value: '3-7', label: '3-7 years' },
  { value: '7-10', label: '7-10 years' },
  { value: '10+', label: '10+ years' },
];

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
  const { jobs, isLoading, fetchJobs, addJob, updateJob, deleteJob, toggleJobStatus } = useJobPostingsStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<ItemsPerPageOption>(getStoredItemsPerPage);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [deletingJob, setDeletingJob] = useState<JobPosting | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { sortKey, sortDirection, handleSort, sortData } = useSorting<JobPosting>();

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleItemsPerPageChange = (value: ItemsPerPageOption) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    localStorage.setItem('admin-jobs-items-per-page', String(value));
  };

  // Get unique locations for filter
  const locationOptions: SearchableSelectOption[] = useMemo(() => {
    const uniqueLocations = [...new Set(jobs.map((job) => job.location))].sort();
    return uniqueLocations.map((loc) => ({ value: loc, label: loc }));
  }, [jobs]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, locationFilter, experienceFilter]);

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

    if (locationFilter) {
      filtered = filtered.filter((job) => job.location === locationFilter);
    }

    if (experienceFilter) {
      filtered = filtered.filter((job) => job.experience_required === experienceFilter);
    }

    return sortData(filtered);
  }, [jobs, searchQuery, statusFilter, locationFilter, experienceFilter, sortKey, sortDirection]);

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
        toast({
          title: 'Job updated',
          description: `"${data.title}" has been updated.`,
        });
      } else {
        addJob(data);
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
    setIsDeleting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      deleteJob(deletingJob.id);
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
    setIsDeleting(true);
    try {
      for (const item of selectedItems) {
        deleteJob(item.id);
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
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground" asChild>
                  <Link to="/careers" target="_blank">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Page
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Create and manage job advertisements for the Careers page
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Export CSV</span>
              </Button>
              <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 sm:mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button onClick={handleCreate} size="sm">
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">New Job</span>
              </Button>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 p-3 sm:p-4 bg-card rounded-lg border">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <SearchableSelect
            options={locationOptions}
            value={locationFilter}
            onValueChange={setLocationFilter}
            placeholder="All Locations"
            searchPlaceholder="Search country..."
          />

          <Select
            value={experienceFilter || 'all'}
            onValueChange={(value) => setExperienceFilter(value === 'all' ? '' : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Experience" />
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

          <Select
            value={statusFilter}
            onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border shadow-lg z-50">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            onClick={() => {
              setSearchQuery('');
              setLocationFilter('');
              setExperienceFilter('');
              setStatusFilter('all');
            }}
            className="text-muted-foreground"
          >
            Clear Filters
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : paginatedJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No job postings found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' || locationFilter || experienceFilter
                  ? 'Try adjusting your filters'
                  : 'Create your first job posting to get started'}
              </p>
              {!searchQuery && statusFilter === 'all' && !locationFilter && !experienceFilter && (
                <Button onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Job
                </Button>
              )}
            </div>
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
                      sortKey="location"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                      className="hidden md:table-cell"
                    >
                      Location
                    </SortableTableHead>
                    <SortableTableHead
                      sortKey="experience_required"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                      className="hidden lg:table-cell"
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
                    <SortableTableHead
                      sortKey="created_at"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                      className="hidden sm:table-cell"
                    >
                      Created
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
                            {formatSalaryRange(job.salary_range, job.location, job.currency_override)}
                          </div>
                        )}
                        <div className="md:hidden text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {job.location}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="truncate max-w-[150px]">{job.location}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
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
                          />
                          <Badge variant={job.is_active ? 'default' : 'secondary'} className="hidden sm:inline-flex">
                            {job.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {new Date(job.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(job)}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeletingJob(job)}
                            className="text-destructive hover:text-destructive"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
