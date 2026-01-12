import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  FileText,
  LogOut,
  Menu,
  X,
  Settings,
  ChevronDown,
} from 'lucide-react';
import NotificationsDropdown from './NotificationsDropdown';
import { ThemeToggle } from './ThemeToggle';
import { useSettingsStore } from '@/stores/settingsStore';

interface AdminLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Candidates', href: '/admin/candidates', icon: Users },
  { name: 'Job Postings', href: '/admin/jobs', icon: Briefcase },
  { name: 'Employer Requests', href: '/admin/employers', icon: Building2 },
  { name: 'Blog Posts', href: '/admin/blog', icon: FileText },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAdminAuth();
  const { branding } = useSettingsStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  // Common user section component for sidebar
  const UserSection = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={cn(
      "border-t bg-card/50",
      isMobile ? "p-3" : "p-4"
    )}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-sm font-medium text-primary">
            {user?.name?.charAt(0) || 'A'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{user?.name || 'Admin'}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Link
          to="/admin/settings"
          onClick={() => setMobileMenuOpen(false)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
            location.pathname === '/admin/settings'
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar for mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        {/* Centered logo on mobile */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-primary/10">
            {branding.logoUrl ? (
              <img 
                src={branding.logoUrl} 
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-sm font-bold text-primary">GOA</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <NotificationsDropdown />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {user?.name?.charAt(0) || 'A'}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover border shadow-lg z-50">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/admin/settings" className="flex items-center cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Desktop top bar - aligned with sidebar border */}
      <div className="hidden lg:flex fixed top-0 left-64 right-0 z-30 bg-card border-b h-14 px-6 items-center justify-end gap-2">
        <ThemeToggle />
        <NotificationsDropdown />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 px-2 gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium leading-none">{user?.name || 'Admin'}</p>
                <p className="text-xs text-muted-foreground leading-none mt-0.5">{user?.email}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover border shadow-lg z-50">
            <DropdownMenuItem asChild>
              <Link to="/admin/settings" className="flex items-center cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Branding - same height as top bar */}
          <div className="h-14 px-4 border-b flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
              {branding.logoUrl ? (
                <img 
                  src={branding.logoUrl} 
                  alt="Company logo" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-lg font-bold text-primary">GOA</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground leading-tight line-clamp-2">
                {branding.tagline}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href === '/admin' && location.pathname === '/admin/dashboard');
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section at bottom */}
          <UserSection />
        </div>
      </aside>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:pl-64 pt-14">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
