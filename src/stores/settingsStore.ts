import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useApiConfigStore } from './apiConfigStore';

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
  primaryColor: string;
  accentColor: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
export type TimeFormat = '12h' | '24h';
export type CurrencyFormat = 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD';

export interface GeneralSettings {
  themeMode: ThemeMode;
  itemsPerPage: number;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  currencyFormat: CurrencyFormat;
  autoArchiveDays: number;
  autoArchiveEnabled: boolean;
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
  // Loading state
  isLoading: boolean;
  error: string | null;

  // Branding
  branding: BrandingSettings;
  setBranding: (branding: Partial<BrandingSettings>) => Promise<void>;

  // General Settings
  general: GeneralSettings;
  setGeneral: (settings: Partial<GeneralSettings>) => Promise<void>;

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
  setNotifications: (prefs: Partial<NotificationPreferences>) => Promise<void>;

  // Admin Users (for display, managed by backend)
  adminUsers: AdminUser[];
  setAdminUsers: (users: AdminUser[]) => void;

  // API functions
  fetchSettings: () => Promise<void>;
  fetchAdminUsers: () => Promise<void>;
  saveSettingsToApi: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Loading state
      isLoading: false,
      error: null,

      // Branding - defaults
      branding: {
        logoUrl: null,
        companyName: 'Global Outsourced Accounting',
        tagline: 'Global Out Sourced Offshore Accounting Solutions',
        primaryColor: '220 60% 20%',
        accentColor: '38 92% 50%',
      },
      setBranding: async (branding) => {
        set((state) => ({
          branding: { ...state.branding, ...branding },
        }));
        await get().saveSettingsToApi();
      },

      // General Settings - defaults
      general: {
        themeMode: 'light',
        itemsPerPage: 10,
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        currencyFormat: 'USD',
        autoArchiveDays: 90,
        autoArchiveEnabled: false,
      },
      setGeneral: async (settings) => {
        set((state) => ({
          general: { ...state.general, ...settings },
        }));
        await get().saveSettingsToApi();
      },

      // Social Links - start empty, fetch from API
      socialLinks: [],
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

      // Blog Categories - start empty, fetch from API
      blogCategories: [],
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

      // Experience Levels - start empty, fetch from API
      experienceLevels: [],
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

      // Notification Preferences - defaults
      notifications: {
        emailNewCandidates: true,
        emailNewEmployerRequests: true,
        emailDigestFrequency: 'daily',
        candidateThreshold: 10,
        employerThreshold: 5,
        thresholdAlertEnabled: true,
      },
      setNotifications: async (prefs) => {
        set((state) => ({
          notifications: { ...state.notifications, ...prefs },
        }));
        await get().saveSettingsToApi();
      },

      // Admin Users - start empty, fetch from API
      adminUsers: [],
      setAdminUsers: (users) => set({ adminUsers: users }),

      // API functions
      fetchSettings: async () => {
        const { getApiUrl } = useApiConfigStore.getState();

        set({ isLoading: true, error: null });

        try {
          const token = localStorage.getItem('admin_token');
          const response = await fetch(getApiUrl('/api/admin/settings'), {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            const settings = data.data || data;

            // Update store with fetched settings
            if (settings.branding) {
              set((state) => ({ branding: { ...state.branding, ...settings.branding } }));
            }
            if (settings.general) {
              set((state) => ({ general: { ...state.general, ...settings.general } }));
            }
            if (settings.notifications) {
              set((state) => ({ notifications: { ...state.notifications, ...settings.notifications } }));
            }
            if (settings.socialLinks) {
              set({ socialLinks: settings.socialLinks });
            }
            if (settings.blogCategories) {
              set({ blogCategories: settings.blogCategories });
            }
            if (settings.experienceLevels) {
              set({ experienceLevels: settings.experienceLevels });
            }
            set({ isLoading: false });
            return;
          }
          set({ error: 'Failed to fetch settings', isLoading: false });
        } catch (error) {
          console.error('Failed to fetch settings from API:', error);
          set({ error: 'Failed to connect to server', isLoading: false });
        }
      },

      fetchAdminUsers: async () => {
        const { getApiUrl } = useApiConfigStore.getState();

        try {
          const token = localStorage.getItem('admin_token');
          const response = await fetch(getApiUrl('/api/admin/users'), {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            set({ adminUsers: data.data || data });
          }
        } catch (error) {
          console.error('Failed to fetch admin users from API:', error);
        }
      },

      saveSettingsToApi: async () => {
        const { getApiUrl } = useApiConfigStore.getState();

        try {
          const token = localStorage.getItem('admin_token');
          const state = get();

          await fetch(getApiUrl('/api/admin/settings'), {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              branding: state.branding,
              general: state.general,
              notifications: state.notifications,
              socialLinks: state.socialLinks,
              blogCategories: state.blogCategories,
              experienceLevels: state.experienceLevels,
            }),
          });
        } catch (error) {
          console.error('Failed to save settings to API:', error);
        }
      },
    }),
    {
      name: 'admin-settings',
    }
  )
);
