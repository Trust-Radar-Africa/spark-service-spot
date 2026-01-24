import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useApiConfigStore } from './apiConfigStore';

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
  error: string | null;
  fetchPosts: () => Promise<void>;
  addPost: (post: Omit<BlogPostData, 'id' | 'created_at' | 'updated_at'>) => Promise<BlogPostData | null>;
  updatePost: (id: number, data: Partial<BlogPostData>) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
  togglePublish: (id: number) => Promise<void>;
  getPost: (id: number) => BlogPostData | undefined;
}

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Normalize blog post data from API (handles object fields like category, author)
const normalizePost = (post: any): BlogPostData => ({
  ...post,
  // Handle category as object {id, name, slug} or string
  category: typeof post.category === 'object' && post.category !== null
    ? post.category.name || post.category.slug || ''
    : post.category || '',
  // Handle author as object {id, name} or string
  author: typeof post.author === 'object' && post.author !== null
    ? post.author.name || ''
    : post.author || '',
});

export const useBlogPostsStore = create<BlogPostsState>()(
  persist(
    (set, get) => ({
      posts: [],
      isLoading: false,
      error: null,

      fetchPosts: async () => {
        const { getApiUrl } = useApiConfigStore.getState();

        set({ isLoading: true, error: null });

        try {
          const token = localStorage.getItem('admin_token');
          const response = await fetch(getApiUrl('/api/admin/blog'), {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            const rawPosts = data.data || data;
            // Normalize posts to handle object fields
            const normalizedPosts = Array.isArray(rawPosts)
              ? rawPosts.map(normalizePost)
              : [];
            set({ posts: normalizedPosts, isLoading: false });
            return;
          }
          set({ error: 'Failed to fetch blog posts', isLoading: false });
        } catch (error) {
          console.error('Failed to fetch blog posts:', error);
          set({ error: 'Failed to connect to server', isLoading: false });
        }
      },

      addPost: async (postData) => {
        const { getApiUrl } = useApiConfigStore.getState();

        try {
          const token = localStorage.getItem('admin_token');
          const response = await fetch(getApiUrl('/api/admin/blog'), {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...postData,
              slug: postData.slug || generateSlug(postData.title),
            }),
          });

          if (response.ok) {
            const result = await response.json();
            const rawPost = result.data || result.post || result;
            const newPost = normalizePost(rawPost);
            set((state) => ({
              posts: [newPost, ...state.posts],
            }));
            return newPost;
          }
        } catch (error) {
          console.error('Failed to create blog post via API:', error);
        }
        return null;
      },

      updatePost: async (id, data) => {
        const { getApiUrl } = useApiConfigStore.getState();

        // Optimistically update UI
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

        try {
          const token = localStorage.getItem('admin_token');
          await fetch(getApiUrl(`/api/admin/blog/${id}`), {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
        } catch (error) {
          console.error('Failed to update blog post via API:', error);
        }
      },

      deletePost: async (id) => {
        const { getApiUrl } = useApiConfigStore.getState();

        // Optimistically update UI
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== id),
        }));

        try {
          const token = localStorage.getItem('admin_token');
          await fetch(getApiUrl(`/api/admin/blog/${id}`), {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });
        } catch (error) {
          console.error('Failed to delete blog post via API:', error);
        }
      },

      togglePublish: async (id) => {
        const { getApiUrl } = useApiConfigStore.getState();
        const post = get().posts.find(p => p.id === id);
        const newPublishState = post ? !post.is_published : false;

        // Optimistically update UI
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === id
              ? {
                  ...post,
                  is_published: newPublishState,
                  published_at: newPublishState ? new Date().toISOString() : null,
                  updated_at: new Date().toISOString(),
                }
              : post
          ),
        }));

        try {
          const token = localStorage.getItem('admin_token');
          await fetch(getApiUrl(`/api/admin/blog/${id}/toggle-publish`), {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ is_published: newPublishState }),
          });
        } catch (error) {
          console.error('Failed to toggle blog post publish status via API:', error);
        }
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
