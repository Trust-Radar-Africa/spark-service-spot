import { useState, useMemo, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Collapsible,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useAuditLogStore, AuditLogEntry } from '@/stores/auditLogStore';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { SearchableSelect, SearchableSelectOption } from '@/components/ui/searchable-select';
import ItemsPerPageSelect from '@/components/admin/ItemsPerPageSelect';
import { ItemsPerPageOption } from '@/hooks/useItemsPerPage';
import { SortableTableHead, useSorting } from '@/components/admin/SortableTableHead';
import { exportToCSV } from '@/utils/csvExport';
import { useToast } from '@/hooks/use-toast';
import { format, isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
import {
  Search,
  Download,
  History,
  SlidersHorizontal,
  User,
  Calendar,
  Activity,
  Eye,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { Navigate } from 'react-router-dom';

const getStoredItemsPerPage = (): ItemsPerPageOption => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('admin-audit-items-per-page');
    if (stored && [5, 10, 25, 50].includes(Number(stored))) {
      return Number(stored) as ItemsPerPageOption;
    }
  }
  return 10;
};

const ACTION_LABELS: Record<AuditLogEntry['action'], string> = {
  create: 'Created',
  update: 'Updated',
  delete: 'Deleted',
  archive: 'Archived',
  deactivate: 'Deactivated',
  activate: 'Activated',
  publish: 'Published',
  unpublish: 'Unpublished',
  download: 'Downloaded',
};

const ACTION_COLORS: Record<AuditLogEntry['action'], string> = {
  create: 'bg-green-500/10 text-green-600',
  update: 'bg-blue-500/10 text-blue-600',
  delete: 'bg-red-500/10 text-red-600',
  archive: 'bg-amber-500/10 text-amber-600',
  deactivate: 'bg-gray-500/10 text-gray-600',
  activate: 'bg-emerald-500/10 text-emerald-600',
  publish: 'bg-purple-500/10 text-purple-600',
  unpublish: 'bg-orange-500/10 text-orange-600',
  download: 'bg-cyan-500/10 text-cyan-600',
};

const MODULE_LABELS: Record<AuditLogEntry['module'], string> = {
  candidates: 'Candidates',
  jobs: 'Job Postings',
  employer_requests: 'Employer Requests',
  blog: 'Blog Posts',
};

