import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  enabled: boolean;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isDefault: boolean;
}

export interface ExperienceLevel {
  id: string;
  value: string;
  label: string;
  isDefault: boolean;
}

export interface NotificationPreferences {
  emailNewCandidates: boolean;
  emailNewEmployerRequests: boolean;
  emailDigestFrequency: 'instant' | 'daily' | 'weekly' | 'never';
  candidateThreshold: number;
  employerThreshold: number;
  thresholdAlertEnabled: boolean;
}

export interface BrandingSettings {
  logoUrl: string | null;
  companyName: string;
  tagline: string;
}

export type AdminRole = 'super_admin' | 'editor' | 'viewer';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  createdAt: string;
  lastLogin?: string;
}

export const ROLE_PERMISSIONS: Record<AdminRole, {
  label: string;
  description: string;
  permissions: string[];
}> = {
  super_admin: {
    label: 'Super Admin',
    description: 'Full access to all features and settings',
    permissions: ['all'],
  },
  editor: {
    label: 'Editor',
    description: 'Can manage blog posts and job postings only',
    permissions: ['blog', 'jobs'],
  },
  viewer: {
    label: 'Viewer',
    description: 'Read-only access to all data',
    permissions: ['view'],
  },
};

interface SettingsState {
  // Branding
  branding: BrandingSettings;
  setBranding: (branding: Partial<BrandingSettings>) => void;

  // Social Links
  socialLinks: SocialLink[];
  addSocialLink: (link: Omit<SocialLink, 'id'>) => void;
  updateSocialLink: (id: string, link: Partial<SocialLink>) => void;
  deleteSocialLink: (id: string) => void;
  reorderSocialLinks: (links: SocialLink[]) => void;

  // Blog Categories
  blogCategories: BlogCategory[];
  addBlogCategory: (category: Omit<BlogCategory, 'id'>) => void;
  updateBlogCategory: (id: string, category: Partial<BlogCategory>) => void;
  deleteBlogCategory: (id: string) => void;

  // Experience Levels
  experienceLevels: ExperienceLevel[];
  addExperienceLevel: (level: Omit<ExperienceLevel, 'id'>) => void;
  updateExperienceLevel: (id: string, level: Partial<ExperienceLevel>) => void;
  deleteExperienceLevel: (id: string) => void;

  // Notification Preferences
  notifications: NotificationPreferences;
  setNotifications: (prefs: Partial<NotificationPreferences>) => void;

  // Admin Users (for display, managed by Laravel)
  adminUsers: AdminUser[];
  setAdminUsers: (users: AdminUser[]) => void;
}

const defaultBlogCategories: BlogCategory[] = [
  { id: '1', name: 'Industry News', slug: 'industry-news', description: 'Latest accounting industry updates', isDefault: true },
  { id: '2', name: 'Tips & Tricks', slug: 'tips-tricks', description: 'Helpful tips for professionals', isDefault: true },
  { id: '3', name: 'Compliance', slug: 'compliance', description: 'Regulatory and compliance updates', isDefault: true },
  { id: '4', name: 'Career Advice', slug: 'career-advice', description: 'Career development tips', isDefault: true },
  { id: '5', name: 'Technology', slug: 'technology', description: 'Tech in accounting', isDefault: true },
];

const defaultExperienceLevels: ExperienceLevel[] = [
  { id: '1', value: '0-3', label: '0-3 years', isDefault: true },
  { id: '2', value: '3-7', label: '3-7 years', isDefault: true },
  { id: '3', value: '7-10', label: '7-10 years', isDefault: true },
  { id: '4', value: '10+', label: '10+ years', isDefault: true },
];

const defaultSocialLinks: SocialLink[] = [
  { id: '1', platform: 'LinkedIn', url: 'https://linkedin.com/company/goa', icon: 'linkedin', enabled: true },
  { id: '2', platform: 'Twitter', url: 'https://twitter.com/goa', icon: 'twitter', enabled: true },
  { id: '3', platform: 'Facebook', url: 'https://facebook.com/goa', icon: 'facebook', enabled: false },
];

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Branding
      branding: {
        logoUrl: null,
        companyName: 'Global Outsourced Accounting',
        tagline: 'Global Out Sourced Offshore Accounting Solutions',
      },
      setBranding: (branding) =>
        set((state) => ({
          branding: { ...state.branding, ...branding },
        })),

      // Social Links
      socialLinks: defaultSocialLinks,
      addSocialLink: (link) =>
        set((state) => ({
          socialLinks: [...state.socialLinks, { ...link, id: crypto.randomUUID() }],
        })),
      updateSocialLink: (id, link) =>
        set((state) => ({
          socialLinks: state.socialLinks.map((l) =>
            l.id === id ? { ...l, ...link } : l
          ),
        })),
      deleteSocialLink: (id) =>
        set((state) => ({
          socialLinks: state.socialLinks.filter((l) => l.id !== id),
        })),
      reorderSocialLinks: (links) => set({ socialLinks: links }),

      // Blog Categories
      blogCategories: defaultBlogCategories,
      addBlogCategory: (category) =>
        set((state) => ({
          blogCategories: [
            ...state.blogCategories,
            { ...category, id: crypto.randomUUID() },
          ],
        })),
      updateBlogCategory: (id, category) =>
        set((state) => ({
          blogCategories: state.blogCategories.map((c) =>
            c.id === id ? { ...c, ...category } : c
          ),
        })),
      deleteBlogCategory: (id) =>
        set((state) => ({
          blogCategories: state.blogCategories.filter((c) => c.id !== id),
        })),

      // Experience Levels
      experienceLevels: defaultExperienceLevels,
      addExperienceLevel: (level) =>
        set((state) => ({
          experienceLevels: [
            ...state.experienceLevels,
            { ...level, id: crypto.randomUUID() },
          ],
        })),
      updateExperienceLevel: (id, level) =>
        set((state) => ({
          experienceLevels: state.experienceLevels.map((l) =>
            l.id === id ? { ...l, ...level } : l
          ),
        })),
      deleteExperienceLevel: (id) =>
        set((state) => ({
          experienceLevels: state.experienceLevels.filter((l) => l.id !== id),
        })),

      // Notification Preferences
      notifications: {
        emailNewCandidates: true,
        emailNewEmployerRequests: true,
        emailDigestFrequency: 'daily',
        candidateThreshold: 10,
        employerThreshold: 5,
        thresholdAlertEnabled: true,
      },
      setNotifications: (prefs) =>
        set((state) => ({
          notifications: { ...state.notifications, ...prefs },
        })),

      // Admin Users
      adminUsers: [
        {
          id: '1',
          email: 'admin@demo.com',
          name: 'Demo Admin',
          role: 'super_admin',
          createdAt: '2024-01-01T00:00:00Z',
          lastLogin: new Date().toISOString(),
        },
      ],
      setAdminUsers: (users) => set({ adminUsers: users }),
    }),
    {
      name: 'admin-settings',
    }
  )
);
