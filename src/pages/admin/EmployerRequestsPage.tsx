import { useEffect, useState, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useEmployerRequestsStore } from '@/stores/employerRequestsStore';
import { EmployerRequest, ExperienceLevel } from '@/types/admin';
import {
  Building2,
  Search,
  Mail,
  MapPin,
  Briefcase,
  Trash2,
  Eye,
  Users,
  Globe,
  Calendar,
  Clock,
  ExternalLink,
  RefreshCw,
  Download,
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { SortableTableHead, useSorting } from '@/components/admin/SortableTableHead';
import { exportToCSV } from '@/utils/csvExport';
import ItemsPerPageSelect from '@/components/admin/ItemsPerPageSelect';
import { ItemsPerPageOption } from '@/hooks/useItemsPerPage';
import { SearchableSelect, SearchableSelectOption } from '@/components/ui/searchable-select';
import { BulkActionsBar } from '@/components/admin/BulkActionsBar';
import { useBulkSelection } from '@/hooks/useBulkSelection';

import { COUNTRIES, NATIONALITIES } from '@/data/countries';

const experienceLabels: Record<ExperienceLevel, string> = {
  '0-3': '0-3 years',
  '3-7': '3-7 years',
  '7-10': '7-10 years',
  '10+': '10+ years',
};

const nationalityOptions = NATIONALITIES.map((n) => ({ value: n, label: n }));
const countryOptions = COUNTRIES.map((c) => ({ value: c.name, label: c.name }));

const getStoredItemsPerPage = (): ItemsPerPageOption => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('admin-employer-requests-items-per-page');
    if (stored && [5, 10, 25, 50].includes(Number(stored))) {
      return Number(stored) as ItemsPerPageOption;
    }
  }
  return 5;
};

