import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User, Clock } from "lucide-react";
import { BlogSearch } from "@/components/BlogSearch";
import { useBlogSearch } from "@/hooks/useBlogSearch";

export default function Blog() {
  const {
    setSearchQuery,
    filteredPosts,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    categories,
  } = useBlogSearch();

  // Get featured post (first post) and other posts
  const featuredPost = filteredPosts[0];
  const displayPosts = filteredPosts.slice(1);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-navy">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-4">
            Insights & <span className="text-gold">Resources</span>
          </h1>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto text-lg mb-8">
            Expert perspectives on accounting, outsourcing best practices, and industry trends.
          </p>
          <BlogSearch onSearch={setSearchQuery} isLoading={isLoading} variant="classic" />
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-secondary border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === selectedCategory
                    ? "bg-accent text-accent-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
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
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full mb-4">
                  {featuredPost.category}
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
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
                <Button variant="gold" size="lg" asChild>
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
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 lg:px-8">
          <h3 className="text-2xl font-serif font-bold text-foreground mb-8">
            {filteredPosts.length === 0 ? "No articles found" : "Latest Articles"}
          </h3>

          {displayPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded mb-3">
                      {post.category}
                    </span>
                    <h4 className="font-serif text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
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
              <p className="text-center text-muted-foreground py-12">
                No articles match your search criteria. Try a different search term or category.
              </p>
            )
          )}

          {displayPosts.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-navy">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-primary-foreground mb-4">
            Stay Updated
          </h3>
          <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">
            Subscribe to our newsletter for the latest insights on accounting outsourcing and
            industry trends.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <Button variant="hero">Subscribe</Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
