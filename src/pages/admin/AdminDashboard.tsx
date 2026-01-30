import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Users,
  Briefcase,
  Building2,
  FileText,
  Calendar as CalendarIcon,
  TrendingUp,
  History,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format, subDays, startOfDay, startOfQuarter, startOfYear, parseISO } from 'date-fns';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useAuditLogStore, AuditLogEntry } from '@/stores/auditLogStore';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { ApiErrorState } from '@/components/admin/ApiErrorState';

const ACTION_LABELS: Record<AuditLogEntry['action'], string> = {
  create: 'Created',
  update: 'Updated',
  delete: 'Deleted',
  archive: 'Archived',
  deactivate: 'Deactivated',
  activate: 'Activated',
  publish: 'Published',
  unpublish: 'Unpublished',
  download: 'Downloaded',
};

const ACTION_COLORS: Record<AuditLogEntry['action'], string> = {
  create: 'bg-green-500/10 text-green-600',
  update: 'bg-blue-500/10 text-blue-600',
  delete: 'bg-red-500/10 text-red-600',
  archive: 'bg-amber-500/10 text-amber-600',
  deactivate: 'bg-gray-500/10 text-gray-600',
  activate: 'bg-emerald-500/10 text-emerald-600',
  publish: 'bg-purple-500/10 text-purple-600',
  unpublish: 'bg-orange-500/10 text-orange-600',
  download: 'bg-cyan-500/10 text-cyan-600',
};

const MODULE_LABELS: Record<AuditLogEntry['module'], string> = {
  candidates: 'Candidates',
  jobs: 'Jobs',
  employer_requests: 'Employers',
  blog: 'Blog',
};


const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

type DatePreset = '7d' | '30d' | '90d' | 'ytd' | 'custom';

const datePresets: { value: DatePreset; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last quarter' },
  { value: 'ytd', label: 'Year to date' },
  { value: 'custom', label: 'Custom range' },
];

