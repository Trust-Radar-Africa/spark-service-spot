import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  useSettingsStore,
  SocialLink,
  BlogCategory,
  ExperienceLevel,
  ROLE_PERMISSIONS,
  AdminRole,
  DateFormat,
  TimeFormat,
  CurrencyFormat,
} from '@/stores/settingsStore';
import { useApiConfigStore } from '@/stores/apiConfigStore';
import {
  Settings,
  Palette,
  Bell,
  Users,
  FileText,
  Share2,
  Plus,
  Pencil,
  Trash2,
  Upload,
  Image as ImageIcon,
  Save,
  Mail,
  Shield,
  Tag,
  Briefcase,
  ExternalLink,
  Link as LinkIcon,
  Cog,
  Calendar,
  Clock,
  DollarSign,
  Archive,
  Server,
  ToggleLeft,
  RotateCcw,
} from 'lucide-react';
import { DEFAULT_COLORS } from '@/components/BrandingProvider';

// Helper functions for color conversion
function hslToHex(hslString: string): string {
  try {
    const parts = hslString.trim().split(/\s+/);
    if (parts.length < 3) return '#000000';
    
    const h = parseFloat(parts[0]) / 360;
    const s = parseFloat(parts[1].replace('%', '')) / 100;
    const l = parseFloat(parts[2].replace('%', '')) / 100;
    
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  } catch {
    return '#000000';
  }
}

function hexToHsl(hex: string): string {
  try {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '0 0% 0%';
    
    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  } catch {
    return '0 0% 0%';
  }
}

