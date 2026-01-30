/**
 * Hook for fetching public blog posts from Laravel API with fallback to local data
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useApiConfigStore } from '@/stores/apiConfigStore';
import { useBlogPostsStore } from '@/stores/blogPostsStore';
import { BlogPost, allPosts as staticPosts, authors } from '@/data/blogData';
import { 
  fetchPublicBlogPosts, 
  fetchPublicBlogPost,
  convertApiBlogToFrontend,
  BlogFilters,
  PublicBlogResponse,
  PublicBlogPost
} from '@/services/publicApi';

interface UsePublicBlogResult {
  posts: BlogPost[];
  featuredPost: BlogPost | null;
  isLoading: boolean;
  error: string | null;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
  };
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
}

// Helper to extract string value from category (can be string or object)
function getCategoryName(category: string | { name: string } | null | undefined): string {
  if (!category) return 'Uncategorized';
  if (typeof category === 'string') return category;
  if (typeof category === 'object' && 'name' in category) return category.name;
  return 'Uncategorized';
}

// Helper to extract author name (can be string or object)
function getAuthorName(author: string | { name: string } | null | undefined): string {
  if (!author) return 'Unknown';
  if (typeof author === 'string') return author;
  if (typeof author === 'object' && 'name' in author) return author.name;
  return 'Unknown';
}

// Convert admin blog post to public format
function convertAdminToPublic(post: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string | { name: string };
  author: string | { name: string };
  image_url: string;
  published_at: string | null;
  created_at: string;
}): BlogPost {
  const authorName = getAuthorName(post.author);
  const authorData = authors[authorName] || {
    name: authorName,
    role: 'Contributor',
    bio: '',
    avatar: '/placeholder.svg',
  };

  const wordCount = post.content.split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date(post.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  return {
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    image: post.image_url || '/placeholder.svg',
    author: authorData,
    date,
    readTime,
    category: getCategoryName(post.category),
    slug: post.slug,
  };
}

export function usePublicBlog(postsPerPage: number = 9): UsePublicBlogResult {
  const { isLiveMode } = useApiConfigStore();
  const { posts: adminPosts, fetchPosts } = useBlogPostsStore();
  
  const [apiPosts, setApiPosts] = useState<BlogPost[]>([]);
  const [apiCategories, setApiCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (isLiveMode()) {
      // Live mode: fetch from API
      try {
        const filters: BlogFilters = {
          page: currentPage,
          per_page: postsPerPage,
        };
        if (searchQuery) filters.search = searchQuery;
        if (selectedCategory !== 'All') filters.category = selectedCategory;

        const response = await fetchPublicBlogPosts(filters);
        const convertedPosts = response.data.map(convertApiBlogToFrontend);
        setApiPosts(convertedPosts);
        
        // Extract categories from filters
        if (response.filters?.categories) {
          const cats = ['All', ...response.filters.categories.map(c => c.name)];
          setApiCategories(cats);
        }
        
        setPagination({
          currentPage: response.meta.current_page,
          totalPages: response.meta.last_page,
          total: response.meta.total,
        });
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch blog from API, falling back to local:', err);
        setError('Failed to load posts from server. Showing cached data.');
        // Fallback to local store
        await fetchPosts();
      }
    } else {
      // Demo mode: use local store
      await fetchPosts();
    }

    setIsLoading(false);
  }, [isLiveMode, currentPage, searchQuery, selectedCategory, postsPerPage, fetchPosts]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Get posts from appropriate source
  const allLocalPosts = useMemo(() => {
    // Get published posts from admin store
    const publishedAdminPosts = adminPosts
      .filter(post => post.is_published)
      .map(convertAdminToPublic);

    // Get slugs of admin posts to avoid duplicates
    const adminSlugs = new Set(publishedAdminPosts.map(p => p.slug));

    // Filter out static posts that have the same slug as admin posts
    const filteredStaticPosts = staticPosts.filter(post => !adminSlugs.has(post.slug));

    // Combine and sort by date (newest first)
    return [...publishedAdminPosts, ...filteredStaticPosts].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  }, [adminPosts]);

  // Filter local posts
  const filteredLocalPosts = useMemo(() => {
    let results = allLocalPosts;

    if (selectedCategory !== 'All') {
      results = results.filter(post => post.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query)
      );
    }

    return results;
  }, [allLocalPosts, selectedCategory, searchQuery]);

  // Get categories from local posts
  const localCategories = useMemo(() => {
    const cats = new Set(allLocalPosts.map(post => post.category));
    return ['All', ...Array.from(cats).sort()];
  }, [allLocalPosts]);

  // Determine which data to use
  const posts = useMemo(() => {
    if (isLiveMode() && apiPosts.length > 0) {
      return apiPosts;
    }
    
    // Paginate local posts
    const start = (currentPage - 1) * postsPerPage;
    return filteredLocalPosts.slice(start, start + postsPerPage);
  }, [isLiveMode, apiPosts, filteredLocalPosts, currentPage, postsPerPage]);

  const categories = isLiveMode() && apiCategories.length > 0 ? apiCategories : localCategories;

  const finalPagination = useMemo(() => {
    if (isLiveMode() && apiPosts.length > 0) {
      return pagination;
    }
    
    return {
      currentPage,
      totalPages: Math.ceil(filteredLocalPosts.length / postsPerPage),
      total: filteredLocalPosts.length,
    };
  }, [isLiveMode, apiPosts, pagination, currentPage, filteredLocalPosts.length, postsPerPage]);

  // Get featured post (first post)
  const featuredPost = posts.length > 0 ? posts[0] : null;

  return {
    posts,
    featuredPost,
    isLoading,
    error,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    pagination: finalPagination,
    setPage: setCurrentPage,
    refetch: fetchData,
  };
}

// Hook to get a single blog post by slug
export function usePublicBlogPost(slug: string | undefined): {
  post: BlogPost | null;
  relatedPosts: BlogPost[];
  isLoading: boolean;
  error: string | null;
} {
  const { isLiveMode } = useApiConfigStore();
  const { posts: adminPosts } = useBlogPostsStore();
  
  const [apiPost, setApiPost] = useState<BlogPost | null>(null);
  const [apiRelated, setApiRelated] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if local/static data exists for this slug
  const hasLocalData = useMemo(() => {
    if (!slug) return false;
    const adminPost = adminPosts.find(p => p.slug === slug && p.is_published);
    if (adminPost) return true;
    return staticPosts.some(p => p.slug === slug);
  }, [slug, adminPosts]);

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

// Update the fetchData function in usePublicBlogPost:
const fetchData = async () => {
  setIsLoading(true);
  setError(null);

  if (isLiveMode()) {
    try {
      const response = await fetchPublicBlogPost(slug);

      // Convert the API response to match our frontend format
      // First, normalize the data to match what convertAdminToPublic expects
      // Use any cast since API may return extra fields
      const apiPost = response.post as any;
      const normalizedPost = {
        title: apiPost.title,
        slug: apiPost.slug,
        excerpt: apiPost.excerpt,
        content: apiPost.content,
        category: apiPost.category,
        author: apiPost.author,
        image_url: apiPost.image_url || apiPost.featured_image || apiPost.image,
        published_at: apiPost.published_at,
        created_at: apiPost.created_at || apiPost.published_at,
      };
      
      const normalizedRelated = response.related_posts.map((p: any) => ({
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content,
        category: p.category,
        author: p.author,
        image_url: p.image_url || p.featured_image || p.image,
        published_at: p.published_at,
        created_at: p.created_at || p.published_at,
      }));
      
      setApiPost(convertAdminToPublic(normalizedPost));
      setApiRelated(normalizedRelated.map(convertAdminToPublic));
      setError(null);
    } catch (err) {
      console.error('Failed to fetch post from API:', err);
      
      // Only set error if no local fallback is available
      if (!hasLocalData) {
        setError('Post not found.');
      }
      // Clear API data so it falls back to local
      setApiPost(null);
      setApiRelated([]);
    }
  }

  setIsLoading(false);
};

    fetchData();
  }, [slug, isLiveMode, hasLocalData]);

  // Fallback to local data
  const localPost = useMemo(() => {
    if (!slug) return null;

    // Check admin posts first
    const adminPost = adminPosts.find(p => p.slug === slug && p.is_published);
    if (adminPost) {
      return convertAdminToPublic(adminPost);
    }

    // Fallback to static posts
    return staticPosts.find(p => p.slug === slug) || null;
  }, [slug, adminPosts]);

  const localRelated = useMemo(() => {
    if (!localPost) return [];

    const publishedAdminPosts = adminPosts
      .filter(post => post.is_published)
      .map(convertAdminToPublic);

    const adminSlugs = new Set(publishedAdminPosts.map(p => p.slug));
    const filteredStaticPosts = staticPosts.filter(post => !adminSlugs.has(post.slug));
    const allPosts = [...publishedAdminPosts, ...filteredStaticPosts];

    return allPosts
      .filter(p => p.slug !== slug && p.category === localPost.category)
      .slice(0, 3);
  }, [localPost, slug, adminPosts]);

  // Use API data if available, otherwise local
  const post = isLiveMode() && apiPost ? apiPost : localPost;
  const relatedPosts = isLiveMode() && apiRelated.length > 0 ? apiRelated : localRelated;

  return {
    post,
    relatedPosts,
    isLoading,
    error,
  };
}
