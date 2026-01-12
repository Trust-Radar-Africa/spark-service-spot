import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BlogPostData {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  image_url: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface BlogPostsState {
  posts: BlogPostData[];
  isLoading: boolean;
  addPost: (post: Omit<BlogPostData, 'id' | 'created_at' | 'updated_at'>) => BlogPostData;
  updatePost: (id: number, data: Partial<BlogPostData>) => void;
  deletePost: (id: number) => void;
  togglePublish: (id: number) => void;
  getPost: (id: number) => BlogPostData | undefined;
}

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Initial demo posts
const initialPosts: BlogPostData[] = [
  {
    id: 1,
    title: 'The Future of Offshore Accounting: Trends to Watch in 2024',
    slug: 'future-offshore-accounting-2024',
    excerpt: 'Discover how technological advancements and changing business landscapes are reshaping the offshore accounting industry.',
    content: '# The Future of Offshore Accounting\n\nThe accounting industry is undergoing a remarkable transformation...\n\n## 1. AI-Powered Automation\n\nArtificial intelligence is revolutionizing how accounting tasks are performed.\n\n## 2. Cloud-First Infrastructure\n\nThe shift to cloud-based accounting platforms has accelerated dramatically.',
    category: 'Industry Insights',
    author: 'Sarah Mitchell',
    image_url: '/placeholder.svg',
    is_published: true,
    published_at: '2024-01-10T09:00:00Z',
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-01-10T09:00:00Z',
  },
  {
    id: 2,
    title: '5 Ways Outsourcing Bookkeeping Can Transform Your Practice',
    slug: 'outsourcing-bookkeeping-benefits',
    excerpt: 'Learn how delegating bookkeeping tasks can free up your time for higher-value advisory services.',
    content: '# 5 Ways Outsourcing Bookkeeping Can Transform Your Practice\n\nOutsourcing bookkeeping isn\'t just about reducing costs—it\'s about transforming how your practice operates.\n\n## 1. Focus on What Matters Most\n\nWhen you\'re buried in data entry, you have less time for advisory work.',
    category: 'Best Practices',
    author: 'James Crawford',
    image_url: '/placeholder.svg',
    is_published: true,
    published_at: '2024-01-05T10:00:00Z',
    created_at: '2024-01-05T08:00:00Z',
    updated_at: '2024-01-05T10:00:00Z',
  },
  {
    id: 3,
    title: 'Understanding US GAAP vs IFRS: A Comprehensive Guide',
    slug: 'us-gaap-vs-ifrs-guide',
    excerpt: 'A detailed comparison of the two major accounting frameworks and when to apply each.',
    content: '# Understanding US GAAP vs IFRS\n\nUnderstanding the differences between US GAAP and IFRS is essential for any accounting professional.\n\n## Key Differences\n\n### Rules-Based vs. Principles-Based\n\nUS GAAP is more rules-based while IFRS is more principles-based.',
    category: 'Technical',
    author: 'Emma Richardson',
    image_url: '/placeholder.svg',
    is_published: false,
    published_at: null,
    created_at: '2023-12-28T08:00:00Z',
    updated_at: '2023-12-28T08:00:00Z',
  },
];

export const useBlogPostsStore = create<BlogPostsState>()(
  persist(
    (set, get) => ({
      posts: initialPosts,
      isLoading: false,

      addPost: (postData) => {
        const newPost: BlogPostData = {
          ...postData,
          id: Date.now(),
          slug: postData.slug || generateSlug(postData.title),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        set((state) => ({
          posts: [newPost, ...state.posts],
        }));
        return newPost;
      },

      updatePost: (id, data) => {
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === id
              ? {
                  ...post,
                  ...data,
                  slug: data.title ? generateSlug(data.title) : post.slug,
                  updated_at: new Date().toISOString(),
                }
              : post
          ),
        }));
      },

      deletePost: (id) => {
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== id),
        }));
      },

      togglePublish: (id) => {
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === id
              ? {
                  ...post,
                  is_published: !post.is_published,
                  published_at: !post.is_published ? new Date().toISOString() : null,
                  updated_at: new Date().toISOString(),
                }
              : post
          ),
        }));
      },

      getPost: (id) => {
        return get().posts.find((post) => post.id === id);
      },
    }),
    {
      name: 'blog-posts-storage',
    }
  )
);