export default function SettingsPage() {
  const { toast } = useToast();
  const {
    branding,
    setBranding,
    general,
    setGeneral,
    socialLinks,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink,
    blogCategories,
    addBlogCategory,
    updateBlogCategory,
    deleteBlogCategory,
    experienceLevels,
    addExperienceLevel,
    updateExperienceLevel,
    deleteExperienceLevel,
    notifications,
    setNotifications,
    adminUsers,
  } = useSettingsStore();

  const { dataMode, apiBaseUrl, setDataMode, setApiBaseUrl } = useApiConfigStore();

  const [activeTab, setActiveTab] = useState('branding');

  // Dialog states
  const [socialLinkDialog, setSocialLinkDialog] = useState<{
    open: boolean;
    editing: SocialLink | null;
  }>({ open: false, editing: null });
  const [categoryDialog, setCategoryDialog] = useState<{
    open: boolean;
    editing: BlogCategory | null;
  }>({ open: false, editing: null });
  const [experienceDialog, setExperienceDialog] = useState<{
    open: boolean;
    editing: ExperienceLevel | null;
  }>({ open: false, editing: null });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: 'social' | 'category' | 'experience' | null;
    id: string | null;
    name: string;
  }>({ open: false, type: null, id: null, name: '' });

  // Form states
  const [socialForm, setSocialForm] = useState({ platform: '', url: '', icon: '' });
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', description: '' });
  const [experienceForm, setExperienceForm] = useState({ value: '', label: '' });

  const handleSaveBranding = () => {
    toast({
      title: 'Branding saved',
      description: 'Your branding settings have been updated.',
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: 'Notification preferences saved',
      description: 'Your notification settings have been updated.',
    });
  };

  const handleSaveGeneral = () => {
    toast({
      title: 'General settings saved',
      description: 'Your general settings have been updated.',
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In production, upload to Laravel storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setBranding({ logoUrl: reader.result as string });
        toast({
          title: 'Logo uploaded',
          description: 'Your logo has been updated. Remember to save changes.',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSocialLink = () => {
    if (!socialForm.platform || !socialForm.url) {
      toast({ title: 'Error', description: 'Platform and URL are required', variant: 'destructive' });
      return;
    }
    
    if (socialLinkDialog.editing) {
      updateSocialLink(socialLinkDialog.editing.id, {
        platform: socialForm.platform,
        url: socialForm.url,
        icon: socialForm.icon || socialForm.platform.toLowerCase(),
      });
      toast({ title: 'Social link updated' });
    } else {
      addSocialLink({
        platform: socialForm.platform,
        url: socialForm.url,
        icon: socialForm.icon || socialForm.platform.toLowerCase(),
        enabled: true,
      });
      toast({ title: 'Social link added' });
    }
    setSocialLinkDialog({ open: false, editing: null });
    setSocialForm({ platform: '', url: '', icon: '' });
  };

  const handleSaveCategory = () => {
    if (!categoryForm.name) {
      toast({ title: 'Error', description: 'Category name is required', variant: 'destructive' });
      return;
    }
    
    const slug = categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, '-');
    
    if (categoryDialog.editing) {
      updateBlogCategory(categoryDialog.editing.id, {
        name: categoryForm.name,
        slug,
        description: categoryForm.description,
      });
      toast({ title: 'Category updated' });
    } else {
      addBlogCategory({
        name: categoryForm.name,
        slug,
        description: categoryForm.description,
        isDefault: false,
      });
      toast({ title: 'Category added' });
    }
    setCategoryDialog({ open: false, editing: null });
    setCategoryForm({ name: '', slug: '', description: '' });
  };

  const handleSaveExperience = () => {
    if (!experienceForm.value || !experienceForm.label) {
      toast({ title: 'Error', description: 'Value and label are required', variant: 'destructive' });
      return;
    }
    
    if (experienceDialog.editing) {
      updateExperienceLevel(experienceDialog.editing.id, {
        value: experienceForm.value,
        label: experienceForm.label,
      });
      toast({ title: 'Experience level updated' });
    } else {
      addExperienceLevel({
        value: experienceForm.value,
        label: experienceForm.label,
        isDefault: false,
      });
      toast({ title: 'Experience level added' });
    }
    setExperienceDialog({ open: false, editing: null });
    setExperienceForm({ value: '', label: '' });
  };

  const handleDelete = () => {
    if (!deleteDialog.id || !deleteDialog.type) return;
    
    switch (deleteDialog.type) {
      case 'social':
        deleteSocialLink(deleteDialog.id);
        break;
      case 'category':
        deleteBlogCategory(deleteDialog.id);
        break;
      case 'experience':
        deleteExperienceLevel(deleteDialog.id);
        break;
    }
    toast({ title: 'Deleted successfully' });
    setDeleteDialog({ open: false, type: null, id: null, name: '' });
  };

  const openEditSocialLink = (link: SocialLink) => {
    setSocialForm({ platform: link.platform, url: link.url, icon: link.icon });
    setSocialLinkDialog({ open: true, editing: link });
  };

  const openEditCategory = (category: BlogCategory) => {
    setCategoryForm({ name: category.name, slug: category.slug, description: category.description || '' });
    setCategoryDialog({ open: true, editing: category });
  };

  const openEditExperience = (level: ExperienceLevel) => {
    setExperienceForm({ value: level.value, label: level.label });
    setExperienceDialog({ open: true, editing: level });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Settings
          </h1>
          <p className="text-muted-foreground">
            Configure your admin panel and website settings
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto">
            <TabsTrigger value="branding" className="gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Branding</span>
            </TabsTrigger>
            <TabsTrigger value="general" className="gap-2">
              <Cog className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="gap-2">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Social</span>
            </TabsTrigger>
          </TabsList>

          {/* Branding Tab */}
          <TabsContent value="branding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Company Logo
                </CardTitle>
                <CardDescription>
                  Upload your company logo. It will appear in the admin panel and public website header.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted overflow-hidden">
                    {branding.logoUrl ? (
                      <img
                        src={branding.logoUrl}
                        alt="Company logo"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-muted-foreground">GOA</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logo-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                        <Upload className="h-4 w-4" />
                        Upload Logo
                      </div>
                    </Label>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                    <p className="text-xs text-muted-foreground">
                      Recommended: 200x200px, PNG or SVG
                    </p>
                    {branding.logoUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => setBranding({ logoUrl: null })}
                      >
                        Remove logo
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Set your company name and tagline
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={branding.companyName}
                      onChange={(e) => setBranding({ companyName: e.target.value })}
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={branding.tagline}
                      onChange={(e) => setBranding({ tagline: e.target.value })}
                      placeholder="Your company tagline"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Color Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Color Theme
                </CardTitle>
                <CardDescription>
                  Customize primary and accent colors for your website. Changes apply in real-time.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        id="primary-color-picker"
                        className="w-12 h-12 rounded-lg border cursor-pointer"
                        value={hslToHex(branding.primaryColor)}
                        onChange={(e) => setBranding({ primaryColor: hexToHsl(e.target.value) })}
                      />
                      <div className="flex-1 space-y-1">
                        <Input
                          id="primary-color"
                          value={branding.primaryColor}
                          onChange={(e) => setBranding({ primaryColor: e.target.value })}
                          placeholder="220 60% 20%"
                          className="text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                          HSL format: H S% L% (Default: {DEFAULT_COLORS.primaryColor})
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="accent-color">Accent Color</Label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        id="accent-color-picker"
                        className="w-12 h-12 rounded-lg border cursor-pointer"
                        value={hslToHex(branding.accentColor)}
                        onChange={(e) => setBranding({ accentColor: hexToHsl(e.target.value) })}
                      />
                      <div className="flex-1 space-y-1">
                        <Input
                          id="accent-color"
                          value={branding.accentColor}
                          onChange={(e) => setBranding({ accentColor: e.target.value })}
                          placeholder="38 92% 50%"
                          className="text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                          HSL format: H S% L% (Default: {DEFAULT_COLORS.accentColor})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={handleSaveBranding}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Branding
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setBranding({
                        primaryColor: DEFAULT_COLORS.primaryColor,
                        accentColor: DEFAULT_COLORS.accentColor,
                      });
                      toast({
                        title: 'Colors reset',
                        description: 'Colors have been reset to defaults.',
                      });
                    }}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">

            {/* Display Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cog className="h-5 w-5" />
                  Display Settings
                </CardTitle>
                <CardDescription>
                  Configure how data is displayed across the admin panel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="items-per-page">Default Items Per Page</Label>
                    <Select
                      value={String(general.itemsPerPage)}
                      onValueChange={(value) => setGeneral({ itemsPerPage: parseInt(value) })}
                    >
                      <SelectTrigger id="items-per-page">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 items</SelectItem>
                        <SelectItem value="10">10 items</SelectItem>
                        <SelectItem value="25">25 items</SelectItem>
                        <SelectItem value="50">50 items</SelectItem>
                        <SelectItem value="100">100 items</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-format" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date Format
                    </Label>
                    <Select
                      value={general.dateFormat}
                      onValueChange={(value) => setGeneral({ dateFormat: value as DateFormat })}
                    >
                      <SelectTrigger id="date-format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time-format" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Time Format
                    </Label>
                    <Select
                      value={general.timeFormat}
                      onValueChange={(value) => setGeneral({ timeFormat: value as TimeFormat })}
                    >
                      <SelectTrigger id="time-format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12-hour (1:30 PM)</SelectItem>
                        <SelectItem value="24h">24-hour (13:30)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency-format" className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Currency Format
                    </Label>
                    <Select
                      value={general.currencyFormat}
                      onValueChange={(value) => setGeneral({ currencyFormat: value as CurrencyFormat })}
                    >
                      <SelectTrigger id="currency-format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="AUD">AUD (A$)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Auto-Archive Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Archive className="h-5 w-5" />
                  Auto-Archive
                </CardTitle>
                <CardDescription>
                  Automatically archive old applications after a set period
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Auto-Archive</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically archive applications older than the specified days
                    </p>
                  </div>
                  <Switch
                    checked={general.autoArchiveEnabled}
                    onCheckedChange={(checked) => setGeneral({ autoArchiveEnabled: checked })}
                  />
                </div>

                {general.autoArchiveEnabled && (
                  <div className="space-y-4">
                    <Label>Archive After: {general.autoArchiveDays} days</Label>
                    <Slider
                      value={[general.autoArchiveDays]}
                      onValueChange={([value]) => setGeneral({ autoArchiveDays: value })}
                      max={365}
                      min={7}
                      step={1}
                    />
                    <p className="text-xs text-muted-foreground">
                      Applications older than {general.autoArchiveDays} days will be automatically archived
                    </p>
                  </div>
                )}

                <Button onClick={handleSaveGeneral}>
                  <Save className="h-4 w-4 mr-2" />
                  Save General Settings
                </Button>
              </CardContent>
            </Card>

            {/* API Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Data Source
                </CardTitle>
                <CardDescription>
                  Switch between demo data and live backend
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Use Live Data</Label>
                    <p className="text-sm text-muted-foreground">
                      Connect to your backend API instead of demo data
                    </p>
                  </div>
                  <Switch
                    checked={dataMode === 'live'}
                    onCheckedChange={(checked) => setDataMode(checked ? 'live' : 'demo')}
                  />
                </div>
                {dataMode === 'live' && (
                  <div className="space-y-2">
                    <Label htmlFor="api-url">API Base URL</Label>
                    <Input
                      id="api-url"
                      value={apiBaseUrl}
                      onChange={(e) => setApiBaseUrl(e.target.value)}
                      placeholder="https://your-api.com"
                    />
                  </div>
                )}
                <Badge variant={dataMode === 'demo' ? 'secondary' : 'default'}>
                  {dataMode === 'demo' ? 'Using Demo Data' : 'Using Live Data'}
                </Badge>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Notifications
                </CardTitle>
                <CardDescription>
                  Configure when you receive email notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Candidate Applications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive an email when a new candidate applies
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNewCandidates}
                      onCheckedChange={(checked) =>
                        setNotifications({ emailNewCandidates: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Employer Requests</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive an email when an employer submits a request
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNewEmployerRequests}
                      onCheckedChange={(checked) =>
                        setNotifications({ emailNewEmployerRequests: checked })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email Digest Frequency</Label>
                  <Select
                    value={notifications.emailDigestFrequency}
                    onValueChange={(value: any) =>
                      setNotifications({ emailDigestFrequency: value })
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instant">Instant</SelectItem>
                      <SelectItem value="daily">Daily digest</SelectItem>
                      <SelectItem value="weekly">Weekly digest</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Threshold Alerts
                </CardTitle>
                <CardDescription>
                  Get alerted when pending items exceed a threshold
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Threshold Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when pending items exceed the set thresholds
                    </p>
                  </div>
                  <Switch
                    checked={notifications.thresholdAlertEnabled}
                    onCheckedChange={(checked) =>
                      setNotifications({ thresholdAlertEnabled: checked })
                    }
                  />
                </div>

                {notifications.thresholdAlertEnabled && (
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-4">
                      <Label>Candidate Applications Threshold: {notifications.candidateThreshold}</Label>
                      <Slider
                        value={[notifications.candidateThreshold]}
                        onValueChange={([value]) =>
                          setNotifications({ candidateThreshold: value })
                        }
                        max={50}
                        min={1}
                        step={1}
                      />
                      <p className="text-xs text-muted-foreground">
                        Alert when pending candidates exceed {notifications.candidateThreshold}
                      </p>
                    </div>
                    <div className="space-y-4">
                      <Label>Employer Requests Threshold: {notifications.employerThreshold}</Label>
                      <Slider
                        value={[notifications.employerThreshold]}
                        onValueChange={([value]) =>
                          setNotifications({ employerThreshold: value })
                        }
                        max={50}
                        min={1}
                        step={1}
                      />
                      <p className="text-xs text-muted-foreground">
                        Alert when pending requests exceed {notifications.employerThreshold}
                      </p>
                    </div>
                  </div>
                )}

                <Button onClick={handleSaveNotifications}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Notifications
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Admin Roles
                </CardTitle>
                <CardDescription>
                  Role definitions and their permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  {Object.entries(ROLE_PERMISSIONS).map(([role, info]) => (
                    <div key={role} className="p-4 border rounded-lg space-y-2">
                      <Badge variant={role === 'super_admin' ? 'default' : 'secondary'}>
                        {info.label}
                      </Badge>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {info.permissions.map((perm) => (
                          <Badge key={perm} variant="outline" className="text-xs">
                            {perm}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Admin Users
                  </CardTitle>
                  <CardDescription>
                    Manage admin users and their roles
                  </CardDescription>
                </div>
                <Button size="sm" disabled>
                  <Plus className="h-4 w-4 mr-2" />
                  Invite User
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Last Login</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'super_admin' ? 'default' : 'secondary'}>
                            {ROLE_PERMISSIONS[user.role].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleDateString()
                            : 'Never'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            {/* Blog Categories */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Blog Categories
                  </CardTitle>
                  <CardDescription>
                    Manage blog post categories
                  </CardDescription>
                </div>
                <Dialog
                  open={categoryDialog.open}
                  onOpenChange={(open) => {
                    setCategoryDialog({ open, editing: null });
                    if (!open) setCategoryForm({ name: '', slug: '', description: '' });
                  }}
                >
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {categoryDialog.editing ? 'Edit Category' : 'Add Category'}
                      </DialogTitle>
                      <DialogDescription>
                        {categoryDialog.editing
                          ? 'Update the category details'
                          : 'Create a new blog category'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="cat-name">Name</Label>
                        <Input
                          id="cat-name"
                          value={categoryForm.name}
                          onChange={(e) =>
                            setCategoryForm({ ...categoryForm, name: e.target.value })
                          }
                          placeholder="Category name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cat-slug">Slug (optional)</Label>
                        <Input
                          id="cat-slug"
                          value={categoryForm.slug}
                          onChange={(e) =>
                            setCategoryForm({ ...categoryForm, slug: e.target.value })
                          }
                          placeholder="category-slug"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cat-desc">Description (optional)</Label>
                        <Input
                          id="cat-desc"
                          value={categoryForm.description}
                          onChange={(e) =>
                            setCategoryForm({ ...categoryForm, description: e.target.value })
                          }
                          placeholder="Short description"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleSaveCategory}>
                        {categoryDialog.editing ? 'Update' : 'Add'} Category
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                        <TableCell>
                          <Badge variant={category.isDefault ? 'secondary' : 'outline'}>
                            {category.isDefault ? 'Default' : 'Custom'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditCategory(category)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setDeleteDialog({
                                  open: true,
                                  type: 'category',
                                  id: category.id,
                                  name: category.name,
                                })
                              }
                              disabled={category.isDefault}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Experience Levels */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Experience Levels
                  </CardTitle>
                  <CardDescription>
                    Customize experience level labels for job postings
                  </CardDescription>
                </div>
                <Dialog
                  open={experienceDialog.open}
                  onOpenChange={(open) => {
                    setExperienceDialog({ open, editing: null });
                    if (!open) setExperienceForm({ value: '', label: '' });
                  }}
                >
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Level
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {experienceDialog.editing ? 'Edit Experience Level' : 'Add Experience Level'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="exp-value">Value (used in code)</Label>
                        <Input
                          id="exp-value"
                          value={experienceForm.value}
                          onChange={(e) =>
                            setExperienceForm({ ...experienceForm, value: e.target.value })
                          }
                          placeholder="e.g., 0-3"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="exp-label">Display Label</Label>
                        <Input
                          id="exp-label"
                          value={experienceForm.label}
                          onChange={(e) =>
                            setExperienceForm({ ...experienceForm, label: e.target.value })
                          }
                          placeholder="e.g., 0-3 years"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleSaveExperience}>
                        {experienceDialog.editing ? 'Update' : 'Add'} Level
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Value</TableHead>
                      <TableHead>Label</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {experienceLevels.map((level) => (
                      <TableRow key={level.id}>
                        <TableCell className="font-mono">{level.value}</TableCell>
                        <TableCell>{level.label}</TableCell>
                        <TableCell>
                          <Badge variant={level.isDefault ? 'secondary' : 'outline'}>
                            {level.isDefault ? 'Default' : 'Custom'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditExperience(level)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setDeleteDialog({
                                  open: true,
                                  type: 'experience',
                                  id: level.id,
                                  name: level.label,
                                })
                              }
                              disabled={level.isDefault}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Tab */}
          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5" />
                    Social Media Links
                  </CardTitle>
                  <CardDescription>
                    Add custom social media links with any platform
                  </CardDescription>
                </div>
                <Dialog
                  open={socialLinkDialog.open}
                  onOpenChange={(open) => {
                    setSocialLinkDialog({ open, editing: null });
                    if (!open) setSocialForm({ platform: '', url: '', icon: '' });
                  }}
                >
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {socialLinkDialog.editing ? 'Edit Social Link' : 'Add Social Link'}
                      </DialogTitle>
                      <DialogDescription>
                        Add any social media or external link
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="social-platform">Platform Name</Label>
                        <Input
                          id="social-platform"
                          value={socialForm.platform}
                          onChange={(e) =>
                            setSocialForm({ ...socialForm, platform: e.target.value })
                          }
                          placeholder="e.g., LinkedIn, Twitter, WhatsApp"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="social-url">URL</Label>
                        <Input
                          id="social-url"
                          value={socialForm.url}
                          onChange={(e) =>
                            setSocialForm({ ...socialForm, url: e.target.value })
                          }
                          placeholder="https://..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="social-icon">Icon Name (optional)</Label>
                        <Input
                          id="social-icon"
                          value={socialForm.icon}
                          onChange={(e) =>
                            setSocialForm({ ...socialForm, icon: e.target.value })
                          }
                          placeholder="e.g., linkedin, twitter, facebook"
                        />
                        <p className="text-xs text-muted-foreground">
                          Use Lucide icon names. Defaults to lowercase platform name.
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleSaveSocialLink}>
                        {socialLinkDialog.editing ? 'Update' : 'Add'} Link
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Platform</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Enabled</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {socialLinks.map((link) => (
                      <TableRow key={link.id}>
                        <TableCell className="font-medium">{link.platform}</TableCell>
                        <TableCell>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1 max-w-[200px] truncate"
                          >
                            {link.url}
                            <ExternalLink className="h-3 w-3 flex-shrink-0" />
                          </a>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={link.enabled}
                            onCheckedChange={(checked) =>
                              updateSocialLink(link.id, { enabled: checked })
                            }
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditSocialLink(link)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setDeleteDialog({
                                  open: true,
                                  type: 'social',
                                  id: link.id,
                                  name: link.platform,
                                })
                              }
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, type: null, id: null, name: '' })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deleteDialog.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
