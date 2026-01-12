import { useState, useEffect, useMemo } from 'react';
import { JobPosting, JobPostingFormData } from '@/types/admin';
import AdminLayout from '@/components/admin/AdminLayout';
import JobPostingForm from '@/components/admin/JobPostingForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  const { jobs, addJob, updateJob, deleteJob, toggleJobStatus } = useJobPostingsStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<ItemsPerPageOption>(getStoredItemsPerPage);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [deletingJob, setDeletingJob] = useState<JobPosting | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { sortKey, sortDirection, handleSort, sortData } = useSorting<JobPosting>();

  const handleItemsPerPageChange = (value: ItemsPerPageOption) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    localStorage.setItem('admin-jobs-items-per-page', String(value));
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

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

    return sortData(filtered);
  }, [jobs, searchQuery, statusFilter, sortKey, sortDirection]);

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
    exportToCSV(
      filteredJobs,
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
      description: `Exported ${filteredJobs.length} job postings to CSV.`,
    });
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (editingJob) {
        updateJob(editingJob.id, data);
        toast({
          title: 'Job updated',
          description: `"${data.title}" has been updated. Changes are now visible on the Careers page.`,
        });
      } else {
        addJob(data);
        toast({
          title: 'Job created',
          description: `"${data.title}" has been created and is now visible on the Careers page.`,
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
        description: `"${deletingJob.title}" has been removed from the Careers page.`,
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Job Postings</h1>
              <Button variant="outline" size="sm" asChild>
                <Link to="/careers" target="_blank">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Page
                </Link>
              </Button>
            </div>
            <p className="text-muted-foreground">
              Create and manage job advertisements for the Careers page
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={handleRefresh} variant="outline" disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              New Job
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{jobs.length}</p>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Eye className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeCount}</p>
                <p className="text-sm text-muted-foreground">Active (on Careers)</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <EyeOff className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inactiveCount}</p>
                <p className="text-sm text-muted-foreground">Inactive (hidden)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-card rounded-lg border">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, location, or description..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active only</SelectItem>
              <SelectItem value="inactive">Inactive only</SelectItem>
            </SelectContent>
          </Select>
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
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first job posting to get started'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
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
                    >
                      Location
                    </SortableTableHead>
                    <SortableTableHead
                      sortKey="experience_required"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
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
                        <div className="font-medium">{job.title}</div>
                        {job.salary_range && (
                          <div className="text-sm text-muted-foreground">{job.salary_range}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="truncate max-w-[150px]">{job.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
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
                          <Badge variant={job.is_active ? 'default' : 'secondary'}>
                            {job.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(job.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
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
                Showing {startIndex + 1}-{endIndex} of {filteredJobs.length} jobs
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
                ? 'Update the job details below. Changes will be reflected on the Careers page.'
                : 'Fill in the details to create a new job posting. It will appear on the Careers page.'}
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
              Are you sure you want to delete <strong>"{deletingJob?.title}"</strong>? This will
              remove it from the Careers page and cannot be undone.
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
    </AdminLayout>
  );
}
