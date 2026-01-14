import { Link } from "react-router-dom";
import { LayoutModern } from "@/components/layout/LayoutModern";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User, Clock } from "lucide-react";
import { BlogSearch } from "@/components/BlogSearch";
import { useBlogSearch } from "@/hooks/useBlogSearch";
import { usePagination } from "@/hooks/usePagination";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const POSTS_PER_PAGE = 6;

export default function BlogModern() {
  const {
    setSearchQuery,
    filteredPosts,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    categories,
  } = useBlogSearch();

  // Get featured post (first post) and other posts for pagination
  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  const {
    currentPage,
    totalPages,
    paginatedItems: displayPosts,
    goToPage,
    hasNextPage,
    hasPrevPage,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination(remainingPosts, POSTS_PER_PAGE);

  return (
    <LayoutModern>
      {/* Hero Section */}
      <section className="pt-20 pb-10 bg-qx-blue">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white mb-3">
            Insights & <span className="text-qx-orange">Resources</span>
          </h1>
          <p className="text-sm md:text-base text-white/70 max-w-2xl mx-auto mb-6">
            Expert perspectives on accounting, outsourcing best practices, and industry trends.
          </p>
          <BlogSearch onSearch={setSearchQuery} isLoading={isLoading} variant="modern" />
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  category === selectedCategory
                    ? "bg-qx-orange text-white text-filter-selected"
                    : "bg-qx-light-gray text-filter-value text-qx-gray hover:bg-qx-blue/10 hover:text-qx-blue"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-10 md:py-12 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-6 items-center">
              <div className="aspect-[16/10] rounded-xl overflow-hidden shadow-lg">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="inline-block px-2 py-1 bg-qx-orange/10 text-qx-orange text-xs rounded-full mb-3">
                  {featuredPost.category}
                </span>
                <h2 className="text-xl md:text-2xl font-heading font-bold text-qx-blue mb-3">
                  {featuredPost.title}
                </h2>
                <p className="text-body-paragraph text-qx-gray mb-6">{featuredPost.excerpt}</p>
                <div className="flex flex-wrap items-center gap-4 text-job-meta text-qx-gray mb-6">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {featuredPost.author.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </span>
                </div>
                <Button
                  className="bg-qx-orange hover:bg-qx-orange-dark text-white rounded-full px-8"
                  asChild
                >
                  <Link to={`/blog/${featuredPost.slug}`}>
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="py-10 md:py-12 bg-qx-light-gray">
        <div className="container mx-auto px-4 lg:px-8">
          <h3 className="text-xl md:text-2xl font-heading font-bold text-qx-blue mb-2">
            {filteredPosts.length === 0 ? "No articles found" : "Latest Articles"}
          </h3>
          
          {totalItems > 0 && (
            <p className="text-job-meta text-qx-gray mb-8">
              Showing {startIndex}–{endIndex} of {totalItems} articles
            </p>
          )}

          {displayPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-2 py-1 bg-qx-orange/10 text-qx-orange text-filter-label rounded mb-3">
                      {post.category}
                    </span>
                    <h4 className="text-job-title text-qx-blue mb-2 group-hover:text-qx-orange transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-body-paragraph text-qx-gray mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-job-meta text-qx-gray">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            !featuredPost && (
              <p className="text-center text-body-paragraph text-qx-gray py-12">
                No articles match your search criteria. Try a different search term or category.
              </p>
            )
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => hasPrevPage && goToPage(currentPage - 1)}
                      className={!hasPrevPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {/* First page */}
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => goToPage(1)}
                      isActive={currentPage === 1}
                      className="cursor-pointer"
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>

                  {/* Ellipsis after first page */}
                  {currentPage > 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {/* Pages around current */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page !== 1 &&
                        page !== totalPages &&
                        page >= currentPage - 1 &&
                        page <= currentPage + 1
                    )
                    .map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => goToPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                  {/* Ellipsis before last page */}
                  {currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {/* Last page */}
                  {totalPages > 1 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => goToPage(totalPages)}
                        isActive={currentPage === totalPages}
                        className="cursor-pointer"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => hasNextPage && goToPage(currentPage + 1)}
                      className={!hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-10 md:py-12 bg-qx-blue">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h3 className="text-xl md:text-2xl font-heading font-bold text-white mb-3">
            Stay Updated
          </h3>
          <p className="text-sm text-white/70 max-w-xl mx-auto mb-6">
            Subscribe to our newsletter for the latest insights on accounting outsourcing and
            industry trends.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-qx-orange"
            />
            <Button className="bg-qx-orange hover:bg-qx-orange-dark text-white rounded-full px-8">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </LayoutModern>
  );
}
