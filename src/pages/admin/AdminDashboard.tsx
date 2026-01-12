import { useState, useMemo } from 'react';
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
} from 'lucide-react';
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
import { format, subDays, startOfDay, isAfter, isBefore, isWithinInterval, startOfWeek, startOfMonth, startOfQuarter, startOfYear, eachDayOfInterval, eachWeekOfInterval } from 'date-fns';
import { useJobPostingsStore } from '@/stores/jobPostingsStore';
import { useBlogPostsStore } from '@/stores/blogPostsStore';
import { useEmployerRequestsStore } from '@/stores/employerRequestsStore';
import { CandidateApplication, ExperienceLevel } from '@/types/admin';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

// Mock candidates data
const mockCandidates: CandidateApplication[] = [
  { id: 1, first_name: 'John', last_name: 'Smith', email: 'john.smith@example.com', nationality: 'British', country: 'United Kingdom', location: 'London', experience: '3-7', cv_url: '/uploads/cv-1.docx', cover_letter_url: '/uploads/cl-1.docx', created_at: '2024-01-15T10:30:00Z', updated_at: '2024-01-15T10:30:00Z' },
  { id: 2, first_name: 'Sarah', last_name: 'Johnson', email: 'sarah.j@example.com', nationality: 'American', country: 'United States', location: 'New York', experience: '7-10', cv_url: '/uploads/cv-2.docx', cover_letter_url: '/uploads/cl-2.docx', created_at: '2024-01-14T14:20:00Z', updated_at: '2024-01-14T14:20:00Z' },
  { id: 3, first_name: 'Michael', last_name: 'Chen', email: 'mchen@example.com', nationality: 'Canadian', country: 'Canada', location: 'Toronto', experience: '0-3', cv_url: '/uploads/cv-3.docx', cover_letter_url: '/uploads/cl-3.docx', created_at: '2024-01-13T09:15:00Z', updated_at: '2024-01-13T09:15:00Z' },
  { id: 4, first_name: 'Emma', last_name: 'Wilson', email: 'emma.w@example.com', nationality: 'Australian', country: 'Australia', location: 'Sydney', experience: '10+', cv_url: '/uploads/cv-4.docx', cover_letter_url: '/uploads/cl-4.docx', created_at: '2024-01-12T16:45:00Z', updated_at: '2024-01-12T16:45:00Z' },
  { id: 5, first_name: 'David', last_name: 'Brown', email: 'david.b@example.com', nationality: 'British', country: 'United Kingdom', location: 'Manchester', experience: '3-7', cv_url: '/uploads/cv-5.docx', cover_letter_url: '/uploads/cl-5.docx', created_at: '2024-01-11T11:00:00Z', updated_at: '2024-01-11T11:00:00Z' },
  { id: 6, first_name: 'Lisa', last_name: 'Taylor', email: 'lisa.t@example.com', nationality: 'American', country: 'United States', location: 'Los Angeles', experience: '0-3', cv_url: '/uploads/cv-6.docx', cover_letter_url: '/uploads/cl-6.docx', created_at: '2024-01-10T09:30:00Z', updated_at: '2024-01-10T09:30:00Z' },
  { id: 7, first_name: 'James', last_name: 'Anderson', email: 'james.a@example.com', nationality: 'Canadian', country: 'Canada', location: 'Vancouver', experience: '7-10', cv_url: '/uploads/cv-7.docx', cover_letter_url: '/uploads/cl-7.docx', created_at: '2024-01-09T14:15:00Z', updated_at: '2024-01-09T14:15:00Z' },
];

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
  const { jobs } = useJobPostingsStore();
  const { posts } = useBlogPostsStore();
  const { requests } = useEmployerRequestsStore();
  const candidates = mockCandidates;

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

  // Filter data within date range
  const filterByDateRange = <T extends { created_at: string }>(items: T[]) => {
    if (!dateRange.from || !dateRange.to) return items;
    return items.filter((item) => {
      const created = new Date(item.created_at);
      return isWithinInterval(created, { start: dateRange.from!, end: new Date(dateRange.to!.getTime() + 86400000) });
    });
  };

  const filteredCandidates = filterByDateRange(candidates);
  const filteredRequests = filterByDateRange(requests);

  // Calculate stats for the selected period
  const stats = useMemo(() => {
    return {
      candidates: {
        total: candidates.length,
        inPeriod: filteredCandidates.length,
      },
      jobs: {
        total: jobs.length,
        active: jobs.filter((j) => j.is_active).length,
      },
      employers: {
        total: requests.length,
        inPeriod: filteredRequests.length,
      },
      blog: {
        total: posts.length,
        published: posts.filter((p) => p.is_published).length,
      },
    };
  }, [candidates, jobs, requests, posts, filteredCandidates, filteredRequests]);

  // Activity timeline data for selected period
  const activityData = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return [];
    
    const daysDiff = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / 86400000);
    
    // Use weekly grouping for periods > 30 days
    if (daysDiff > 30) {
      const weeks = eachWeekOfInterval({ start: dateRange.from, end: dateRange.to });
      return weeks.map((weekStart, index) => {
        const weekEnd = weeks[index + 1] || new Date(dateRange.to!.getTime() + 86400000);
        return {
          date: format(weekStart, 'MMM d'),
          candidates: filteredCandidates.filter((c) => {
            const created = new Date(c.created_at);
            return created >= weekStart && created < weekEnd;
          }).length,
          employers: filteredRequests.filter((r) => {
            const created = new Date(r.created_at);
            return created >= weekStart && created < weekEnd;
          }).length,
        };
      });
    }
    
    // Daily grouping for shorter periods
    const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
    return days.map((date) => {
      const dayStart = startOfDay(date);
      const dayEnd = new Date(dayStart.getTime() + 86400000);
      
      return {
        date: format(date, daysDiff <= 7 ? 'EEE' : 'MMM d'),
        candidates: filteredCandidates.filter((c) => {
          const created = new Date(c.created_at);
          return created >= dayStart && created < dayEnd;
        }).length,
        employers: filteredRequests.filter((r) => {
          const created = new Date(r.created_at);
          return created >= dayStart && created < dayEnd;
        }).length,
      };
    });
  }, [dateRange, filteredCandidates, filteredRequests]);

  // Experience distribution (from filtered candidates)
  const experienceData = useMemo(() => {
    const distribution: Record<ExperienceLevel, number> = { '0-3': 0, '3-7': 0, '7-10': 0, '10+': 0 };
    filteredCandidates.forEach((c) => {
      distribution[c.experience]++;
    });
    return [
      { name: '0-3 years', value: distribution['0-3'] },
      { name: '3-7 years', value: distribution['3-7'] },
      { name: '7-10 years', value: distribution['7-10'] },
      { name: '10+ years', value: distribution['10+'] },
    ].filter((d) => d.value > 0);
  }, [filteredCandidates]);

  // Blog categories
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    posts.forEach((p) => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [posts]);

  // Job status data
  const jobStatusData = useMemo(() => [
    { name: 'Active', value: stats.jobs.active, fill: 'hsl(var(--chart-2))' },
    { name: 'Inactive', value: stats.jobs.total - stats.jobs.active, fill: 'hsl(var(--muted))' },
  ], [stats.jobs]);

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

  // Recent activity
  const recentActivity = useMemo(() => {
    const activities: { type: string; title: string; date: string; icon: React.ElementType }[] = [];
    
    candidates.slice(0, 3).forEach((c) => {
      activities.push({
        type: 'candidate',
        title: `${c.first_name} ${c.last_name} applied`,
        date: c.created_at,
        icon: Users,
      });
    });
    
    requests.slice(0, 2).forEach((r) => {
      activities.push({
        type: 'employer',
        title: `${r.firm_name} submitted a request`,
        date: r.created_at,
        icon: Building2,
      });
    });
    
    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [candidates, requests]);

  const handlePresetChange = (value: string) => {
    setDatePreset(value as DatePreset);
    if (value !== 'custom') {
      setCalendarOpen(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with Date Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your recruitment platform activity
            </p>
          </div>
          <div className="flex items-center gap-2">
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
          {quickStats.map((stat) => (
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
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Timeline</CardTitle>
              <CardDescription>Applications and employer requests over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
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

        {/* Charts Row 2 */}
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
                      activity.type === 'candidate' ? 'bg-primary/10' : 'bg-blue-500/10'
                    }`}>
                      <activity.icon className={`h-4 w-4 ${
                        activity.type === 'candidate' ? 'text-primary' : 'text-blue-500'
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

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
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
                  <span>Manage Jobs</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2">
                <Link to="/admin/employers">
                  <Building2 className="h-5 w-5" />
                  <span>Employer Requests</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2">
                <Link to="/admin/blog">
                  <FileText className="h-5 w-5" />
                  <span>Blog Posts</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
