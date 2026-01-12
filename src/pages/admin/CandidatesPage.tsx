import { useState, useEffect, useMemo } from 'react';
import { CandidateFilters, ExperienceLevel } from '@/types/admin';
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
import { Badge } from '@/components/ui/badge';
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
import { CandidateApplication } from '@/types/admin';

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
  const [filters, setFilters] = useState<CandidateFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<ItemsPerPageOption>(getStoredItemsPerPage);
  const [candidateToDelete, setCandidateToDelete] = useState<CandidateApplication | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { sortKey, sortDirection, handleSort, sortData } = useSorting<CandidateApplication>();

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

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

  const handleDownloadCV = async (candidate: CandidateApplication) => {
    toast({
      title: 'Download started',
      description: `Downloading CV for ${candidate.first_name} ${candidate.last_name}`,
    });
  };

  const handleDownloadCoverLetter = async (candidate: CandidateApplication) => {
    toast({
      title: 'Download started',
      description: `Downloading cover letter for ${candidate.first_name} ${candidate.last_name}`,
    });
  };

  const handleDelete = async () => {
    if (!candidateToDelete) return;
    setIsDeleting(true);
    try {
      deleteCandidate(candidateToDelete.id);
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
    for (const item of selectedItems) {
      deleteCandidate(item.id);
    }
    toast({
      title: 'Candidates deleted',
      description: `Deleted ${selectedCount} candidates.`,
    });
    clearSelection();
    setBulkDeleteOpen(false);
  };

  const handleBulkExport = () => {
    exportToCSV(selectedItems, 'candidates_selected', [
      { key: 'first_name', header: 'First Name' },
      { key: 'last_name', header: 'Last Name' },
      { key: 'email', header: 'Email' },
      { key: 'nationality', header: 'Nationality' },
      { key: 'experience', header: 'Experience' },
      { key: 'created_at', header: 'Applied Date' },
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 p-4 bg-card rounded-lg border">
          <div className="relative lg:col-span-2">
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
              <SelectValue placeholder="Experience" />
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

          <SearchableSelect
            options={nationalityOptions}
            value={filters.nationality || ''}
            onValueChange={(value) => setFilters({ ...filters, nationality: value })}
            placeholder="All Nationalities"
            searchPlaceholder="Search nationality..."
          />

          <SearchableSelect
            options={countryOptions}
            value={filters.country || ''}
            onValueChange={(value) => setFilters({ ...filters, country: value })}
            placeholder="All Countries"
            searchPlaceholder="Search country..."
          />

          <Button
            variant="ghost"
            onClick={() => setFilters({})}
            className="text-muted-foreground"
          >
            Clear Filters
          </Button>
        </div>

        {/* Bulk Actions */}
        <BulkActionsBar
          selectedCount={selectedCount}
          totalCount={filteredCandidates.length}
          onSelectAll={selectAll}
          allSelected={allSelected}
          onDelete={() => setBulkDeleteOpen(true)}
          onExport={handleBulkExport}
          onClearSelection={clearSelection}
        />

        {/* Bulk Download Actions */}
        {selectedCount > 0 && (
          <div className="flex gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                selectedItems.forEach((c) => handleDownloadCV(c));
                toast({
                  title: 'Bulk download started',
                  description: `Downloading ${selectedCount} CVs.`,
                });
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download CVs ({selectedCount})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                selectedItems.forEach((c) => handleDownloadCoverLetter(c));
                toast({
                  title: 'Bulk download started',
                  description: `Downloading ${selectedCount} cover letters.`,
                });
              }}
            >
              <FileText className="h-4 w-4 mr-2" />
              Download Cover Letters ({selectedCount})
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
                    <TableHead><div className="h-4 w-16 bg-muted animate-pulse rounded" /></TableHead>
                    <TableHead><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableHead>
                    <TableHead><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableHead>
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
                      <TableCell><div className="h-4 w-36 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell><div className="h-6 w-20 bg-muted animate-pulse rounded-full" /></TableCell>
                      <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell><div className="flex gap-2"><div className="h-8 w-8 bg-muted animate-pulse rounded" /><div className="h-8 w-8 bg-muted animate-pulse rounded" /></div></TableCell>
                      <TableCell><div className="h-8 w-8 bg-muted animate-pulse rounded" /></TableCell>
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
                    <TableRow key={candidate.id} className={isSelected(candidate.id) ? 'bg-muted/50' : ''}>
                      <TableCell>
                        <Checkbox
                          checked={isSelected(candidate.id)}
                          onCheckedChange={() => toggleItem(candidate.id)}
                          aria-label={`Select ${candidate.first_name} ${candidate.last_name}`}
                        />
                      </TableCell>
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
                            onClick={() => setCandidateToDelete(candidate)}
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
