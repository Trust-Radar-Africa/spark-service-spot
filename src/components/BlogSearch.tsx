import { useState, useEffect, useCallback } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BlogPost } from "@/data/blogData";

interface BlogSearchProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  variant?: "classic" | "modern";
}

export function BlogSearch({ onSearch, isLoading = false, variant = "classic" }: BlogSearchProps) {
  const [query, setQuery] = useState("");
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  if (variant === "modern") {
    return (
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-qx-gray" />
        <Input
          type="text"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 pr-12 py-6 rounded-full bg-white border-gray-200 text-qx-blue placeholder:text-qx-gray focus:ring-qx-orange"
        />
        {isLoading ? (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-qx-gray animate-spin" />
        ) : query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-qx-light-gray transition-colors"
          >
            <X className="w-4 h-4 text-qx-gray" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative max-w-md mx-auto">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search articles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-12 pr-12 py-6 rounded-lg bg-card border-border text-foreground placeholder:text-muted-foreground focus:ring-accent"
      />
      {isLoading ? (
        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />
      ) : query && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