export default function EmployerRequestsPage() {
  const { requests, isLoading, fetchRequests, deleteRequest } = useEmployerRequestsStore();
  const { toast } = useToast();
  const { sortKey, sortDirection, handleSort, sortData } = useSorting<EmployerRequest>();

  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [nationalityFilter, setNationalityFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<ItemsPerPageOption>(getStoredItemsPerPage);
  const [selectedRequest, setSelectedRequest] = useState<EmployerRequest | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<EmployerRequest | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const handleItemsPerPageChange = (value: ItemsPerPageOption) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    localStorage.setItem('admin-employer-requests-items-per-page', String(value));
  };

  // Handle CSV export
  const handleExportCSV = () => {
    exportToCSV(filteredRequests, 'employer_requests', [
      { key: 'firm_name', header: 'Company' },
      { key: 'email', header: 'Email' },
      { key: 'country', header: 'Country' },
      { key: 'position_title', header: 'Position' },
      { key: 'location', header: 'Location' },
      { key: 'years_experience', header: 'Experience Required' },
      { key: 'created_at', header: 'Request Date' },
    ]);
    toast({
      title: 'Export successful',
      description: `Exported ${filteredRequests.length} requests to CSV.`,
    });
  };

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Get unique countries for filter
  const countryOptions: SearchableSelectOption[] = useMemo(() => {
    const uniqueCountries = [...new Set(requests.map((r) => r.country))].sort();
    return uniqueCountries.map((c) => ({ value: c, label: c }));
  }, [requests]);

  // Get unique positions for filter
  const positionOptions: SearchableSelectOption[] = useMemo(() => {
    const uniquePositions = [...new Set(requests.map((r) => r.position_title).filter(Boolean))].sort();
    return uniquePositions.map((p) => ({ value: p!, label: p! }));
  }, [requests]);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        searchTerm === '' ||
        request.firm_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.position_title?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCountry = !countryFilter || request.country === countryFilter;
      const matchesLocation = !locationFilter || request.location?.toLowerCase().includes(locationFilter.toLowerCase());
      const matchesNationality = !nationalityFilter || request.preferred_nationality === nationalityFilter;
      const matchesPosition = !positionFilter || request.position_title === positionFilter;
      const matchesExperience =
        experienceFilter === 'all' || request.years_experience === experienceFilter;

      return matchesSearch && matchesCountry && matchesLocation && matchesNationality && matchesPosition && matchesExperience;
    });
  }, [requests, searchTerm, countryFilter, locationFilter, nationalityFilter, positionFilter, experienceFilter]);

  // Bulk selection
  const {
    selectedItems,
    selectedCount,
    toggleItem,
    selectAll,
    clearSelection,
    isSelected,
    allSelected,
  } = useBulkSelection(filteredRequests);

  // Sort and paginate
  const sortedRequests = sortData(filteredRequests);
  const totalPages = Math.max(1, Math.ceil(sortedRequests.length / itemsPerPage));
  const validCurrentPage = currentPage > totalPages ? 1 : currentPage;
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedRequests.length);
  const paginatedRequests = sortedRequests.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, countryFilter, locationFilter, nationalityFilter, positionFilter, experienceFilter]);

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

  const handleDelete = () => {
    if (requestToDelete) {
      deleteRequest(requestToDelete.id);
      toast({
        title: 'Request deleted',
        description: `Request from ${requestToDelete.firm_name} has been removed.`,
      });
      setDeleteDialogOpen(false);
      setRequestToDelete(null);
    }
  };

  const handleBulkDelete = () => {
    for (const item of selectedItems) {
      deleteRequest(item.id);
    }
    toast({
      title: 'Requests deleted',
      description: `Deleted ${selectedCount} employer requests.`,
    });
    clearSelection();
    setBulkDeleteOpen(false);
  };

  const handleBulkExport = () => {
    exportToCSV(selectedItems, 'employer_requests_selected', [
      { key: 'firm_name', header: 'Company' },
      { key: 'email', header: 'Email' },
      { key: 'country', header: 'Country' },
      { key: 'position_title', header: 'Position' },
      { key: 'location', header: 'Location' },
      { key: 'years_experience', header: 'Experience Required' },
      { key: 'created_at', header: 'Request Date' },
    ]);
    toast({
      title: 'Export successful',
      description: `Exported ${selectedCount} requests to CSV.`,
    });
  };

  const stats = {
    total: requests.length,
    thisWeek: requests.filter((r) => {
      const created = new Date(r.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return created >= weekAgo;
    }).length,
    uniqueCountries: new Set(requests.map((r) => r.country)).size,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Employer Requests</h1>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground" asChild>
                <Link to="/employers" target="_blank">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Page
                </Link>
              </Button>
            </div>
            <p className="text-muted-foreground">
              View and manage recruitment requests from employers
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExportCSV} variant="outline" disabled={filteredRequests.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={async () => {
              await fetchRequests();
              toast({
                title: 'Refreshed',
                description: 'Employer requests have been refreshed.',
              });
            }} variant="outline" disabled={isLoading}>
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
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Requests</p>
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
                <p className="text-2xl font-bold">{stats.uniqueCountries}</p>
                <p className="text-sm text-muted-foreground">Countries</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        <BulkActionsBar
          selectedCount={selectedCount}
          totalCount={filteredRequests.length}
          onSelectAll={selectAll}
          allSelected={allSelected}
          onDelete={() => setBulkDeleteOpen(true)}
          onExport={handleBulkExport}
          onClearSelection={clearSelection}
        />

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 p-4 bg-card rounded-lg border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <SearchableSelect
            options={nationalityOptions}
            value={nationalityFilter}
            onValueChange={setNationalityFilter}
            placeholder="All Nationalities"
            searchPlaceholder="Search nationality..."
          />
          <SearchableSelect
            options={countryOptions}
            value={countryFilter}
            onValueChange={setCountryFilter}
            placeholder="All Countries"
            searchPlaceholder="Search country..."
          />
          <Input
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
          <SearchableSelect
            options={positionOptions}
            value={positionFilter}
            onValueChange={setPositionFilter}
            placeholder="All Positions"
            searchPlaceholder="Search position..."
          />
          <Select value={experienceFilter} onValueChange={setExperienceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Experience" />
            </SelectTrigger>
            <SelectContent className="bg-popover border shadow-lg z-50">
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="0-3">0-3 years</SelectItem>
              <SelectItem value="3-7">3-7 years</SelectItem>
              <SelectItem value="7-10">7-10 years</SelectItem>
              <SelectItem value="10+">10+ years</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            onClick={() => {
              setSearchTerm('');
              setNationalityFilter('');
              setCountryFilter('');
              setLocationFilter('');
              setPositionFilter('');
              setExperienceFilter('all');
            }}
            className="text-muted-foreground"
          >
            Clear Filters
          </Button>
        </div>

        {/* Requests Table */}
        <div className="bg-card rounded-lg border overflow-hidden">
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
                  sortKey="firm_name"
                  currentSortKey={sortKey}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                >
                  Company
                </SortableTableHead>
                <SortableTableHead
                  sortKey="position_title"
                  currentSortKey={sortKey}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                  className="hidden sm:table-cell"
                >
                  Position
                </SortableTableHead>
                <SortableTableHead
                  sortKey="preferred_nationality"
                  currentSortKey={sortKey}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                  className="hidden lg:table-cell"
                >
                  Pref. Nationality
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
                  className="hidden xl:table-cell"
                >
                  Location
                </SortableTableHead>
                <SortableTableHead
                  sortKey="years_experience"
                  currentSortKey={sortKey}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                  className="hidden md:table-cell"
                >
                  Experience
                </SortableTableHead>
                <SortableTableHead
                  sortKey="created_at"
                  currentSortKey={sortKey}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                  className="hidden sm:table-cell"
                >
                  Date
                </SortableTableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 w-4 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="space-y-2"><div className="h-4 w-32 bg-muted animate-pulse rounded" /><div className="h-3 w-24 bg-muted animate-pulse rounded" /></div></TableCell>
                    <TableCell className="hidden sm:table-cell"><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell className="hidden xl:table-cell"><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell className="hidden md:table-cell"><div className="h-6 w-20 bg-muted animate-pulse rounded-full" /></TableCell>
                    <TableCell className="hidden sm:table-cell"><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="flex justify-end gap-1"><div className="h-8 w-8 bg-muted animate-pulse rounded" /><div className="h-8 w-8 bg-muted animate-pulse rounded" /></div></TableCell>
                  </TableRow>
                ))
              ) : paginatedRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Building2 className="w-8 h-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No requests found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRequests.map((request) => (
                  <TableRow key={request.id} className={isSelected(request.id) ? 'bg-muted/50' : ''}>
                    <TableCell>
                      <Checkbox
                        checked={isSelected(request.id)}
                        onCheckedChange={() => toggleItem(request.id)}
                        aria-label={`Select ${request.firm_name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.firm_name}</p>
                        <p className="text-sm text-muted-foreground">{request.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {request.position_title || (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {request.preferred_nationality || (
                        <span className="text-muted-foreground">Any</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {request.country}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm truncate max-w-[100px]">{request.location}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary">
                        {experienceLabels[request.years_experience]}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(request.created_at), 'MMM d, yyyy')}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setRequestToDelete(request);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{endIndex} of {filteredRequests.length} requests
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

        {/* View Details Sheet */}
        <Sheet open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <SheetContent className="sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Request Details</SheetTitle>
              <SheetDescription>
                Submitted on{' '}
                {selectedRequest &&
                  format(new Date(selectedRequest.created_at), 'MMMM d, yyyy')}
              </SheetDescription>
            </SheetHeader>
            {selectedRequest && (
              <div className="mt-6 space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                    Company Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{selectedRequest.firm_name}</p>
                        <p className="text-sm text-muted-foreground">Company Name</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{selectedRequest.email}</p>
                        <p className="text-sm text-muted-foreground">Contact Email</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{selectedRequest.country}</p>
                        <p className="text-sm text-muted-foreground">Country</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                    Candidate Requirements
                  </h4>
                  <div className="space-y-3">
                    {selectedRequest.position_title && (
                      <div className="flex items-start gap-3">
                        <Briefcase className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">{selectedRequest.position_title}</p>
                          <p className="text-sm text-muted-foreground">Position Title</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{selectedRequest.location}</p>
                        <p className="text-sm text-muted-foreground">Location</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{selectedRequest.preferred_nationality}</p>
                        <p className="text-sm text-muted-foreground">Preferred Nationality</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">
                          {experienceLabels[selectedRequest.years_experience]}
                        </p>
                        <p className="text-sm text-muted-foreground">Experience Required</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedRequest.other_qualifications && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                      Additional Notes
                    </h4>
                    <p className="text-sm bg-muted p-4 rounded-lg">
                      {selectedRequest.other_qualifications}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(`mailto:${selectedRequest.email}`)}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Employer
                  </Button>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Request</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the request from {requestToDelete?.firm_name}?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Delete Confirmation Dialog */}
        <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Selected Requests</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedCount} selected requests?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBulkDeleteOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleBulkDelete}>
                Delete {selectedCount} Requests
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
