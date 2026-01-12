import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

export default function EmployerRequestsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Employer Requests</h1>
          <p className="text-muted-foreground">View and manage recruitment requests from employers</p>
        </div>

        <Card>
          <CardHeader className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription className="max-w-md mx-auto">
              This module is currently being developed. You will be able to view and filter employer recruitment requests here.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </AdminLayout>
  );
}
