import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { LayoutModern } from "@/components/layout/LayoutModern";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share2,
  Linkedin,
  Twitter,
  Facebook,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Target,
  Zap,
  BookOpen,
} from "lucide-react";
import { useGetPostBySlug, useGetRelatedPosts } from "@/hooks/useBlogSearch";

function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress();
    
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
      <div 
        className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// Table of Contents items extracted from content
function extractTableOfContents(content: string) {
  const headings: { id: string; title: string; level: number }[] = [];
  const h2Regex = /^## (.+)$/gm;
  const h3Regex = /^### (.+)$/gm;
  
  let match;
  while ((match = h2Regex.exec(content)) !== null) {
    const title = match[1];
    const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    headings.push({ id, title, level: 2 });
  }
  
  return headings;
}

export default function BlogPostModern() {
  const { slug } = useParams<{ slug: string }>();
  const post = useGetPostBySlug(slug);
  const relatedPosts = useGetRelatedPosts(slug, 3);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]');
      let current = "";
      
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < 200) {
          current = section.getAttribute('data-section') || "";
        }
      });
      
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const tableOfContents = extractTableOfContents(post.content);

  return (
    <LayoutModern>
      <ReadingProgressBar />
      
      {/* Hero Section with Full-Width Image */}
      <section className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
        {/* Background Image */}
        <img 
          src={post.image} 
          alt={post.title} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-24 left-4 lg:left-8 z-10">
          <Link
            to="/blog"
            className="inline-flex items-center text-white/80 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-24 right-4 lg:right-8 z-10">
          <span className="inline-block px-4 py-1.5 bg-qx-blue text-white text-sm font-medium rounded-full">
            {post.category}
          </span>
        </div>
        
        {/* Title and Meta */}
        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-8">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl">
              {post.title}
            </h1>
            
            {/* Meta Information Bar */}
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white/30">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{post.author.name}</span>
              </div>
              <span className="hidden sm:inline text-white/50">•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span className="hidden sm:inline text-white/50">•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
            
            {/* Article Content */}
            <article className="lg:col-span-8">
              {/* Lead Paragraph */}
              <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed mb-12">
                {post.excerpt}
              </p>
              
              {/* Main Content */}
              <div className="space-y-12">
                {renderFormattedContent(post.content)}
              </div>

              {/* Article Footer */}
              <div className="mt-16 pt-8 border-t border-border">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  {/* Author Card */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={post.author.avatar} alt={post.author.name} />
                      <AvatarFallback className="text-lg">{post.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-foreground text-lg">{post.author.name}</p>
                      <p className="text-muted-foreground">{post.author.role}</p>
                    </div>
                  </div>
                  
                  {/* Share Buttons */}
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-sm font-medium flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Share this article:
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        className="hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <a 
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Share on LinkedIn"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        className="hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <a 
                          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Share on Twitter"
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        className="hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <a 
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Share on Facebook"
                        >
                          <Facebook className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Table of Contents */}
                {tableOfContents.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Table of Contents
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <nav className="space-y-2">
                        {tableOfContents.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              const element = document.getElementById(item.id);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }}
                            className={`block w-full text-left text-sm py-1.5 px-3 rounded-md transition-colors ${
                              activeSection === item.id
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            }`}
                          >
                            {item.title}
                          </button>
                        ))}
                      </nav>
                    </CardContent>
                  </Card>
                )}

                {/* Newsletter Signup */}
                <Card className="bg-qx-blue text-white border-0">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">Stay Updated</CardTitle>
                    <CardDescription className="text-white/80">
                      Get the latest insights delivered to your inbox weekly.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:ring-white/30"
                    />
                    <Button 
                      className="w-full bg-qx-orange text-white hover:bg-qx-orange/90"
                    >
                      Subscribe
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Author Bio Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">About the Author</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">{post.author.name}</p>
                        <p className="text-sm text-primary mb-2">{post.author.role}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{post.author.bio}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              Related Articles
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  to={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-6">
                      <span className="inline-block px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-3">
                        {relatedPost.category}
                      </span>
                      <h4 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        {relatedPost.date}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-qx-blue">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Transform Your Practice?
          </h3>
          <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
            Discover how our offshore accounting services can help you grow while reducing costs.
          </p>
          <Button
            size="lg"
            className="bg-qx-orange text-white hover:bg-qx-orange/90"
            asChild
          >
            <Link to="/contact">
              Get in Touch
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </LayoutModern>
  );
}

