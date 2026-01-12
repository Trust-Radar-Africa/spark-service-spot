import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';

export default function JobPostingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Job Postings</h1>
          <p className="text-muted-foreground">Create and manage job advertisements</p>
        </div>

        <Card>
          <CardHeader className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription className="max-w-md mx-auto">
              This module is currently being developed. You will be able to create, edit, and delete job postings here.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </AdminLayout>
  );
}
