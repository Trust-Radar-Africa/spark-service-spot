import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Briefcase,
  Building2,
  FileText,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  CheckCircle,
  Clock,
  Globe,
  Calendar,
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
import { format, subDays, startOfDay, isAfter } from 'date-fns';
import { useJobPostingsStore } from '@/stores/jobPostingsStore';
import { useBlogPostsStore } from '@/stores/blogPostsStore';
import { useEmployerRequestsStore } from '@/stores/employerRequestsStore';
import { CandidateApplication, ExperienceLevel } from '@/types/admin';

// Mock candidates data (same as in CandidatesPage)
const mockCandidates: CandidateApplication[] = [
  { id: 1, first_name: 'John', last_name: 'Smith', email: 'john.smith@example.com', nationality: 'British', experience: '3-7', cv_url: '/uploads/cv-1.docx', cover_letter_url: '/uploads/cl-1.docx', created_at: '2024-01-15T10:30:00Z', updated_at: '2024-01-15T10:30:00Z' },
  { id: 2, first_name: 'Sarah', last_name: 'Johnson', email: 'sarah.j@example.com', nationality: 'American', experience: '7-10', cv_url: '/uploads/cv-2.docx', cover_letter_url: '/uploads/cl-2.docx', created_at: '2024-01-14T14:20:00Z', updated_at: '2024-01-14T14:20:00Z' },
  { id: 3, first_name: 'Michael', last_name: 'Chen', email: 'mchen@example.com', nationality: 'Canadian', experience: '0-3', cv_url: '/uploads/cv-3.docx', cover_letter_url: '/uploads/cl-3.docx', created_at: '2024-01-13T09:15:00Z', updated_at: '2024-01-13T09:15:00Z' },
  { id: 4, first_name: 'Emma', last_name: 'Wilson', email: 'emma.w@example.com', nationality: 'Australian', experience: '10+', cv_url: '/uploads/cv-4.docx', cover_letter_url: '/uploads/cl-4.docx', created_at: '2024-01-12T16:45:00Z', updated_at: '2024-01-12T16:45:00Z' },
  { id: 5, first_name: 'David', last_name: 'Brown', email: 'david.b@example.com', nationality: 'British', experience: '3-7', cv_url: '/uploads/cv-5.docx', cover_letter_url: '/uploads/cl-5.docx', created_at: '2024-01-11T11:00:00Z', updated_at: '2024-01-11T11:00:00Z' },
  { id: 6, first_name: 'Lisa', last_name: 'Taylor', email: 'lisa.t@example.com', nationality: 'American', experience: '0-3', cv_url: '/uploads/cv-6.docx', cover_letter_url: '/uploads/cl-6.docx', created_at: '2024-01-10T09:30:00Z', updated_at: '2024-01-10T09:30:00Z' },
  { id: 7, first_name: 'James', last_name: 'Anderson', email: 'james.a@example.com', nationality: 'Canadian', experience: '7-10', cv_url: '/uploads/cv-7.docx', cover_letter_url: '/uploads/cl-7.docx', created_at: '2024-01-09T14:15:00Z', updated_at: '2024-01-09T14:15:00Z' },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export default function AdminDashboard() {
  const { jobs } = useJobPostingsStore();
  const { posts } = useBlogPostsStore();
  const { requests } = useEmployerRequestsStore();
  const candidates = mockCandidates;

  // Calculate stats
  const stats = useMemo(() => {
    const weekAgo = subDays(new Date(), 7);
    
    return {
      candidates: {
        total: candidates.length,
        thisWeek: candidates.filter((c) => isAfter(new Date(c.created_at), weekAgo)).length,
      },
      jobs: {
        total: jobs.length,
        active: jobs.filter((j) => j.is_active).length,
      },
      employers: {
        total: requests.length,
        thisWeek: requests.filter((r) => isAfter(new Date(r.created_at), weekAgo)).length,
      },
      blog: {
        total: posts.length,
        published: posts.filter((p) => p.is_published).length,
      },
    };
  }, [candidates, jobs, requests, posts]);

  // Activity timeline data (last 7 days)
  const activityData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dayStart = startOfDay(date);
      const dayEnd = startOfDay(subDays(date, -1));
      
      return {
        date: format(date, 'MMM d'),
        candidates: candidates.filter((c) => {
          const created = new Date(c.created_at);
          return created >= dayStart && created < dayEnd;
        }).length,
        employers: requests.filter((r) => {
          const created = new Date(r.created_at);
          return created >= dayStart && created < dayEnd;
        }).length,
      };
    });
    return days;
  }, [candidates, requests]);

  // Experience distribution
  const experienceData = useMemo(() => {
    const distribution: Record<ExperienceLevel, number> = { '0-3': 0, '3-7': 0, '7-10': 0, '10+': 0 };
    candidates.forEach((c) => {
      distribution[c.experience]++;
    });
    return [
      { name: '0-3 years', value: distribution['0-3'] },
      { name: '3-7 years', value: distribution['3-7'] },
      { name: '7-10 years', value: distribution['7-10'] },
      { name: '10+ years', value: distribution['10+'] },
    ].filter((d) => d.value > 0);
  }, [candidates]);

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
      change: stats.candidates.thisWeek,
      changeLabel: 'this week',
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
      change: stats.employers.thisWeek,
      changeLabel: 'this week',
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your recruitment platform activity
          </p>
        </div>

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
              <CardTitle className="text-lg">Weekly Activity</CardTitle>
              <CardDescription>Applications and employer requests over the past week</CardDescription>
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