export default function AdminDashboard() {
  const { data, isLoading, error, fetchDashboard } = useDashboardStore();
  const { getRecentLogs, fetchLogs } = useAuditLogStore();
  const { isAdmin, isViewer } = useAdminPermissions();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Date range state
  const [datePreset, setDatePreset] = useState<DatePreset>('30d');
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Calculate date range based on preset
  const dateRange = useMemo(() => {
    const now = new Date();
    const today = startOfDay(now);
    
    switch (datePreset) {
      case '7d':
        return { from: subDays(today, 6), to: today };
      case '30d':
        return { from: subDays(today, 29), to: today };
      case '90d':
        return { from: startOfQuarter(today), to: today };
      case 'ytd':
        return { from: startOfYear(today), to: today };
      case 'custom':
        return customRange?.from && customRange?.to
          ? { from: startOfDay(customRange.from), to: startOfDay(customRange.to) }
          : { from: subDays(today, 29), to: today };
      default:
        return { from: subDays(today, 29), to: today };
    }
  }, [datePreset, customRange]);

  // Fetch dashboard data on mount and when date range changes
  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      fetchDashboard({
        from: format(dateRange.from, 'yyyy-MM-dd'),
        to: format(dateRange.to, 'yyyy-MM-dd'),
      });
    }
    if (isAdmin) {
      fetchLogs();
    }
  }, [fetchDashboard, fetchLogs, isAdmin, dateRange.from, dateRange.to]);

  // Manual refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      fetchDashboard({
        from: format(dateRange.from!, 'yyyy-MM-dd'),
        to: format(dateRange.to!, 'yyyy-MM-dd'),
      }),
      isAdmin ? fetchLogs() : Promise.resolve(),
    ]);
    setIsRefreshing(false);
  };

  // Get recent audit logs (only for super admins)
  const recentAuditLogs = useMemo(() => {
    return isAdmin ? getRecentLogs(5) : [];
  }, [isAdmin, getRecentLogs]);

  // Transform API data to chart formats
  const stats = useMemo(() => ({
    candidates: {
      total: data?.stats.total_candidates ?? 0,
      inPeriod: data?.stats.candidates_in_range ?? 0,
    },
    jobs: {
      total: data?.stats.total_jobs ?? 0,
      active: data?.stats.active_jobs ?? 0,
    },
    employers: {
      total: data?.stats.total_employer_requests ?? 0,
      inPeriod: data?.stats.employer_requests_in_range ?? 0,
    },
    blog: {
      total: data?.stats.total_blog_posts ?? 0,
      published: data?.stats.published_blog_posts ?? 0,
    },
  }), [data]);

  // Activity timeline from API
  const activityData = useMemo(() => {
    if (!data?.charts.candidates_by_date) return [];
    return data.charts.candidates_by_date.map((item) => ({
      date: format(new Date(item.date), 'MMM d'),
      candidates: item.count,
      employers: 0, // API doesn't provide this separately yet
    }));
  }, [data]);

  // Experience distribution from API
  const experienceData = useMemo(() => {
    if (!data?.charts.candidates_by_experience) return [];
    const exp = data.charts.candidates_by_experience;
    return [
      { name: '0-3 years', value: exp['0-3'] || 0 },
      { name: '3-7 years', value: exp['3-7'] || 0 },
      { name: '7-10 years', value: exp['7-10'] || 0 },
      { name: '10+ years', value: exp['10+'] || 0 },
    ].filter((d) => d.value > 0);
  }, [data]);

  // Blog categories from API
  const categoryData = useMemo(() => {
    if (!data?.charts.blog_by_category) return [];
    return Object.entries(data.charts.blog_by_category).map(([name, value]) => ({ name, value }));
  }, [data]);

  // Job status data from API
  const jobStatusData = useMemo(() => [
    { name: 'Active', value: data?.charts.jobs_by_status?.active ?? 0, fill: 'hsl(var(--chart-2))' },
    { name: 'Inactive', value: data?.charts.jobs_by_status?.inactive ?? 0, fill: 'hsl(var(--muted))' },
  ], [data]);

  // Quick stats cards
  const quickStats = [
    {
      title: 'Candidates',
      value: stats.candidates.total,
      change: stats.candidates.inPeriod,
      changeLabel: 'in period',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      href: '/admin/candidates',
    },
    {
      title: 'Job Postings',
      value: stats.jobs.total,
      change: stats.jobs.active,
      changeLabel: 'active',
      icon: Briefcase,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      href: '/admin/jobs',
    },
    {
      title: 'Employer Requests',
      value: stats.employers.total,
      change: stats.employers.inPeriod,
      changeLabel: 'in period',
      icon: Building2,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      href: '/admin/employers',
    },
    {
      title: 'Blog Posts',
      value: stats.blog.total,
      change: stats.blog.published,
      changeLabel: 'published',
      icon: FileText,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      href: '/admin/blog',
    },
  ];

  // Recent activity - using audit logs instead since we don't have individual store data
  const recentActivity = useMemo(() => {
    return recentAuditLogs.slice(0, 5).map((log) => ({
      type: log.module,
      title: `${log.userName} ${(ACTION_LABELS[log.action] ?? log.action ?? 'performed action on').toLowerCase()} ${log.resourceName}`,
      date: log.timestamp,
      icon: log.module === 'candidates' ? Users : log.module === 'jobs' ? Briefcase : log.module === 'employer_requests' ? Building2 : FileText,
    }));
  }, [recentAuditLogs]);

  const handlePresetChange = (value: string) => {
    setDatePreset(value as DatePreset);
    if (value !== 'custom') {
      setCalendarOpen(false);
    }
  };

  return (
    <AdminLayout>
      {error ? (
        <ApiErrorState
          title="Failed to load dashboard"
          message={error}
          onRetry={handleRefresh}
        />
      ) : (
      <div className="space-y-6 relative">
        {/* Refresh overlay */}
        {isRefreshing && data && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] z-10 flex items-start justify-center pt-32 animate-fade-in">
            <div className="flex items-center gap-3 bg-card border rounded-lg px-4 py-3 shadow-lg">
              <RefreshCw className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm font-medium">Refreshing data...</span>
            </div>
          </div>
        )}
        {/* Header with Date Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your recruitment platform activity
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh data"
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            </Button>
            <Select value={datePreset} onValueChange={handlePresetChange}>
              <SelectTrigger className="w-[160px]">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {datePresets.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {datePreset === 'custom' && (
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customRange?.from ? (
                      customRange.to ? (
                        <>
                          {format(customRange.from, 'LLL dd')} - {format(customRange.to, 'LLL dd')}
                        </>
                      ) : (
                        format(customRange.from, 'LLL dd, y')
                      )
                    ) : (
                      <span>Pick dates</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={customRange?.from}
                    selected={customRange}
                    onSelect={setCustomRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        {/* Period indicator */}
        {dateRange.from && dateRange.to && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>
              Showing data from {format(dateRange.from, 'MMM d, yyyy')} to {format(dateRange.to, 'MMM d, yyyy')}
            </span>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            // Loading skeleton for stats cards
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-8 w-12" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-12 w-12 rounded-lg" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            quickStats.map((stat) => (
              <Link key={stat.title} to={stat.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {stat.change} {stat.changeLabel}
                          </Badge>
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>

        {/* Charts Row 1 - Hidden for viewers (minimal dashboard) */}
        {!isViewer && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Timeline</CardTitle>
              <CardDescription>Applications and employer requests over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                {isLoading ? (
                  <div className="flex flex-col gap-4 h-full justify-center">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="candidates"
                        stackId="1"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.6}
                        name="Candidates"
                      />
                      <Area
                        type="monotone"
                        dataKey="employers"
                        stackId="1"
                        stroke="hsl(var(--chart-2))"
                        fill="hsl(var(--chart-2))"
                        fillOpacity={0.6}
                        name="Employer Requests"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Experience Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Candidate Experience</CardTitle>
              <CardDescription>Distribution of candidates by experience level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                {experienceData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No candidates in selected period
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={experienceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {experienceData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Charts Row 2 - Hidden for viewers (minimal dashboard) */}
        {!isViewer && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Job Postings</CardTitle>
              <CardDescription>Active vs inactive jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={jobStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {jobStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Blog Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Blog Categories</CardTitle>
              <CardDescription>Posts by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={100}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Latest platform activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'candidates' ? 'bg-primary/10' : 
                      activity.type === 'jobs' ? 'bg-green-500/10' :
                      activity.type === 'employer_requests' ? 'bg-blue-500/10' : 'bg-amber-500/10'
                    }`}>
                      <activity.icon className={`h-4 w-4 ${
                        activity.type === 'candidates' ? 'text-primary' : 
                        activity.type === 'jobs' ? 'text-green-500' :
                        activity.type === 'employer_requests' ? 'text-blue-500' : 'text-amber-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(activity.date), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Audit Log Widget - Only for Super Admins */}
        {isAdmin && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Recent Admin Actions
                </CardTitle>
                <CardDescription>Latest changes made by administrators</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/audit-log" className="flex items-center gap-1">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentAuditLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No audit logs yet</p>
                  <p className="text-xs">Actions will appear here as they occur</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAuditLogs.map((log) => (
                    <div key={log.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-medium text-primary">
                          {log.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">{log.userName}</span>
                          <Badge className={cn("text-xs", ACTION_COLORS[log.action])}>
                            {ACTION_LABELS[log.action]}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {MODULE_LABELS[log.module]}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {log.resourceName}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(parseISO(log.timestamp), 'MMM d, h:mm a')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{isViewer ? 'Quick Links' : 'Quick Actions'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2">
                <Link to="/admin/candidates">
                  <Users className="h-5 w-5" />
                  <span>View Candidates</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2">
                <Link to="/admin/jobs">
                  <Briefcase className="h-5 w-5" />
                  <span>{isViewer ? 'View Jobs' : 'Manage Jobs'}</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2">
                <Link to="/admin/employers">
                  <Building2 className="h-5 w-5" />
                  <span>{isViewer ? 'View Requests' : 'Employer Requests'}</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2">
                <Link to="/admin/blog">
                  <FileText className="h-5 w-5" />
                  <span>{isViewer ? 'View Blog' : 'Blog Posts'}</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      )}
    </AdminLayout>
  );
}
