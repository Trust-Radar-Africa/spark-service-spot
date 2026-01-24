import { useState, useEffect, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import BlogPostEditor from '@/components/admin/BlogPostEditor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
  Collapsible,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { useBlogPostsStore, BlogPostData } from '@/stores/blogPostsStore';
import { useApiConfigStore } from '@/stores/apiConfigStore';
import {
  FileText,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  User,
  Tag,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  Clock,
  Download,
  SlidersHorizontal,
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
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
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { useAuditLogger } from '@/stores/auditLogStore';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { ApiErrorState } from '@/components/admin/ApiErrorState';
import { TableLoadingSkeleton, CardsLoadingSkeleton } from '@/components/admin/LoadingState';
import { NoDataState, NoResultsState } from '@/components/admin/EmptyState';

const getStoredItemsPerPage = (): ItemsPerPageOption => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('admin-blog-items-per-page');
    if (stored && [5, 10, 25, 50].includes(Number(stored))) {
      return Number(stored) as ItemsPerPageOption;
    }
  }
  return 5;
};

export default function BlogManagementPage() {
  const { posts, addPost, updatePost, deletePost, togglePublish, fetchPosts, isLoading, error } = useBlogPostsStore();
  const { isLiveMode } = useApiConfigStore();
  const { toast } = useToast();
  const { sortKey, sortDirection, handleSort, sortData } = useSorting<BlogPostData>();
  const { canDelete, canCreate, canUpdate, isViewer } = useAdminPermissions();
  const { user } = useAdminAuth();
  const { logAction } = useAuditLogger();

  // Fetch blog posts from API on mount when in live mode
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<ItemsPerPageOption>(getStoredItemsPerPage);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPostData | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const hasActiveFilters = !!(searchTerm || statusFilter || categoryFilter || authorFilter);
  const activeFilterCount = [statusFilter, categoryFilter, authorFilter].filter(Boolean).length;

  const handleItemsPerPageChange = (value: ItemsPerPageOption) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    localStorage.setItem('admin-blog-items-per-page', String(value));
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter, authorFilter]);

  // Handle CSV export
  const handleExportCSV = () => {
    exportToCSV(filteredPosts, 'blog_posts', [
      { key: 'title', header: 'Title' },
      { key: 'author', header: 'Author' },
      { key: 'category', header: 'Category' },
      { key: 'is_published', header: 'Published' },
      { key: 'created_at', header: 'Created Date' },
    ]);
    toast({
      title: 'Export successful',
      description: `Exported ${filteredPosts.length} posts to CSV.`,
    });
  };

  // Get unique categories for filter
  const categoryOptions: SearchableSelectOption[] = useMemo(() => {
    const uniqueCategories = [...new Set(posts.map((p) => p.category))].sort();
    return uniqueCategories.map((c) => ({ value: c, label: c }));
  }, [posts]);

  // Get unique authors for filter
  const authorOptions: SearchableSelectOption[] = useMemo(() => {
    const uniqueAuthors = [...new Set(posts.map((p) => p.author))].sort();
    return uniqueAuthors.map((a) => ({ value: a, label: a }));
  }, [posts]);

  // Status options
  const statusOptions: SearchableSelectOption[] = [
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Drafts' },
  ];

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        searchTerm === '' ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        !statusFilter ||
        (statusFilter === 'published' && post.is_published) ||
        (statusFilter === 'draft' && !post.is_published);

      const matchesCategory = !categoryFilter || post.category === categoryFilter;
      const matchesAuthor = !authorFilter || post.author === authorFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesAuthor;
    });
  }, [posts, searchTerm, statusFilter, categoryFilter, authorFilter]);

  const sortedPosts = sortData(filteredPosts);

  // Bulk selection
  const {
    selectedItems,
    selectedCount,
    toggleItem,
    selectAll,
    clearSelection,
    isSelected,
    allSelected,
  } = useBulkSelection(sortedPosts);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedPosts.length / itemsPerPage));
  const validCurrentPage = currentPage > totalPages ? 1 : currentPage;
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedPosts.length);
  const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

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

  const handleCreateNew = () => {
    setEditingPost(null);
    setIsEditing(true);
  };

  const handleEdit = (post: BlogPostData) => {
    setEditingPost(post);
    setIsEditing(true);
  };

  const handleSave = async (data: Partial<BlogPostData>) => {
    setIsSaving(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (editingPost) {
      updatePost(editingPost.id, data);
      // Log update action
      if (user) {
        logAction(
          'update',
          'blog',
          editingPost.id,
          data.title || editingPost.title,
          { id: String(user.id), name: user.name, email: user.email, role: user.role || 'super_admin' }
        );
      }
      toast({
        title: 'Post updated',
        description: `"${data.title}" has been updated successfully.`,
      });
    } else {
      addPost(data as Omit<BlogPostData, 'id' | 'created_at' | 'updated_at'>);
      // Log create action
      if (user) {
        logAction(
          'create',
          'blog',
          'new',
          data.title || 'Untitled',
          { id: String(user.id), name: user.name, email: user.email, role: user.role || 'super_admin' }
        );
      }
      toast({
        title: 'Post created',
        description: `"${data.title}" has been created successfully.`,
      });
    }

    setIsSaving(false);
    setIsEditing(false);
    setEditingPost(null);
  };

  const handleDelete = () => {
    if (!postToDelete) return;
    if (!canDelete('blog')) {
      toast({
        title: 'Permission denied',
        description: 'You do not have permission to delete blog posts.',
        variant: 'destructive',
      });
      return;
    }
    
    deletePost(postToDelete.id);
    // Log delete action
    if (user) {
      logAction(
        'delete',
        'blog',
        postToDelete.id,
        postToDelete.title,
        { id: String(user.id), name: user.name, email: user.email, role: user.role || 'super_admin' }
      );
    }
    toast({
      title: 'Post deleted',
      description: `"${postToDelete.title}" has been deleted.`,
    });
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  const handleBulkDelete = () => {
    if (!canDelete('blog')) {
      toast({
        title: 'Permission denied',
        description: 'You do not have permission to delete blog posts.',
        variant: 'destructive',
      });
      return;
    }

    for (const item of selectedItems) {
      deletePost(item.id);
      if (user) {
        logAction(
          'delete',
          'blog',
          item.id,
          item.title,
          { id: String(user.id), name: user.name, email: user.email, role: user.role || 'super_admin' }
        );
      }
    }
    toast({
      title: 'Posts deleted',
      description: `Deleted ${selectedCount} blog posts.`,
    });
    clearSelection();
    setBulkDeleteOpen(false);
  };

  const handleBulkExport = () => {
    exportToCSV(selectedItems, 'blog_posts_selected', [
      { key: 'title', header: 'Title' },
      { key: 'author', header: 'Author' },
      { key: 'category', header: 'Category' },
      { key: 'is_published', header: 'Published' },
      { key: 'created_at', header: 'Created Date' },
    ]);
    toast({
      title: 'Export successful',
      description: `Exported ${selectedCount} posts to CSV.`,
    });
  };

  const handleTogglePublish = (post: BlogPostData) => {
    togglePublish(post.id);
    // Log publish/unpublish action
    if (user) {
      logAction(
        post.is_published ? 'unpublish' : 'publish',
        'blog',
        post.id,
        post.title,
        { id: String(user.id), name: user.name, email: user.email, role: user.role || 'super_admin' }
      );
    }
    toast({
      title: post.is_published ? 'Post unpublished' : 'Post published',
      description: `"${post.title}" is now ${post.is_published ? 'a draft' : 'published'}.`,
    });
  };

  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.is_published).length,
    drafts: posts.filter((p) => !p.is_published).length,
  };

  if (isEditing) {
    return (
      <AdminLayout>
        <BlogPostEditor
          post={editingPost}
          onSave={handleSave}
          onCancel={() => {
            setIsEditing(false);
            setEditingPost(null);
          }}
          isSaving={isSaving}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Blog Management</h1>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" asChild title="View Page">
                <Link to="/blog" target="_blank">
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
            <p className="text-muted-foreground">Create and manage blog posts</p>
          </div>
          <div className="flex gap-2">
            {canCreate('blog') && (
              <Button onClick={handleCreateNew}>
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Posts</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.published}</p>
                <p className="text-sm text-muted-foreground">Published</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.drafts}</p>
                <p className="text-sm text-muted-foreground">Drafts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        <BulkActionsBar
          selectedCount={selectedCount}
          totalCount={filteredPosts.length}
          onSelectAll={selectAll}
          allSelected={allSelected}
          onDelete={canDelete('blog') ? () => setBulkDeleteOpen(true) : undefined}
          onExport={handleBulkExport}
          onClearSelection={clearSelection}
        />

        {/* Filters */}
        <div className="bg-card rounded-lg border overflow-hidden">
          {/* Main search row */}
          <div className="p-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts by title, excerpt, or author..."
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <User className="h-3 w-3" />
                      Author
                    </label>
                    <SearchableSelect
                      options={authorOptions}
                      value={authorFilter}
                      onValueChange={setAuthorFilter}
                      placeholder="All Authors"
                      searchPlaceholder="Search author..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Eye className="h-3 w-3" />
                      Status
                    </label>
                    <SearchableSelect
                      options={statusOptions}
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                      placeholder="All Status"
                      searchPlaceholder="Search status..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Tag className="h-3 w-3" />
                      Category
                    </label>
                    <SearchableSelect
                      options={categoryOptions}
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                      placeholder="All Categories"
                      searchPlaceholder="Search category..."
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSearchTerm('');
                        setAuthorFilter('');
                        setStatusFilter('');
                        setCategoryFilter('');
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
            <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {filteredPosts.length} of {posts.length} posts
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setAuthorFilter('');
                  setStatusFilter('');
                  setCategoryFilter('');
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>

        {/* Posts Table */}
        <Card>
          <CardContent className="p-0">
            {error ? (
              <ApiErrorState
                title="Failed to load blog posts"
                message={error}
                onRetry={fetchPosts}
              />
            ) : isLoading ? (
              <div className="p-4">
                <TableLoadingSkeleton rows={5} columns={6} />
              </div>
            ) : posts.length === 0 ? (
              <NoDataState entityName="blog posts" onRefresh={fetchPosts} />
            ) : paginatedPosts.length === 0 ? (
              <NoResultsState onClearFilters={() => {
                setSearchTerm('');
                setAuthorFilter('');
                setStatusFilter('');
                setCategoryFilter('');
              }} />
            ) : (
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
                    sortKey="title"
                    currentSortKey={sortKey}
                    currentSortDirection={sortDirection}
                    onSort={handleSort}
                    className="w-[35%]"
                  >
                    Post
                  </SortableTableHead>
                  <SortableTableHead
                    sortKey="category"
                    currentSortKey={sortKey}
                    currentSortDirection={sortDirection}
                    onSort={handleSort}
                  >
                    Category
                  </SortableTableHead>
                  <SortableTableHead
                    sortKey="author"
                    currentSortKey={sortKey}
                    currentSortDirection={sortDirection}
                    onSort={handleSort}
                  >
                    Author
                  </SortableTableHead>
                  <SortableTableHead
                    sortKey="is_published"
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
                    Date
                  </SortableTableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPosts.map((post) => (
                    <TableRow key={post.id} className={isSelected(post.id) ? 'bg-muted/50' : ''}>
                      <TableCell>
                        <Checkbox
                          checked={isSelected(post.id)}
                          onCheckedChange={() => toggleItem(post.id)}
                          aria-label={`Select ${post.title}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium line-clamp-1">{post.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {post.excerpt}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          <Tag className="w-3 h-3" />
                          {post.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <User className="w-3 h-3 text-muted-foreground" />
                          {post.author}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={post.is_published ? 'default' : 'secondary'}
                          className={post.is_published ? 'bg-green-600' : ''}
                        >
                          {post.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(post.created_at), 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {canUpdate('blog') && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleTogglePublish(post)}
                              title={post.is_published ? 'Unpublish' : 'Publish'}
                              disabled={isViewer}
                            >
                              {post.is_published ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                          )}
                          {canUpdate('blog') && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(post)}
                              title="Edit"
                              disabled={isViewer}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                          {canDelete('blog') && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setPostToDelete(post);
                                setDeleteDialogOpen(true);
                              }}
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            )}

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{endIndex} of {sortedPosts.length} posts
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
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Post</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{postToDelete?.title}"? This action cannot be
                undone.
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
              <DialogTitle>Delete Selected Posts</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedCount} selected posts? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBulkDeleteOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleBulkDelete}>
                Delete {selectedCount} Posts
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
