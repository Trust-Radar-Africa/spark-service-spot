import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import BlogPostEditor from '@/components/admin/BlogPostEditor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { useBlogPostsStore, BlogPostData } from '@/stores/blogPostsStore';
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
  const { posts, addPost, updatePost, deletePost, togglePublish } = useBlogPostsStore();
  const { toast } = useToast();
  const { sortKey, sortDirection, handleSort, sortData } = useSorting<BlogPostData>();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<ItemsPerPageOption>(getStoredItemsPerPage);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPostData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleItemsPerPageChange = (value: ItemsPerPageOption) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    localStorage.setItem('admin-blog-items-per-page', String(value));
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter]);

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

  // Get unique categories
  const categories = [...new Set(posts.map((p) => p.category))].sort();

  // Filter and sort posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && post.is_published) ||
      (statusFilter === 'draft' && !post.is_published);

    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedPosts = sortData(filteredPosts);

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
      toast({
        title: 'Post updated',
        description: `"${data.title}" has been updated successfully.`,
      });
    } else {
      addPost(data as Omit<BlogPostData, 'id' | 'created_at' | 'updated_at'>);
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
    if (postToDelete) {
      deletePost(postToDelete.id);
      toast({
        title: 'Post deleted',
        description: `"${postToDelete.title}" has been deleted.`,
      });
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const handleTogglePublish = (post: BlogPostData) => {
    togglePublish(post.id);
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
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground" asChild>
                <Link to="/blog" target="_blank">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Page
                </Link>
              </Button>
            </div>
            <p className="text-muted-foreground">Create and manage blog posts</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExportCSV} variant="outline" disabled={filteredPosts.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
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

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-card rounded-lg border">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts by title, excerpt, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Drafts</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Posts Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableTableHead
                    sortKey="title"
                    currentSortKey={sortKey}
                    currentSortDirection={sortDirection}
                    onSort={handleSort}
                    className="w-[40%]"
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
                {paginatedPosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No posts found</p>
                        <Button variant="outline" size="sm" onClick={handleCreateNew}>
                          Create your first post
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPosts.map((post) => (
                    <TableRow key={post.id}>
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
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleTogglePublish(post)}
                            title={post.is_published ? 'Unpublish' : 'Publish'}
                          >
                            {post.is_published ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(post)}
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
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
      </div>
    </AdminLayout>
  );
}
