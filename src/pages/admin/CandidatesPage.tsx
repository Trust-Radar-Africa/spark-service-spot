import { useState, useEffect, useMemo } from 'react';
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
  Clock,
  Globe,
  ExternalLink,
} from 'lucide-react';
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
  {
    id: 5,
    first_name: 'David',
    last_name: 'Brown',
    email: 'david.b@example.com',
    nationality: 'British',
    experience: '3-7',
    cv_url: '/uploads/cv-5.docx',
    cover_letter_url: '/uploads/cl-5.docx',
    created_at: '2024-01-11T11:00:00Z',
    updated_at: '2024-01-11T11:00:00Z',
  },
  {
    id: 6,
    first_name: 'Lisa',
    last_name: 'Taylor',
    email: 'lisa.t@example.com',
    nationality: 'American',
    experience: '0-3',
    cv_url: '/uploads/cv-6.docx',
    cover_letter_url: '/uploads/cl-6.docx',
    created_at: '2024-01-10T09:30:00Z',
    updated_at: '2024-01-10T09:30:00Z',
  },
  {
    id: 7,
    first_name: 'James',
    last_name: 'Anderson',
    email: 'james.a@example.com',
    nationality: 'Canadian',
    experience: '7-10',
    cv_url: '/uploads/cv-7.docx',
    cover_letter_url: '/uploads/cl-7.docx',
    created_at: '2024-01-09T14:15:00Z',
    updated_at: '2024-01-09T14:15:00Z',
  },
];

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
  const [candidates, setCandidates] = useState<CandidateApplication[]>(mockCandidates);
  const [filters, setFilters] = useState<CandidateFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<ItemsPerPageOption>(getStoredItemsPerPage);
  const [deleteCandidate, setDeleteCandidate] = useState<CandidateApplication | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { sortKey, sortDirection, handleSort, sortData } = useSorting<CandidateApplication>();

  const handleItemsPerPageChange = (value: ItemsPerPageOption) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    localStorage.setItem('admin-candidates-items-per-page', String(value));
  };

  // Handle CSV export
  const handleExportCSV = () => {
    exportToCSV(filteredCandidates, 'candidates', [
      { key: 'first_name', header: 'First Name' },
      { key: 'last_name', header: 'Last Name' },
      { key: 'email', header: 'Email' },
      { key: 'nationality', header: 'Nationality' },
      { key: 'experience', header: 'Experience' },
      { key: 'created_at', header: 'Applied Date' },
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
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.first_name.toLowerCase().includes(search) ||
          c.last_name.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search)
      );
    }
    return filtered;
  }, [candidates, filters]);

  // Sort and paginate
  const sortedCandidates = sortData(filteredCandidates);
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

  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCandidates(mockCandidates);
      toast({
        title: 'Refreshed',
        description: 'Candidate list has been refreshed.',
      });
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
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground" asChild>
                <Link to="/apply" target="_blank">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Page
                </Link>
              </Button>
            </div>
            <p className="text-muted-foreground">
              Manage and filter candidate resumes
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExportCSV} variant="outline" disabled={filteredCandidates.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={fetchCandidates} variant="outline" disabled={isLoading}>
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
                    <SortableTableHead
                      sortKey="first_name"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    >
                      Name
                    </SortableTableHead>
                    <SortableTableHead
                      sortKey="email"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    >
                      Email
                    </SortableTableHead>
                    <SortableTableHead
                      sortKey="nationality"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
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
                      sortKey="created_at"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    >
                      Applied
                    </SortableTableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCandidates.map((candidate) => (
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
