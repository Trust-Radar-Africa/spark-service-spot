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
} from '@/stores/settingsStore';
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
} from 'lucide-react';

export default function SettingsPage() {
  const { toast } = useToast();
  const {
    branding,
    setBranding,
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
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto">
            <TabsTrigger value="branding" className="gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Branding</span>
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
                <Button onClick={handleSaveBranding}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Branding
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
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
                <p className="text-sm text-muted-foreground mb-4">
                  User management requires Laravel backend integration. Configure this in your Laravel admin panel.
                </p>
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
