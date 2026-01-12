import { useState, useEffect } from 'react';
import { JobPosting, JobPostingFormData, ExperienceLevel } from '@/types/admin';
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
} from 'lucide-react';

// Mock data for demo
const mockJobPostings: JobPosting[] = [
  {
    id: 1,
    title: 'Senior Accountant',
    description: 'We are looking for an experienced Senior Accountant to join our team. The ideal candidate will have strong analytical skills and experience with financial reporting.',
    location: 'London, UK',
    experience_required: '7-10',
    requirements: 'CPA or ACCA qualified, 7+ years experience in accounting, proficiency in Excel and accounting software.',
    benefits: 'Competitive salary, health insurance, pension scheme, flexible working.',
    salary_range: '£55,000 - £70,000',
    is_active: true,
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-10T09:00:00Z',
  },
  {
    id: 2,
    title: 'Junior Bookkeeper',
    description: 'Entry-level position for a motivated individual looking to start their career in accounting. Full training provided.',
    location: 'Manchester, UK',
    experience_required: '0-3',
    requirements: 'Basic accounting knowledge, attention to detail, willingness to learn.',
    benefits: 'Training and development, career progression, friendly team environment.',
    salary_range: '£25,000 - £30,000',
    is_active: true,
    created_at: '2024-01-12T14:30:00Z',
    updated_at: '2024-01-12T14:30:00Z',
  },
  {
    id: 3,
    title: 'Tax Consultant',
    description: 'Experienced Tax Consultant needed for our growing advisory practice. Handle complex tax matters for corporate clients.',
    location: 'Birmingham, UK',
    experience_required: '3-7',
    requirements: 'CTA qualified, experience with corporate tax, excellent communication skills.',
    benefits: 'Bonus scheme, professional development budget, remote working options.',
    salary_range: '£45,000 - £55,000',
    is_active: false,
    created_at: '2024-01-08T11:00:00Z',
    updated_at: '2024-01-15T16:00:00Z',
  },
  {
    id: 4,
    title: 'Finance Director',
    description: 'Strategic leadership role overseeing all financial operations. Report directly to the CEO and board of directors.',
    location: 'London, UK',
    experience_required: '10+',
    requirements: 'ACA/ACCA/CIMA qualified, 10+ years experience including leadership roles, strategic planning experience.',
    benefits: 'Executive compensation package, car allowance, private healthcare, equity participation.',
    salary_range: '£120,000 - £150,000',
    is_active: true,
    created_at: '2024-01-05T08:00:00Z',
    updated_at: '2024-01-05T08:00:00Z',
  },
];

export default function JobPostingsPage() {
  const [jobs, setJobs] = useState<JobPosting[]>(mockJobPostings);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>(mockJobPostings);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [deletingJob, setDeletingJob] = useState<JobPosting | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Filter jobs based on search and status
  useEffect(() => {
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

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, statusFilter]);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
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
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (editingJob) {
        // Update existing job
        setJobs((prev) =>
          prev.map((job) =>
            job.id === editingJob.id
              ? { ...job, ...data, updated_at: new Date().toISOString() }
              : job
          )
        );
        toast({
          title: 'Job updated',
          description: `"${data.title}" has been updated successfully.`,
        });
      } else {
        // Create new job
        const newJob: JobPosting = {
          id: Math.max(...jobs.map((j) => j.id), 0) + 1,
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setJobs((prev) => [newJob, ...prev]);
        toast({
          title: 'Job created',
          description: `"${data.title}" has been created successfully.`,
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setJobs((prev) => prev.filter((job) => job.id !== deletingJob.id));
      toast({
        title: 'Job deleted',
        description: `"${deletingJob.title}" has been deleted.`,
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

  const handleToggleStatus = async (job: JobPosting) => {
    try {
      const newStatus = !job.is_active;
      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id
            ? { ...j, is_active: newStatus, updated_at: new Date().toISOString() }
            : j
        )
      );
      toast({
        title: newStatus ? 'Job activated' : 'Job deactivated',
        description: `"${job.title}" is now ${newStatus ? 'visible' : 'hidden'} to candidates.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update job status',
        variant: 'destructive',
      });
    }
  };

  const getExperienceLabel = (exp: ExperienceLevel) => {
    const labels: Record<ExperienceLevel, string> = {
      '0-3': '0-3 years',
      '3-7': '3-7 years',
      '7-10': '7-10 years',
      '10+': '10+ years',
    };
    return labels[exp];
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Job Postings</h1>
            <p className="text-muted-foreground">Create and manage job advertisements</p>
          </div>
          <div className="flex gap-2">
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
                <p className="text-2xl font-bold">{jobs.filter((j) => j.is_active).length}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <EyeOff className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{jobs.filter((j) => !j.is_active).length}</p>
                <p className="text-sm text-muted-foreground">Inactive</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredJobs.length === 0 ? (
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
                    <TableHead>Job Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => (
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
                          {job.location}
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
        </div>
      </div>

      {/* Create/Edit Sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingJob ? 'Edit Job Posting' : 'Create Job Posting'}</SheetTitle>
            <SheetDescription>
              {editingJob
                ? 'Update the job details below'
                : 'Fill in the details to create a new job posting'}
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
              Are you sure you want to delete <strong>"{deletingJob?.title}"</strong>? This action
              cannot be undone.
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