export default function AuditLogPage() {
  const { logs, fetchLogs, isLoading, clearLogs } = useAuditLogStore();
  const { isAdmin } = useAdminPermissions();
  const { toast } = useToast();
  const { sortKey, sortDirection, handleSort, sortData } = useSorting<AuditLogEntry>();

  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<ItemsPerPageOption>(getStoredItemsPerPage);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  // Fetch logs on mount
  useEffect(() => {
    if (isAdmin) {
      fetchLogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const hasActiveFilters = !!(searchTerm || userFilter || moduleFilter || actionFilter || startDate || endDate);
  const activeFilterCount = [userFilter, moduleFilter, actionFilter, startDate, endDate].filter(Boolean).length;

  // Get unique users for filter
  const userOptions: SearchableSelectOption[] = useMemo(() => {
    const uniqueUsers = [...new Map(logs.map((l) => [l.userId, { id: l.userId, name: l.userName, email: l.userEmail }])).values()];
    return uniqueUsers.map((u) => ({ value: u.id, label: `${u.name} (${u.email})` }));
  }, [logs]);

  // Module options
  const moduleOptions: SearchableSelectOption[] = [
    { value: 'candidates', label: 'Candidates' },
    { value: 'jobs', label: 'Job Postings' },
    { value: 'employer_requests', label: 'Employer Requests' },
    { value: 'blog', label: 'Blog Posts' },
  ];

  // Action options
  const actionOptions: SearchableSelectOption[] = [
    { value: 'create', label: 'Created' },
    { value: 'update', label: 'Updated' },
    { value: 'delete', label: 'Deleted' },
    { value: 'archive', label: 'Archived' },
    { value: 'activate', label: 'Activated' },
    { value: 'deactivate', label: 'Deactivated' },
    { value: 'publish', label: 'Published' },
    { value: 'unpublish', label: 'Unpublished' },
  ];

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        !searchTerm ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resourceName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesUser = !userFilter || log.userId === userFilter;
      const matchesModule = !moduleFilter || log.module === moduleFilter;
      const matchesAction = !actionFilter || log.action === actionFilter;

      let matchesDateRange = true;
      if (startDate || endDate) {
        const logDate = parseISO(log.timestamp);
        const start = startDate ? startOfDay(parseISO(startDate)) : new Date(0);
        const end = endDate ? endOfDay(parseISO(endDate)) : new Date();
        matchesDateRange = isWithinInterval(logDate, { start, end });
      }

      return matchesSearch && matchesUser && matchesModule && matchesAction && matchesDateRange;
    });
  }, [logs, searchTerm, userFilter, moduleFilter, actionFilter, startDate, endDate]);

  const sortedLogs = sortData(filteredLogs);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedLogs.length / itemsPerPage));
  const validCurrentPage = currentPage > totalPages ? 1 : currentPage;
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedLogs.length);
  const paginatedLogs = sortedLogs.slice(startIndex, endIndex);

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

  const handleItemsPerPageChange = (value: ItemsPerPageOption) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    localStorage.setItem('admin-audit-items-per-page', String(value));
  };

  const handleExportCSV = () => {
    exportToCSV(filteredLogs, 'audit_logs', [
      { key: 'timestamp', header: 'Timestamp' },
      { key: 'userName', header: 'User' },
      { key: 'userEmail', header: 'Email' },
      { key: 'userRole', header: 'Role' },
      { key: 'action', header: 'Action' },
      { key: 'module', header: 'Module' },
      { key: 'resourceName', header: 'Resource' },
    ]);
    toast({
      title: 'Export successful',
      description: `Exported ${filteredLogs.length} audit log entries to CSV.`,
    });
  };

  const handleClearLogs = () => {
    clearLogs();
    toast({
      title: 'Logs cleared',
      description: 'All audit log entries have been cleared.',
    });
    setClearDialogOpen(false);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setUserFilter('');
    setModuleFilter('');
    setActionFilter('');
    setStartDate('');
    setEndDate('');
  };

  // Stats
  const stats = {
    total: logs.length,
    today: logs.filter((l) => {
      const logDate = parseISO(l.timestamp);
      const today = new Date();
      return logDate.toDateString() === today.toDateString();
    }).length,
    deletes: logs.filter((l) => l.action === 'delete').length,
  };

  // Only super admins can view audit logs
  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <History className="h-6 w-6" />
              Audit Log
            </h1>
            <p className="text-muted-foreground">
              View all administrative actions and changes
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExportCSV} variant="outline" disabled={filteredLogs.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={() => setClearDialogOpen(true)}
              variant="outline"
              className="text-destructive hover:text-destructive"
              disabled={logs.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Logs
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Actions</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Calendar className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.today}</p>
                <p className="text-sm text-muted-foreground">Today</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.deletes}</p>
                <p className="text-sm text-muted-foreground">Deletions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg border overflow-hidden">
          {/* Main search row */}
          <div className="p-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, email, or resource..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
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
                      <User className="h-3 w-3" />
                      User
                    </label>
                    <SearchableSelect
                      options={userOptions}
                      value={userFilter}
                      onValueChange={setUserFilter}
                      placeholder="All Users"
                      searchPlaceholder="Search user..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Activity className="h-3 w-3" />
                      Module
                    </label>
                    <SearchableSelect
                      options={moduleOptions}
                      value={moduleFilter}
                      onValueChange={setModuleFilter}
                      placeholder="All Modules"
                      searchPlaceholder="Search module..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Activity className="h-3 w-3" />
                      Action
                    </label>
                    <SearchableSelect
                      options={actionOptions}
                      value={actionFilter}
                      onValueChange={setActionFilter}
                      placeholder="All Actions"
                      searchPlaceholder="Search action..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="ghost"
                      onClick={clearFilters}
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
                Showing {filteredLogs.length} of {logs.length} entries
              </p>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border overflow-hidden">
          {isLoading ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-36" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-8 rounded ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : paginatedLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <History className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No audit log entries</h3>
              <p className="text-muted-foreground">
                {hasActiveFilters
                  ? 'Try adjusting your filters'
                  : 'Actions will be recorded here as they occur'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortableTableHead
                      sortKey="timestamp"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    >
                      Timestamp
                    </SortableTableHead>
                    <SortableTableHead
                      sortKey="userName"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    >
                      User
                    </SortableTableHead>
                    <SortableTableHead
                      sortKey="action"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    >
                      Action
                    </SortableTableHead>
                    <SortableTableHead
                      sortKey="module"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    >
                      Module
                    </SortableTableHead>
                    <SortableTableHead
                      sortKey="resourceName"
                      currentSortKey={sortKey}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    >
                      Resource
                    </SortableTableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="text-sm">
                          {format(parseISO(log.timestamp), 'MMM d, yyyy')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(parseISO(log.timestamp), 'h:mm:ss a')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">
                              {(log.userName || 'U').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium">{log.userName || 'Unknown'}</div>
                            <div className="text-xs text-muted-foreground">{log.userRole || 'N/A'}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={ACTION_COLORS[log.action]}>
                          {ACTION_LABELS[log.action]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{MODULE_LABELS[log.module]}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm truncate max-w-[200px] block">
                          {log.resourceName}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedLog(log)}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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
                Showing {startIndex + 1}-{endIndex} of {sortedLogs.length}
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

      {/* Log Details Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Full details of the recorded action
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Timestamp</p>
                  <p className="text-sm">{format(parseISO(selectedLog.timestamp), 'PPpp')}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Action</p>
                  <Badge className={ACTION_COLORS[selectedLog.action]}>
                    {ACTION_LABELS[selectedLog.action]}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">User</p>
                  <p className="text-sm">{selectedLog.userName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Email</p>
                  <p className="text-sm">{selectedLog.userEmail}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Role</p>
                  <Badge variant="outline">{selectedLog.userRole}</Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Module</p>
                  <Badge variant="outline">{MODULE_LABELS[selectedLog.module]}</Badge>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Resource</p>
                <p className="text-sm">{selectedLog.resourceName}</p>
                <p className="text-xs text-muted-foreground">ID: {selectedLog.resourceId}</p>
              </div>
              {selectedLog.changes && selectedLog.changes.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Changes</p>
                  <div className="bg-muted rounded-md p-3 space-y-2">
                    {selectedLog.changes.map((change, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-medium">{change.field}:</span>{' '}
                        <span className="text-red-500 line-through">{String(change.oldValue)}</span>{' '}
                        → <span className="text-green-500">{String(change.newValue)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Metadata</p>
                  <pre className="bg-muted rounded-md p-3 text-xs overflow-auto">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Clear Logs Confirmation Dialog */}
      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear All Audit Logs</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear all {logs.length} audit log entries? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setClearDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearLogs}>
              Clear All Logs
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
