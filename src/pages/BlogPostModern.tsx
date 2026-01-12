import { useParams, Link, Navigate } from "react-router-dom";
import { LayoutModern } from "@/components/layout/LayoutModern";
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

export default function BlogPostModern() {
  const { slug } = useParams<{ slug: string }>();
  const post = useGetPostBySlug(slug);
  const relatedPosts = useGetRelatedPosts(slug, 3);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <LayoutModern>
      {/* Hero Section */}
      <section className="pt-28 pb-8 bg-qx-blue">
        <div className="container mx-auto px-4 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center text-white/70 hover:text-qx-orange transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          <span className="inline-block px-3 py-1 bg-qx-orange/20 text-qx-orange text-sm font-medium rounded-full mb-4">
            {post.category}
          </span>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-white mb-6 max-w-4xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
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
      <section className="bg-white">
        <div className="container mx-auto px-4 lg:px-8 -mt-4">
          <div className="aspect-[21/9] rounded-2xl overflow-hidden shadow-xl max-w-5xl mx-auto">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
            {/* Main Content */}
            <article className="lg:col-span-8">
              <div
                className="prose prose-lg max-w-none prose-headings:font-montserrat prose-headings:text-qx-blue prose-p:text-qx-gray prose-strong:text-qx-blue prose-a:text-qx-orange hover:prose-a:text-qx-orange-dark prose-ul:text-qx-gray prose-li:marker:text-qx-orange"
                dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
              />

              {/* Share Section */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2 text-qx-gray">
                    <Share2 className="w-4 h-4" />
                    Share this article:
                  </span>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full bg-qx-light-gray hover:bg-qx-orange hover:text-white transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-full bg-qx-light-gray hover:bg-qx-orange hover:text-white transition-colors">
                      <Twitter className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-full bg-qx-light-gray hover:bg-qx-orange hover:text-white transition-colors">
                      <Facebook className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              {/* Author Bio */}
              <div className="bg-qx-light-gray rounded-xl p-6 mb-8">
                <h3 className="font-montserrat text-lg font-bold text-qx-blue mb-4">
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
                    <h4 className="font-semibold text-qx-blue">{post.author.name}</h4>
                    <p className="text-sm text-qx-orange mb-2">{post.author.role}</p>
                  </div>
                </div>
                <p className="text-sm text-qx-gray mt-4 leading-relaxed">{post.author.bio}</p>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-qx-blue rounded-xl p-6 mb-8">
                <h3 className="font-montserrat text-lg font-bold text-white mb-2">Stay Updated</h3>
                <p className="text-sm text-white/70 mb-4">
                  Get the latest insights delivered to your inbox.
                </p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-qx-orange mb-3 text-sm"
                />
                <Button className="w-full bg-qx-orange hover:bg-qx-orange-dark text-white rounded-full">
                  Subscribe
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-qx-light-gray">
          <div className="container mx-auto px-4 lg:px-8">
            <h3 className="text-2xl font-montserrat font-bold text-qx-blue mb-8">
              Related Articles
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  to={`/blog/${relatedPost.slug}`}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-2 py-1 bg-qx-orange/10 text-qx-orange text-xs font-medium rounded mb-3">
                      {relatedPost.category}
                    </span>
                    <h4 className="font-montserrat text-lg font-bold text-qx-blue mb-2 group-hover:text-qx-orange transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h4>
                    <div className="flex items-center text-xs text-qx-gray">
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
      <section className="py-16 bg-qx-blue">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h3 className="text-2xl md:text-3xl font-montserrat font-bold text-white mb-4">
            Ready to Transform Your Practice?
          </h3>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            Discover how our offshore accounting services can help you grow while reducing costs.
          </p>
          <Button
            className="bg-qx-orange hover:bg-qx-orange-dark text-white rounded-full px-8"
            size="lg"
            asChild
          >
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </LayoutModern>
  );
}

function formatContent(content: string): string {
  return content
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    .replace(/^# (.*$)/gm, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/- \[ \] (.*)/g, '<li><input type="checkbox" disabled /> $1</li>')
    .replace(/^- (.*$)/gm, "<li>$1</li>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, "</p><p>")
    .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
    .replace(/<\/ul>\s*<ul>/g, "");
}
