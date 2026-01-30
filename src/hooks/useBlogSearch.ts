import { useState, useCallback, useMemo } from "react";
import { BlogPost, allPosts as staticPosts, authors } from "@/data/blogData";
import { useBlogPostsStore, BlogPostData } from "@/stores/blogPostsStore";

// Configuration for Laravel API connection
const LARAVEL_API_URL = import.meta.env.VITE_LARAVEL_API_URL || "";

interface UseBlogSearchResult {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredPosts: BlogPost[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
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

// Convert admin blog post to public blog post format
function convertToPublicPost(post: BlogPostData): BlogPost {
  const authorName = getAuthorName(post.author);
  const authorData = authors[authorName] || {
    name: authorName,
    role: "Contributor",
    bio: "",
    avatar: "/placeholder.svg",
  };

  // Calculate read time based on content length
  const wordCount = post.content.split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  // Format date
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date(post.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  return {
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    image: post.image_url || "/placeholder.svg",
    author: authorData,
    date,
    readTime,
    category: getCategoryName(post.category),
    slug: post.slug,
  };
}

// Local search function
function searchPostsLocally(posts: BlogPost[], query: string, category: string): BlogPost[] {
  let results = posts;

  // Filter by category
  if (category && category !== "All") {
    results = results.filter((post) => post.category === category);
  }

  // Filter by search query
  if (query.trim()) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        post.content.toLowerCase().includes(lowerQuery) ||
        post.author.name.toLowerCase().includes(lowerQuery) ||
        post.category.toLowerCase().includes(lowerQuery)
    );
  }

  return results;
}

// Laravel API search function
async function searchPostsFromAPI(query: string, category: string): Promise<BlogPost[]> {
  const params = new URLSearchParams();
  if (query) params.append("q", query);
  if (category && category !== "All") params.append("category", category);

  const response = await fetch(`${LARAVEL_API_URL}/api/blog/search?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to search posts");
  }

  const data = await response.json();
  return data.posts || data.data || data;
}

export function useBlogSearch(): UseBlogSearchResult {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiResults, setApiResults] = useState<BlogPost[] | null>(null);

  // Get posts from the admin store
  const { posts: adminPosts } = useBlogPostsStore();

  // Use Laravel API if configured, otherwise use local search
  const useLaravelAPI = Boolean(LARAVEL_API_URL);

  // Merge admin published posts with static posts (admin posts take priority)
  const allPosts = useMemo(() => {
    // Get published posts from admin store
    const publishedAdminPosts = adminPosts
      .filter((post) => post.is_published)
      .map(convertToPublicPost);

    // Get slugs of admin posts to avoid duplicates
    const adminSlugs = new Set(publishedAdminPosts.map((p) => p.slug));

    // Filter out static posts that have the same slug as admin posts
    const filteredStaticPosts = staticPosts.filter((post) => !adminSlugs.has(post.slug));

    // Combine and sort by date (newest first)
    return [...publishedAdminPosts, ...filteredStaticPosts].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  }, [adminPosts]);

  // Get unique categories from all posts
  const categories = useMemo(() => {
    const cats = new Set(allPosts.map((post) => post.category));
    return ["All", ...Array.from(cats).sort()];
  }, [allPosts]);

  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);

      if (useLaravelAPI) {
        setIsLoading(true);
        setError(null);
        try {
          const results = await searchPostsFromAPI(query, selectedCategory);
          setApiResults(results);
        } catch (err) {
          setError("Failed to search. Using local results.");
          setApiResults(null);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [useLaravelAPI, selectedCategory]
  );

  const handleCategoryChange = useCallback(
    async (category: string) => {
      setSelectedCategory(category);

      if (useLaravelAPI) {
        setIsLoading(true);
        setError(null);
        try {
          const results = await searchPostsFromAPI(searchQuery, category);
          setApiResults(results);
        } catch (err) {
          setError("Failed to filter. Using local results.");
          setApiResults(null);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [useLaravelAPI, searchQuery]
  );

  // Compute filtered posts
  const filteredPosts = useMemo(() => {
    if (useLaravelAPI && apiResults !== null) {
      return apiResults;
    }
    return searchPostsLocally(allPosts, searchQuery, selectedCategory);
  }, [useLaravelAPI, apiResults, allPosts, searchQuery, selectedCategory]);

  return {
    searchQuery,
    setSearchQuery: handleSearch,
    filteredPosts,
    isLoading,
    error,
    selectedCategory,
    setSelectedCategory: handleCategoryChange,
    categories,
  };
}

// Export a function to get a post by slug (for individual post pages)
export function useGetPostBySlug(slug: string | undefined): BlogPost | undefined {
  const { posts: adminPosts } = useBlogPostsStore();

  return useMemo(() => {
    if (!slug) return undefined;

    // First, check admin posts
    const adminPost = adminPosts.find((p) => p.slug === slug && p.is_published);
    if (adminPost) {
      return convertToPublicPost(adminPost);
    }

    // Fallback to static posts
    return staticPosts.find((p) => p.slug === slug);
  }, [slug, adminPosts]);
}

// Export a function to get related posts
export function useGetRelatedPosts(slug: string | undefined, count: number = 3): BlogPost[] {
  const { posts: adminPosts } = useBlogPostsStore();

  return useMemo(() => {
    if (!slug) return [];

    // Build all posts list
    const publishedAdminPosts = adminPosts
      .filter((post) => post.is_published)
      .map(convertToPublicPost);

    const adminSlugs = new Set(publishedAdminPosts.map((p) => p.slug));
    const filteredStaticPosts = staticPosts.filter((post) => !adminSlugs.has(post.slug));
    const allPosts = [...publishedAdminPosts, ...filteredStaticPosts];

    // Find current post
    const currentPost = allPosts.find((p) => p.slug === slug);
    if (!currentPost) return [];

    // Find related posts (same category, excluding current)
    const relatedByCategory = allPosts.filter(
      (p) => p.slug !== slug && p.category === currentPost.category
    );

    // If not enough related posts, add others
    const otherPosts = allPosts.filter(
      (p) => p.slug !== slug && p.category !== currentPost.category
    );

    return [...relatedByCategory, ...otherPosts].slice(0, count);
  }, [slug, count, adminPosts]);
}
