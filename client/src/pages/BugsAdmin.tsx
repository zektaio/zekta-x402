import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bug, Plus, AlertCircle, CheckCircle2, Clock, ListChecks, Lock, Unlock, Trash2 } from 'lucide-react';
import { Link } from 'wouter';
import { format } from 'date-fns';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface BugReport {
  id: number;
  twitterHandle: string | null;
  bugDescription: string;
  status: 'new' | 'in_progress' | 'fixed';
  createdAt: string;
}

const statusConfig = {
  new: {
    label: 'New',
    icon: AlertCircle,
    className: 'bg-red-500/10 text-red-500 border-red-500/20',
  },
  in_progress: {
    label: 'In Progress',
    icon: Clock,
    className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  },
  fixed: {
    label: 'Fixed',
    icon: CheckCircle2,
    className: 'bg-green-500/10 text-green-500 border-green-500/20',
  },
};

export default function BugsAdmin() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'fixed'>('all');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Check if admin is authenticated
  useEffect(() => {
    const savedPassword = localStorage.getItem('bugAdminPassword');
    if (savedPassword) {
      setAdminPassword(savedPassword);
      setIsAuthenticated(true);
    }
  }, []);

  // Admin login handler
  const handleAdminLogin = () => {
    if (!adminPassword.trim()) {
      toast({
        title: "Error",
        description: "Please enter admin password",
        variant: "destructive",
      });
      return;
    }
    localStorage.setItem('bugAdminPassword', adminPassword);
    setIsAuthenticated(true);
    toast({
      title: "Success",
      description: "Admin access granted",
    });
  };

  // Admin logout handler
  const handleAdminLogout = () => {
    localStorage.removeItem('bugAdminPassword');
    setIsAuthenticated(false);
    setAdminPassword('');
    toast({
      title: "Logged out",
      description: "Admin session ended",
    });
  };

  // Update bug status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const password = localStorage.getItem('bugAdminPassword');
      return apiRequest('PATCH', '/api/bugs/' + id, {
        status,
        adminPassword: password
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bugs'] });
      toast({
        title: "Success",
        description: "Bug status updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update bug status",
        variant: "destructive",
      });
      // If unauthorized, log out
      if (error.message?.includes('Unauthorized')) {
        handleAdminLogout();
      }
    },
  });

  // Delete bug mutation
  const deleteBugMutation = useMutation({
    mutationFn: async (id: number) => {
      const password = localStorage.getItem('bugAdminPassword');
      return apiRequest('DELETE', '/api/bugs/' + id, {
        adminPassword: password
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bugs'] });
      toast({
        title: "Success",
        description: "Bug report deleted",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete bug report",
        variant: "destructive",
      });
      // If unauthorized, log out
      if (error.message?.includes('Unauthorized')) {
        handleAdminLogout();
      }
    },
  });

  // Always fetch all bugs
  const { data, isLoading } = useQuery<{ ok: boolean; bugs: BugReport[] }>({
    queryKey: ['/api/bugs'],
    queryFn: async () => {
      const response = await fetch('/api/bugs');
      return response.json();
    },
  });

  const allBugs = data?.bugs || [];

  // Calculate counts from all bugs
  const bugCounts = {
    all: allBugs.length,
    new: allBugs.filter(b => b.status === 'new').length,
    in_progress: allBugs.filter(b => b.status === 'in_progress').length,
    fixed: allBugs.filter(b => b.status === 'fixed').length,
  };

  // Client-side filtering
  const bugs = statusFilter === 'all' 
    ? allBugs 
    : allBugs.filter(b => b.status === statusFilter);

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {/* Title Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-100">
                  <ListChecks className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Bug Reports
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Track and monitor reported issues
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isAuthenticated && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAdminLogout}
                    className="text-gray-700 border-gray-300"
                    data-testid="button-admin-logout"
                  >
                    <Unlock className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                )}
                <Link href="/bugs">
                  <Button variant="outline" size="sm" className="text-gray-700 border-gray-300" data-testid="button-view-public">
                    View Public
                  </Button>
                </Link>
                <Link href="/report-bug">
                  <Button variant="outline" size="sm" className="text-gray-700 border-gray-300" data-testid="button-report-bug">
                    <Plus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Report</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Admin Login Form */}
            {!isAuthenticated && (
              <Card className="border-gray-200 bg-blue-50 shadow-sm mb-4">
                <CardContent className="py-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Admin Authentication Required</h3>
                  <div className="flex items-center gap-2">
                    <Input
                      type="password"
                      placeholder="Admin password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                      className="flex-1"
                      data-testid="input-admin-password"
                    />
                    <Button 
                      size="sm" 
                      onClick={handleAdminLogin}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      data-testid="button-admin-submit"
                    >
                      Login
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Status Filter Tabs */}
          <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <TabsList className="grid w-full grid-cols-4 h-9" data-testid="tabs-bug-filter">
              <TabsTrigger value="all" className="text-xs sm:text-sm" data-testid="tab-all">
                All {bugCounts.all > 0 && `(${bugCounts.all})`}
              </TabsTrigger>
              <TabsTrigger value="new" className="text-xs sm:text-sm" data-testid="tab-new">
                New {bugCounts.new > 0 && `(${bugCounts.new})`}
              </TabsTrigger>
              <TabsTrigger value="in_progress" className="text-xs sm:text-sm" data-testid="tab-in-progress">
                <span className="hidden sm:inline">In Progress</span>
                <span className="sm:hidden">Progress</span>
                {bugCounts.in_progress > 0 && ` (${bugCounts.in_progress})`}
              </TabsTrigger>
              <TabsTrigger value="fixed" className="text-xs sm:text-sm" data-testid="tab-fixed">
                Fixed {bugCounts.fixed > 0 && `(${bugCounts.fixed})`}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">

        {/* Bug List */}
        {isLoading ? (
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardContent className="py-8 text-center">
              <div className="inline-block w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="mt-3 text-sm text-gray-600">Loading bugs...</p>
            </CardContent>
          </Card>
        ) : bugs.length === 0 ? (
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardContent className="py-8 text-center">
              <Bug className="w-10 h-10 mx-auto mb-3 text-gray-400" />
              <h3 className="text-base font-semibold text-gray-900 mb-1">No bugs found</h3>
              <p className="text-sm text-gray-600 mb-4">
                {statusFilter === 'all' 
                  ? "No bugs have been reported yet" 
                  : `No ${statusFilter.replace('_', ' ')} bugs`}
              </p>
              <Link href="/report-bug">
                <Button variant="outline" size="sm" className="border-gray-300 text-gray-700" data-testid="button-report-first-bug">
                  <Plus className="w-4 h-4 mr-2" />
                  Report First Bug
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {bugs.map((bug) => {
              const StatusIcon = statusConfig[bug.status].icon;
              return (
                <Card 
                  key={bug.id}
                  className="border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow cursor-default" 
                  data-testid={`card-bug-${bug.id}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          {isAuthenticated ? (
                            <Select
                              value={bug.status}
                              onValueChange={(newStatus) => updateStatusMutation.mutate({ id: bug.id, status: newStatus })}
                              disabled={updateStatusMutation.isPending}
                            >
                              <SelectTrigger className={`w-32 h-6 text-xs ${statusConfig[bug.status].className} border-0`} data-testid={`select-status-${bug.id}`}>
                                <div className="flex items-center gap-1">
                                  <StatusIcon className="w-3 h-3" />
                                  <SelectValue />
                                </div>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="fixed">Fixed</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge 
                              variant="outline" 
                              className={statusConfig[bug.status].className}
                              data-testid={`badge-status-${bug.id}`}
                            >
                              <StatusIcon className="w-3 h-3 mr-1" />
                              <span className="text-xs">{statusConfig[bug.status].label}</span>
                            </Badge>
                          )}
                          {bug.twitterHandle && (
                            <span className="text-xs text-gray-600" data-testid={`text-twitter-${bug.id}`}>
                              @{bug.twitterHandle}
                            </span>
                          )}
                        </div>
                        <CardDescription className="text-xs text-gray-500" data-testid={`text-date-${bug.id}`}>
                          {format(new Date(bug.createdAt), 'MMM d, yyyy • h:mm a')}
                        </CardDescription>
                      </div>
                      <span className="text-gray-500 text-xs font-mono shrink-0" data-testid={`text-id-${bug.id}`}>
                        #{bug.id}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2 pb-3">
                    <p 
                      className="text-sm text-gray-700 whitespace-pre-wrap break-words leading-relaxed mb-3" 
                      data-testid={`text-description-${bug.id}`}
                    >
                      {bug.bugDescription}
                    </p>
                    {isAuthenticated && (
                      <div className="flex justify-end pt-2 border-t border-gray-100">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (window.confirm('Delete this bug report? This cannot be undone.')) {
                              deleteBugMutation.mutate(bug.id);
                            }
                          }}
                          disabled={deleteBugMutation.isPending}
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                          data-testid={`button-delete-${bug.id}`}
                        >
                          <Trash2 className="w-3 h-3 mr-1.5" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Stats Footer */}
        {bugs.length > 0 && (
          <Card className="mt-4 border-gray-200 bg-gray-50 shadow-sm">
            <CardContent className="py-3">
              <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-semibold text-gray-900">{bugCounts.all}</span>
                </div>
                <div className="w-px h-3 bg-gray-300" />
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-600">New:</span>
                  <span className="font-semibold text-red-600">{bugCounts.new}</span>
                </div>
                <div className="w-px h-3 bg-gray-300" />
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-600 hidden sm:inline">In Progress:</span>
                  <span className="text-gray-600 sm:hidden">Progress:</span>
                  <span className="font-semibold text-yellow-600">{bugCounts.in_progress}</span>
                </div>
                <div className="w-px h-3 bg-gray-300" />
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-600">Fixed:</span>
                  <span className="font-semibold text-green-600">{bugCounts.fixed}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
