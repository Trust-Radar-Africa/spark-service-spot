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
  {
    id: 4,
    title: 'Tax Planning Strategies for Small Businesses in 2024',
    slug: 'tax-planning-small-businesses-2024',
    excerpt: 'Essential tax planning tips to help small businesses maximize deductions and minimize liability.',
    content: '# Tax Planning Strategies for Small Businesses\n\nEffective tax planning can significantly impact your bottom line.\n\n## 1. Maximize Deductions\n\nKeep detailed records of all business expenses.\n\n## 2. Retirement Contributions\n\nConsider SEP-IRA or Solo 401(k) contributions.',
    category: 'Tax Advisory',
    author: 'Michael Chen',
    image_url: '/placeholder.svg',
    is_published: true,
    published_at: '2024-01-12T14:00:00Z',
    created_at: '2024-01-12T12:00:00Z',
    updated_at: '2024-01-12T14:00:00Z',
  },
  {
    id: 5,
    title: 'How AI is Revolutionizing Audit Procedures',
    slug: 'ai-revolutionizing-audit-procedures',
    excerpt: 'Explore how artificial intelligence is transforming traditional audit methodologies and improving accuracy.',
    content: '# How AI is Revolutionizing Audit Procedures\n\nArtificial intelligence is no longer a futuristic concept in auditing.\n\n## Automated Data Analysis\n\nAI can process millions of transactions in seconds.\n\n## Pattern Recognition\n\nMachine learning algorithms identify anomalies faster than ever.',
    category: 'Industry Insights',
    author: 'Sarah Mitchell',
    image_url: '/placeholder.svg',
    is_published: true,
    published_at: '2024-01-08T11:00:00Z',
    created_at: '2024-01-08T10:00:00Z',
    updated_at: '2024-01-08T11:00:00Z',
  },
  {
    id: 6,
    title: 'Building a Remote Accounting Team: Best Practices',
    slug: 'building-remote-accounting-team',
    excerpt: 'A comprehensive guide to hiring, managing, and retaining top accounting talent in a remote environment.',
    content: '# Building a Remote Accounting Team\n\nRemote work has become the norm in accounting.\n\n## Hiring the Right People\n\nLook for self-motivated individuals with strong communication skills.\n\n## Tools and Technology\n\nInvest in secure, collaborative platforms.',
    category: 'Best Practices',
    author: 'James Crawford',
    image_url: '/placeholder.svg',
    is_published: true,
    published_at: '2024-01-03T09:00:00Z',
    created_at: '2024-01-03T08:00:00Z',
    updated_at: '2024-01-03T09:00:00Z',
  },
  {
    id: 7,
    title: 'VAT Implementation in the GCC: Lessons Learned',
    slug: 'vat-implementation-gcc-lessons',
    excerpt: 'Key takeaways from VAT rollouts across Gulf Cooperation Council countries for businesses operating in the region.',
    content: '# VAT Implementation in the GCC\n\nVAT has been a significant change for GCC businesses.\n\n## UAE Implementation\n\nThe UAE\'s 5% VAT was introduced in January 2018.\n\n## Saudi Arabia Updates\n\nKSA increased VAT to 15% in 2020.',
    category: 'Tax Advisory',
    author: 'Ahmed Al-Hassan',
    image_url: '/placeholder.svg',
    is_published: true,
    published_at: '2023-12-20T10:00:00Z',
    created_at: '2023-12-20T09:00:00Z',
    updated_at: '2023-12-20T10:00:00Z',
  },
  {
    id: 8,
    title: 'Understanding Transfer Pricing Regulations',
    slug: 'understanding-transfer-pricing-regulations',
    excerpt: 'Navigate the complexities of transfer pricing rules and documentation requirements for multinational entities.',
    content: '# Understanding Transfer Pricing Regulations\n\nTransfer pricing is a critical compliance area.\n\n## Arm\'s Length Principle\n\nTransactions between related parties must reflect market rates.\n\n## Documentation Requirements\n\nMaintain detailed records of intercompany transactions.',
    category: 'Technical',
    author: 'Emma Richardson',
    image_url: '/placeholder.svg',
    is_published: false,
    published_at: null,
    created_at: '2023-12-15T14:00:00Z',
    updated_at: '2023-12-15T14:00:00Z',
  },
  {
    id: 9,
    title: 'Client Communication: The Key to Successful Outsourcing',
    slug: 'client-communication-successful-outsourcing',
    excerpt: 'How effective communication can make or break your offshore accounting partnership.',
    content: '# Client Communication in Outsourcing\n\nClear communication is the foundation of successful outsourcing.\n\n## Setting Expectations\n\nDefine deliverables, timelines, and quality standards upfront.\n\n## Regular Check-ins\n\nSchedule weekly or bi-weekly calls to stay aligned.',
    category: 'Best Practices',
    author: 'Lisa Thompson',
    image_url: '/placeholder.svg',
    is_published: true,
    published_at: '2024-01-15T08:00:00Z',
    created_at: '2024-01-15T07:00:00Z',
    updated_at: '2024-01-15T08:00:00Z',
  },
  {
    id: 10,
    title: 'Cybersecurity Best Practices for Accounting Firms',
    slug: 'cybersecurity-best-practices-accounting',
    excerpt: 'Protect your firm and clients from cyber threats with these essential security measures.',
    content: '# Cybersecurity for Accounting Firms\n\nAccounting firms handle sensitive financial data daily.\n\n## Multi-Factor Authentication\n\nImplement MFA across all systems.\n\n## Employee Training\n\nRegular security awareness training is essential.',
    category: 'Industry Insights',
    author: 'Michael Chen',
    image_url: '/placeholder.svg',
    is_published: true,
    published_at: '2024-01-18T12:00:00Z',
    created_at: '2024-01-18T11:00:00Z',
    updated_at: '2024-01-18T12:00:00Z',
  },
  {
    id: 11,
    title: 'The Rise of ESG Reporting: What Accountants Need to Know',
    slug: 'esg-reporting-accountants-guide',
    excerpt: 'Environmental, Social, and Governance reporting is becoming mandatory—here\'s how to prepare.',
    content: '# The Rise of ESG Reporting\n\nESG reporting is no longer optional for many companies.\n\n## Regulatory Requirements\n\nNew disclosure rules are being implemented globally.\n\n## Measurement Challenges\n\nStandardized metrics are still evolving.',
    category: 'Technical',
    author: 'Sarah Mitchell',
    image_url: '/placeholder.svg',
    is_published: false,
    published_at: null,
    created_at: '2024-01-20T09:00:00Z',
    updated_at: '2024-01-20T09:00:00Z',
  },
  {
    id: 12,
    title: 'Scaling Your Accounting Practice with Technology',
    slug: 'scaling-accounting-practice-technology',
    excerpt: 'Leverage the right tools to grow your practice without proportionally increasing overhead.',
    content: '# Scaling with Technology\n\nTechnology is the key to sustainable growth.\n\n## Practice Management Software\n\nCentralize client management and workflow.\n\n## Automation Opportunities\n\nIdentify repetitive tasks that can be automated.',
    category: 'Best Practices',
    author: 'James Crawford',
    image_url: '/placeholder.svg',
    is_published: true,
    published_at: '2024-01-22T10:00:00Z',
    created_at: '2024-01-22T09:00:00Z',
    updated_at: '2024-01-22T10:00:00Z',
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
