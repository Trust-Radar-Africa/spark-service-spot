import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User, Clock } from "lucide-react";
import auditImg from "@/assets/audit-service.jpg";
import bookkeepingImg from "@/assets/bookkeeping-service.jpg";
import consultingImg from "@/assets/consulting-service.jpg";
import teamImg from "@/assets/team.jpg";

const featuredPost = {
  title: "The Future of Offshore Accounting: Trends to Watch in 2024",
  excerpt: "Discover how technological advancements and changing business landscapes are reshaping the offshore accounting industry and what it means for your firm.",
  image: teamImg,
  author: "Sarah Mitchell",
  date: "January 10, 2024",
  readTime: "8 min read",
  category: "Industry Insights",
  slug: "future-offshore-accounting-2024",
};

const posts = [
  {
    title: "5 Ways Outsourcing Bookkeeping Can Transform Your Practice",
    excerpt: "Learn how delegating bookkeeping tasks can free up your time for higher-value advisory services.",
    image: bookkeepingImg,
    author: "James Crawford",
    date: "January 5, 2024",
    readTime: "5 min read",
    category: "Best Practices",
    slug: "outsourcing-bookkeeping-benefits",
  },
  {
    title: "Understanding US GAAP vs IFRS: A Comprehensive Guide",
    excerpt: "A detailed comparison of the two major accounting frameworks and when to apply each.",
    image: auditImg,
    author: "Emma Richardson",
    date: "December 28, 2023",
    readTime: "10 min read",
    category: "Technical",
    slug: "us-gaap-vs-ifrs-guide",
  },
  {
    title: "Building a Successful Remote Accounting Team",
    excerpt: "Best practices for managing and collaborating with offshore accounting professionals.",
    image: consultingImg,
    author: "Michael Zhang",
    date: "December 20, 2023",
    readTime: "6 min read",
    category: "Management",
    slug: "remote-accounting-team-success",
  },
  {
    title: "Tax Season Preparation: A Checklist for CPA Firms",
    excerpt: "Essential steps to ensure your firm is ready for the upcoming tax season.",
    image: auditImg,
    author: "David Foster",
    date: "December 15, 2023",
    readTime: "7 min read",
    category: "Tax",
    slug: "tax-season-preparation-checklist",
  },
  {
    title: "The Role of Technology in Modern Accounting Practices",
    excerpt: "How cloud-based solutions and automation are revolutionizing the accounting industry.",
    image: bookkeepingImg,
    author: "Sarah Mitchell",
    date: "December 10, 2023",
    readTime: "6 min read",
    category: "Technology",
    slug: "technology-modern-accounting",
  },
  {
    title: "Ensuring Data Security in Offshore Accounting",
    excerpt: "Best practices and certifications that protect your client data when outsourcing.",
    image: consultingImg,
    author: "James Crawford",
    date: "December 5, 2023",
    readTime: "8 min read",
    category: "Security",
    slug: "data-security-offshore-accounting",
  },
];

const categories = [
  "All",
  "Industry Insights",
  "Best Practices",
  "Technical",
  "Management",
  "Tax",
  "Technology",
  "Security",
];

export default function Blog() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-navy">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-4">
            Insights & <span className="text-gold">Resources</span>
          </h1>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto text-lg">
            Expert perspectives on accounting, outsourcing best practices, and industry trends.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-secondary border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === "All"
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
                  {featuredPost.author}
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
              <Button variant="gold" size="lg">
                Read Article
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 lg:px-8">
          <h3 className="text-2xl font-serif font-bold text-foreground mb-8">
            Latest Articles
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.slug}
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
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-navy">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-primary-foreground mb-4">
            Stay Updated
          </h3>
          <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">
            Subscribe to our newsletter for the latest insights on accounting outsourcing and industry trends.
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
