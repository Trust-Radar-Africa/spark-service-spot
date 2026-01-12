import { useParams, Link, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share2,
  Linkedin,
  Twitter,
  Facebook,
} from "lucide-react";
import { useGetPostBySlug, useGetRelatedPosts } from "@/hooks/useBlogSearch";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = useGetPostBySlug(slug);
  const relatedPosts = useGetRelatedPosts(slug, 3);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-8 bg-gradient-navy">
        <div className="container mx-auto px-4 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center text-primary-foreground/70 hover:text-gold transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-sm font-medium rounded-full mb-4">
            {post.category}
          </span>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary-foreground mb-6 max-w-4xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-primary-foreground/70">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author.name}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="bg-background">
        <div className="container mx-auto px-4 lg:px-8 -mt-4">
          <div className="aspect-[21/9] rounded-2xl overflow-hidden shadow-xl max-w-5xl mx-auto">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
            {/* Main Content */}
            <article className="lg:col-span-8">
              <div
                className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-accent hover:prose-a:text-accent/80 prose-ul:text-muted-foreground prose-li:marker:text-accent"
                dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
              />

              {/* Share Section */}
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Share2 className="w-4 h-4" />
                    Share this article:
                  </span>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground transition-colors">
                      <Twitter className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground transition-colors">
                      <Facebook className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              {/* Author Bio */}
              <div className="bg-card rounded-xl p-6 shadow-card mb-8">
                <h3 className="font-serif text-lg font-bold text-foreground mb-4">
                  About the Author
                </h3>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{post.author.name}</h4>
                    <p className="text-sm text-accent mb-2">{post.author.role}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                  {post.author.bio}
                </p>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-navy rounded-xl p-6 mb-8">
                <h3 className="font-serif text-lg font-bold text-primary-foreground mb-2">
                  Stay Updated
                </h3>
                <p className="text-sm text-primary-foreground/70 mb-4">
                  Get the latest insights delivered to your inbox.
                </p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold mb-3 text-sm"
                />
                <Button variant="gold" className="w-full">
                  Subscribe
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4 lg:px-8">
            <h3 className="text-2xl font-serif font-bold text-foreground mb-8">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  to={`/blog/${relatedPost.slug}`}
                  className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded mb-3">
                      {relatedPost.category}
                    </span>
                    <h4 className="font-serif text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h4>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1" />
                      {relatedPost.date}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-navy">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-primary-foreground mb-4">
            Ready to Transform Your Practice?
          </h3>
          <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">
            Discover how our offshore accounting services can help you grow while reducing costs.
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}

function formatContent(content: string): string {
  return content
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    .replace(/^# (.*$)/gm, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/- \[ \] (.*)/g, "<li><input type=\"checkbox\" disabled /> $1</li>")
    .replace(/^- (.*$)/gm, "<li>$1</li>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, "</p><p>")
    .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
    .replace(/<\/ul>\s*<ul>/g, "");
}
