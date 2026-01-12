import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useEmployerRequestsStore } from '@/stores/employerRequestsStore';
import { EmployerRequest, ExperienceLevel } from '@/types/admin';
import {
  Building2,
  Search,
  Mail,
  MapPin,
  Briefcase,
  Trash2,
  Eye,
  Users,
  Globe,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const experienceLabels: Record<ExperienceLevel, string> = {
  '0-3': '0-3 years',
  '3-7': '3-7 years',
  '7-10': '7-10 years',
  '10+': '10+ years',
};

export default function EmployerRequestsPage() {
  const { requests, isLoading, fetchRequests, deleteRequest } = useEmployerRequestsStore();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [experienceFilter, setExperienceFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<EmployerRequest | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<EmployerRequest | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Get unique countries for filter
  const countries = [...new Set(requests.map((r) => r.country))].sort();

  // Filter requests
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      searchTerm === '' ||
      request.firm_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.position_title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCountry = countryFilter === 'all' || request.country === countryFilter;
    const matchesExperience =
      experienceFilter === 'all' || request.years_experience === experienceFilter;

    return matchesSearch && matchesCountry && matchesExperience;
  });

  const handleDelete = () => {
    if (requestToDelete) {
      deleteRequest(requestToDelete.id);
      toast({
        title: 'Request deleted',
        description: `Request from ${requestToDelete.firm_name} has been removed.`,
      });
      setDeleteDialogOpen(false);
      setRequestToDelete(null);
    }
  };

  const stats = {
    total: requests.length,
    thisWeek: requests.filter((r) => {
      const created = new Date(r.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return created >= weekAgo;
    }).length,
    uniqueCountries: new Set(requests.map((r) => r.country)).size,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Employer Requests</h1>
          <p className="text-muted-foreground">
            View and manage recruitment requests from employers
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Requests</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>This Week</CardDescription>
              <CardTitle className="text-3xl">{stats.thisWeek}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Countries</CardDescription>
              <CardTitle className="text-3xl">{stats.uniqueCountries}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by firm, email, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="0-3">0-3 years</SelectItem>
                  <SelectItem value="3-7">3-7 years</SelectItem>
                  <SelectItem value="7-10">7-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading requests...
                    </TableCell>
                  </TableRow>
                ) : filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Building2 className="w-8 h-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No requests found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.firm_name}</p>
                          <p className="text-sm text-muted-foreground">{request.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {request.position_title || (
                          <span className="text-muted-foreground">Not specified</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{request.preferred_location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {experienceLabels[request.years_experience]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(request.created_at), 'MMM d, yyyy')}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setRequestToDelete(request);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* View Details Sheet */}
        <Sheet open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <SheetContent className="sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Request Details</SheetTitle>
              <SheetDescription>
                Submitted on{' '}
                {selectedRequest &&
                  format(new Date(selectedRequest.created_at), 'MMMM d, yyyy')}
              </SheetDescription>
            </SheetHeader>
            {selectedRequest && (
              <div className="mt-6 space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                    Company Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{selectedRequest.firm_name}</p>
                        <p className="text-sm text-muted-foreground">Company Name</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{selectedRequest.email}</p>
                        <p className="text-sm text-muted-foreground">Contact Email</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{selectedRequest.country}</p>
                        <p className="text-sm text-muted-foreground">Country</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                    Candidate Requirements
                  </h4>
                  <div className="space-y-3">
                    {selectedRequest.position_title && (
                      <div className="flex items-start gap-3">
                        <Briefcase className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">{selectedRequest.position_title}</p>
                          <p className="text-sm text-muted-foreground">Position Title</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{selectedRequest.preferred_location}</p>
                        <p className="text-sm text-muted-foreground">Preferred Location</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{selectedRequest.preferred_nationality}</p>
                        <p className="text-sm text-muted-foreground">Preferred Nationality</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">
                          {experienceLabels[selectedRequest.years_experience]}
                        </p>
                        <p className="text-sm text-muted-foreground">Experience Required</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedRequest.other_qualifications && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                      Additional Notes
                    </h4>
                    <p className="text-sm bg-muted p-4 rounded-lg">
                      {selectedRequest.other_qualifications}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(`mailto:${selectedRequest.email}`)}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Employer
                  </Button>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Request</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the request from {requestToDelete?.firm_name}?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
