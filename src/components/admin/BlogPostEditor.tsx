import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BlogPostData } from '@/stores/blogPostsStore';
import ImageUpload from './ImageUpload';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Eye,
  Edit3,
} from 'lucide-react';

const categories = [
  'Industry Insights',
  'Best Practices',
  'Technical',
  'Management',
  'Tax',
  'Technology',
  'News',
];

const authors = [
  'Sarah Mitchell',
  'James Crawford',
  'Emma Richardson',
  'Michael Zhang',
  'David Foster',
];

interface BlogPostEditorProps {
  post?: BlogPostData | null;
  onSave: (data: Partial<BlogPostData>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export default function BlogPostEditor({
  post,
  onSave,
  onCancel,
  isSaving = false,
}: BlogPostEditorProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [category, setCategory] = useState(post?.category || '');
  const [author, setAuthor] = useState(post?.author || '');
  const [imageUrl, setImageUrl] = useState(post?.image_url || '');
  const [activeTab, setActiveTab] = useState<string>('edit');

  const insertMarkdown = useCallback(
    (prefix: string, suffix: string = '', placeholder: string = '') => {
      const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const textToInsert = selectedText || placeholder;

      const newContent =
        content.substring(0, start) +
        prefix +
        textToInsert +
        suffix +
        content.substring(end);

      setContent(newContent);

      // Reset cursor position after state update
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + prefix.length + textToInsert.length + suffix.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    },
    [content]
  );

  const toolbarButtons = [
    { icon: Bold, action: () => insertMarkdown('**', '**', 'bold text'), tooltip: 'Bold' },
    { icon: Italic, action: () => insertMarkdown('*', '*', 'italic text'), tooltip: 'Italic' },
    { icon: Heading1, action: () => insertMarkdown('\n# ', '\n', 'Heading 1'), tooltip: 'Heading 1' },
    { icon: Heading2, action: () => insertMarkdown('\n## ', '\n', 'Heading 2'), tooltip: 'Heading 2' },
    { icon: Heading3, action: () => insertMarkdown('\n### ', '\n', 'Heading 3'), tooltip: 'Heading 3' },
    { icon: List, action: () => insertMarkdown('\n- ', '\n', 'List item'), tooltip: 'Bullet List' },
    { icon: ListOrdered, action: () => insertMarkdown('\n1. ', '\n', 'List item'), tooltip: 'Numbered List' },
    { icon: Quote, action: () => insertMarkdown('\n> ', '\n', 'Quote'), tooltip: 'Quote' },
    { icon: Code, action: () => insertMarkdown('`', '`', 'code'), tooltip: 'Inline Code' },
    { icon: LinkIcon, action: () => insertMarkdown('[', '](url)', 'link text'), tooltip: 'Link' },
    { icon: ImageIcon, action: () => insertMarkdown('![', '](image-url)', 'alt text'), tooltip: 'Image' },
  ];

  const handleSave = () => {
    onSave({
      title,
      excerpt,
      content,
      category,
      author,
      image_url: imageUrl,
      is_published: post?.is_published || false,
      published_at: post?.published_at || null,
    });
  };

  const renderMarkdownPreview = (text: string) => {
    // Simple markdown to HTML conversion for preview
    let html = text
      // Headings
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
      // Bold and italic
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary underline">$1</a>')
      // Lists
      .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4 list-decimal">$2</li>')
      // Quotes
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-primary pl-4 italic my-2">$1</blockquote>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="my-2">')
      .replace(/\n/g, '<br/>');

    return `<div class="prose prose-sm max-w-none"><p class="my-2">${html}</p></div>`;
  };

  const isValid = title.trim() && excerpt.trim() && content.trim() && category && author;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{post ? 'Edit Post' : 'Create New Post'}</h2>
          {post && (
            <Badge variant={post.is_published ? 'default' : 'secondary'} className="mt-1">
              {post.is_published ? 'Published' : 'Draft'}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid || isSaving}>
            {isSaving ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
          </Button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="author">Author *</Label>
          <Select value={author} onValueChange={setAuthor}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select author" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              {authors.map((auth) => (
                <SelectItem key={auth} value={auth}>
                  {auth}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="excerpt">Excerpt *</Label>
          <Textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief description of the post..."
            className="mt-1"
            rows={2}
          />
        </div>

        <div className="md:col-span-2">
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            label="Featured Image"
          />
        </div>
      </div>

      {/* Content Editor */}
      <div className="space-y-2">
        <Label>Content *</Label>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between border rounded-t-lg bg-muted/50 p-2">
            <div className="flex items-center gap-1 flex-wrap">
              {toolbarButtons.map((btn, i) => (
                <Button
                  key={i}
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={btn.action}
                  title={btn.tooltip}
                  disabled={activeTab === 'preview'}
                >
                  <btn.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
            <TabsList className="bg-transparent">
              <TabsTrigger value="edit" className="flex items-center gap-1 data-[state=active]:bg-background">
                <Edit3 className="h-3 w-3" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-1 data-[state=active]:bg-background">
                <Eye className="h-3 w-3" />
                Preview
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="edit" className="mt-0">
            <Textarea
              id="content-editor"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content using Markdown..."
              className="min-h-[400px] font-mono text-sm rounded-t-none border-t-0"
            />
          </TabsContent>

          <TabsContent value="preview" className="mt-0">
            <div
              className="min-h-[400px] p-4 border rounded-b-lg border-t-0 bg-background overflow-auto"
              dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(content) }}
            />
          </TabsContent>
        </Tabs>
        <p className="text-xs text-muted-foreground">
          Supports Markdown: **bold**, *italic*, # headings, - lists, [links](url), etc.
        </p>
      </div>
    </div>
  );
}
