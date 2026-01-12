import { useState, useCallback, useMemo } from "react";
import { BlogPost, allPosts } from "@/data/blogData";

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
}

// Local search function (fallback when no Laravel API)
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
      "Accept": "application/json",
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

  // Use Laravel API if configured, otherwise use local search
  const useLaravelAPI = Boolean(LARAVEL_API_URL);

  const handleSearch = useCallback(async (query: string) => {
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
  }, [useLaravelAPI, selectedCategory]);

  const handleCategoryChange = useCallback(async (category: string) => {
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
  }, [useLaravelAPI, searchQuery]);

  // Compute filtered posts
  const filteredPosts = useMemo(() => {
    if (useLaravelAPI && apiResults !== null) {
      return apiResults;
    }
    return searchPostsLocally(allPosts, searchQuery, selectedCategory);
  }, [useLaravelAPI, apiResults, searchQuery, selectedCategory]);

  return {
    searchQuery,
    setSearchQuery: handleSearch,
    filteredPosts,
    isLoading,
    error,
    selectedCategory,
    setSelectedCategory: handleCategoryChange,
  };
}