// Helper to render formatted content with modern styling
function renderFormattedContent(content: string) {
  const sections: React.ReactNode[] = [];
  const lines = content.split('\n');
  let currentSection: string[] = [];
  let sectionIndex = 0;
  let numberedSectionCount = 0;
  
  const icons = [TrendingUp, Target, Zap, Lightbulb];
  
  const flushSection = () => {
    if (currentSection.length === 0) return;
    
    const text = currentSection.join('\n').trim();
    if (!text) {
      currentSection = [];
      return;
    }
    
    // Check for different content types
    if (text.startsWith('## ')) {
      const title = text.replace('## ', '');
      const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      const IconComponent = icons[sectionIndex % icons.length];
      sectionIndex++;
      
      sections.push(
        <div key={`section-${sectionIndex}`} id={id} data-section={id} className="scroll-mt-24">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <IconComponent className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground pt-1">{title}</h2>
          </div>
        </div>
      );
    } else if (text.startsWith('### ')) {
      numberedSectionCount++;
      const title = text.replace('### ', '');
      
      sections.push(
        <div key={`subsection-${numberedSectionCount}`} className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
            {numberedSectionCount}
          </div>
          <h3 className="text-xl font-bold text-foreground pt-0.5">{title}</h3>
        </div>
      );
    } else if (text.startsWith('> ')) {
      const quote = text.replace(/^> /gm, '');
      sections.push(
        <div key={`quote-${sections.length}`} className="bg-muted border-l-4 border-primary p-6 rounded-r-xl italic text-muted-foreground">
          {quote}
        </div>
      );
    } else if (text.includes('- ')) {
      const items = text.split('\n').filter(line => line.startsWith('- '));
      sections.push(
        <ul key={`list-${sections.length}`} className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground leading-relaxed">{item.replace('- ', '')}</span>
            </li>
          ))}
        </ul>
      );
    } else if (text.toLowerCase().includes('key takeaway') || text.toLowerCase().includes('conclusion')) {
      sections.push(
        <div key={`takeaway-${sections.length}`} className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-primary" />
            <h4 className="text-lg font-bold text-foreground">Key Takeaways</h4>
          </div>
          <div className="space-y-2 text-muted-foreground">
            {text.split('\n').filter(line => line.trim()).map((line, i) => (
              <div key={i} className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      // Regular paragraph
      sections.push(
        <p key={`p-${sections.length}`} className="text-muted-foreground leading-relaxed text-lg">
          {text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
               .replace(/\*(.*?)\*/g, '<em>$1</em>')
               .split(/<|>/).map((part, i) => {
                 if (part.startsWith('strong')) return null;
                 if (part.startsWith('/strong')) return null;
                 if (part.startsWith('em')) return null;
                 if (part.startsWith('/em')) return null;
                 if (part.includes('class=')) {
                   const match = part.match(/"text-foreground font-semibold">(.*)/);
                   if (match) return <strong key={i} className="text-foreground font-semibold">{match[1]}</strong>;
                 }
                 return part;
               })}
        </p>
      );
    }
    
    currentSection = [];
  };
  
  for (const line of lines) {
    if (line.startsWith('## ') || line.startsWith('### ') || line.startsWith('> ')) {
      flushSection();
      currentSection.push(line);
      flushSection();
    } else if (line.startsWith('- ')) {
      if (currentSection.length > 0 && !currentSection[0]?.startsWith('- ')) {
        flushSection();
      }
      currentSection.push(line);
    } else if (line.trim() === '') {
      flushSection();
    } else {
      currentSection.push(line);
    }
  }
  flushSection();
  
  return sections;
}
