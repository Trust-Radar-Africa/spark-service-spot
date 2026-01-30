import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useApiConfigStore } from './apiConfigStore';
import { normalizeHsl } from '@/utils/color';



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
  createAdminUser: (userData: { name: string; email: string; password: string; role: AdminRole }) => Promise<{ success: boolean; user?: AdminUser; error?: string }>;

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
        const normalized = {
          ...branding,
          primaryColor: normalizeHsl(branding.primaryColor),
          accentColor: normalizeHsl(branding.accentColor),
          secondaryColor: normalizeHsl((branding as any).secondaryColor),
        };

        set((state) => ({
          branding: { ...state.branding, ...normalized },
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
      addSocialLink: (link) => {
        set((state) => ({
          socialLinks: [...state.socialLinks, { ...link, id: crypto.randomUUID() }],
        }));
        get().saveSettingsToApi();
      },
      updateSocialLink: (id, link) => {
        set((state) => ({
          socialLinks: state.socialLinks.map((l) =>
            l.id === id ? { ...l, ...link } : l
          ),
        }));
        get().saveSettingsToApi();
      },
      deleteSocialLink: (id) => {
        set((state) => ({
          socialLinks: state.socialLinks.filter((l) => l.id !== id),
        }));
        get().saveSettingsToApi();
      },
      reorderSocialLinks: (links) => {
        set({ socialLinks: links });
        get().saveSettingsToApi();
      },

      // Blog Categories - start empty, fetch from API
      blogCategories: [],
      addBlogCategory: (category) => {
        set((state) => ({
          blogCategories: [
            ...state.blogCategories,
            { ...category, id: crypto.randomUUID() },
          ],
        }));
        get().saveSettingsToApi();
      },
      updateBlogCategory: (id, category) => {
        set((state) => ({
          blogCategories: state.blogCategories.map((c) =>
            c.id === id ? { ...c, ...category } : c
          ),
        }));
        get().saveSettingsToApi();
      },
      deleteBlogCategory: (id) => {
        set((state) => ({
          blogCategories: state.blogCategories.filter((c) => c.id !== id),
        }));
        get().saveSettingsToApi();
      },

      // Experience Levels - start empty, fetch from API
      experienceLevels: [],
      addExperienceLevel: (level) => {
        set((state) => ({
          experienceLevels: [
            ...state.experienceLevels,
            { ...level, id: crypto.randomUUID() },
          ],
        }));
        get().saveSettingsToApi();
      },
      updateExperienceLevel: (id, level) => {
        set((state) => ({
          experienceLevels: state.experienceLevels.map((l) =>
            l.id === id ? { ...l, ...level } : l
          ),
        }));
        get().saveSettingsToApi();
      },
      deleteExperienceLevel: (id) => {
        set((state) => ({
          experienceLevels: state.experienceLevels.filter((l) => l.id !== id),
        }));
        get().saveSettingsToApi();
      },

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

      // Create admin user
      createAdminUser: async (userData: { name: string; email: string; password: string; role: AdminRole }) => {
        const { getApiUrl } = useApiConfigStore.getState();

        try {
          const token = localStorage.getItem('admin_token');
          const response = await fetch(getApiUrl('/api/admin/users'), {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          if (response.ok) {
            const data = await response.json();
            const newUser = data.data || data;
            set((state) => ({
              adminUsers: [...state.adminUsers, newUser],
            }));
            return { success: true, user: newUser };
          } else {
            const errorData = await response.json();
            return { success: false, error: errorData.message || 'Failed to create user' };
          }
        } catch (error) {
          console.error('Failed to create admin user:', error);
          return { success: false, error: 'Failed to connect to server' };
        }
      },

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

            // Update store with fetched settings - map snake_case to camelCase
            if (settings.branding) {
              const branding: Partial<BrandingSettings> = {};
              if (settings.branding.company_name) branding.companyName = settings.branding.company_name;
              if (settings.branding.tagline) branding.tagline = settings.branding.tagline;
              
              if (settings.branding.primary_color)
                branding.primaryColor = normalizeHsl(settings.branding.primary_color);

              if (settings.branding.accent_color)
                branding.accentColor = normalizeHsl(settings.branding.accent_color);

              if (settings.branding.logo_url) branding.logoUrl = settings.branding.logo_url;
              if (settings.branding.logo_path) branding.logoUrl = '/storage/' + settings.branding.logo_path;
              set((state) => ({ branding: { ...state.branding, ...branding } }));
            }
            if (settings.general) {
              const general: Partial<GeneralSettings> = {};
              if (settings.general.theme_mode) general.themeMode = settings.general.theme_mode;
              if (settings.general.items_per_page) general.itemsPerPage = parseInt(settings.general.items_per_page);
              if (settings.general.date_format) general.dateFormat = settings.general.date_format;
              if (settings.general.time_format) general.timeFormat = settings.general.time_format;
              if (settings.general.currency_format) general.currencyFormat = settings.general.currency_format;
              if (settings.general.auto_archive_days) general.autoArchiveDays = parseInt(settings.general.auto_archive_days);
              if (settings.general.auto_archive_enabled !== undefined) general.autoArchiveEnabled = settings.general.auto_archive_enabled === 'true' || settings.general.auto_archive_enabled === true;
              set((state) => ({ general: { ...state.general, ...general } }));
            }
            if (settings.notifications) {
              const notifications: Partial<NotificationPreferences> = {};
              if (settings.notifications.email_new_candidates !== undefined) notifications.emailNewCandidates = settings.notifications.email_new_candidates === 'true' || settings.notifications.email_new_candidates === true;
              if (settings.notifications.email_new_employer_requests !== undefined) notifications.emailNewEmployerRequests = settings.notifications.email_new_employer_requests === 'true' || settings.notifications.email_new_employer_requests === true;
              if (settings.notifications.email_digest_frequency) notifications.emailDigestFrequency = settings.notifications.email_digest_frequency;
              if (settings.notifications.candidate_threshold) notifications.candidateThreshold = parseInt(settings.notifications.candidate_threshold);
              if (settings.notifications.employer_threshold) notifications.employerThreshold = parseInt(settings.notifications.employer_threshold);
              if (settings.notifications.threshold_alert_enabled !== undefined) notifications.thresholdAlertEnabled = settings.notifications.threshold_alert_enabled === 'true' || settings.notifications.threshold_alert_enabled === true;
              set((state) => ({ notifications: { ...state.notifications, ...notifications } }));
            }
            if (settings.social_links) {
              const socialLinks = settings.social_links.map((link: any) => ({
                id: String(link.id),
                platform: link.platform,
                url: link.url,
                icon: link.icon,
                enabled: link.is_enabled,
              }));
              set({ socialLinks });
            }
            if (settings.blog_categories) {
              const blogCategories = settings.blog_categories.map((cat: any) => ({
                id: String(cat.id),
                name: cat.name,
                slug: cat.slug,
                description: cat.description,
                isDefault: cat.is_default,
              }));
              set({ blogCategories });
            }
            if (settings.experience_levels) {
              const experienceLevels = settings.experience_levels.map((level: any) => ({
                id: String(level.id),
                value: level.value,
                label: level.label,
                isDefault: level.is_default,
              }));
              set({ experienceLevels });
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
