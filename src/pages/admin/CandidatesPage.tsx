import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { CandidateApplication, ExperienceLevel, CandidateFilters } from '@/types/admin';
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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Download,
  Trash2,
  FileText,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react';

const experienceLevels: { value: ExperienceLevel; label: string }[] = [
  { value: '0-3', label: '0-3 years' },
  { value: '3-7', label: '3-7 years' },
  { value: '7-10', label: '7-10 years' },
  { value: '10+', label: 'Over 10 years' },
];

// Mock data for demo (remove when connected to Laravel)
const mockCandidates: CandidateApplication[] = [
  {
    id: 1,
    first_name: 'John',
    last_name: 'Smith',
    email: 'john.smith@example.com',
    nationality: 'British',
    experience: '3-7',
    cv_url: '/uploads/cv-1.docx',
    cover_letter_url: '/uploads/cl-1.docx',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.j@example.com',
    nationality: 'American',
    experience: '7-10',
    cv_url: '/uploads/cv-2.docx',
    cover_letter_url: '/uploads/cl-2.docx',
    created_at: '2024-01-14T14:20:00Z',
    updated_at: '2024-01-14T14:20:00Z',
  },
  {
    id: 3,
    first_name: 'Michael',
    last_name: 'Chen',
    email: 'mchen@example.com',
    nationality: 'Canadian',
    experience: '0-3',
    cv_url: '/uploads/cv-3.docx',
    cover_letter_url: '/uploads/cl-3.docx',
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z',
  },
  {
    id: 4,
    first_name: 'Emma',
    last_name: 'Wilson',
    email: 'emma.w@example.com',
    nationality: 'Australian',
    experience: '10+',
    cv_url: '/uploads/cv-4.docx',
    cover_letter_url: '/uploads/cl-4.docx',
    created_at: '2024-01-12T16:45:00Z',
    updated_at: '2024-01-12T16:45:00Z',
  },
];

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<CandidateApplication[]>(mockCandidates);
  const [filters, setFilters] = useState<CandidateFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteCandidate, setDeleteCandidate] = useState<CandidateApplication | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      // Uncomment when Laravel API is ready
      // const response = await api.getCandidates({
      //   ...filters,
      //   page: currentPage,
      // });
      // setCandidates(response.data);
      // setTotalPages(response.meta.last_page);

      // Mock filtering for demo
      let filtered = [...mockCandidates];
      if (filters.experience) {
        filtered = filtered.filter((c) => c.experience === filters.experience);
      }
      if (filters.nationality) {
        filtered = filtered.filter((c) =>
          c.nationality.toLowerCase().includes(filters.nationality!.toLowerCase())
        );
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.first_name.toLowerCase().includes(search) ||
            c.last_name.toLowerCase().includes(search) ||
            c.email.toLowerCase().includes(search)
        );
      }
      setCandidates(filtered);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch candidates',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [filters, currentPage]);

  const handleDownloadCV = async (candidate: CandidateApplication) => {
    try {
      // Uncomment when Laravel API is ready
      // await api.downloadCV(candidate.id);
      toast({
        title: 'Download started',
        description: `Downloading CV for ${candidate.first_name} ${candidate.last_name}`,
      });
    } catch (error) {
      toast({
        title: 'Download failed',
        description: 'Could not download CV',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadCoverLetter = async (candidate: CandidateApplication) => {
    try {
      // Uncomment when Laravel API is ready
      // await api.downloadCoverLetter(candidate.id);
      toast({
        title: 'Download started',
        description: `Downloading cover letter for ${candidate.first_name} ${candidate.last_name}`,
      });
    } catch (error) {
      toast({
        title: 'Download failed',
        description: 'Could not download cover letter',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      // Uncomment when Laravel API is ready
      // await api.deleteCandidate(deleteCandidate.id);
      setCandidates((prev) => prev.filter((c) => c.id !== deleteCandidate.id));
      toast({
        title: 'Candidate deleted',
        description: `${deleteCandidate.first_name} ${deleteCandidate.last_name} has been removed.`,
      });
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'Could not delete candidate',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteCandidate(null);
    }
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Candidate Applications</h1>
            <p className="text-muted-foreground">
              Manage and filter candidate resumes
            </p>
          </div>
          <Button onClick={fetchCandidates} variant="outline" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-card rounded-lg border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-10"
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

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
              <SelectValue placeholder="Filter by experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All experience levels</SelectItem>
              {experienceLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Filter by nationality..."
            value={filters.nationality || ''}
            onChange={(e) => setFilters({ ...filters, nationality: e.target.value })}
          />

          <Button
            variant="ghost"
            onClick={() => setFilters({})}
            className="text-muted-foreground"
          >
            Clear filters
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : candidates.length === 0 ? (
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
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Nationality</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-medium">
                        {candidate.first_name} {candidate.last_name}
                      </TableCell>
                      <TableCell>{candidate.email}</TableCell>
                      <TableCell>{candidate.nationality}</TableCell>
                      <TableCell>
                        <Badge variant={getExperienceBadgeVariant(candidate.experience)}>
                          {candidate.experience} years
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(candidate.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownloadCV(candidate)}
                            title="Download CV"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownloadCoverLetter(candidate)}
                            title="Download Cover Letter"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteCandidate(candidate)}
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
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteCandidate} onOpenChange={() => setDeleteCandidate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Candidate</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <strong>
                {deleteCandidate?.first_name} {deleteCandidate?.last_name}
              </strong>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteCandidate(null)}>
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
