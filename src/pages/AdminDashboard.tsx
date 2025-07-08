import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Building2, 
  Calendar, 
  TrendingUp, 
  UserCheck, 
  Stethoscope,
  ClipboardList,
  Settings,
  BarChart3,
  AlertCircle,
  Clock,
  DollarSign,
  Activity
} from 'lucide-react';
import { User, UserRole, Doctor, Dispensary } from '@/api/models';
import { AuthService, DoctorService, DispensaryService, BookingService } from '@/api/services';
import UserManagement from '@/components/admin/UserManagement';
import RoleAssignment from '@/components/admin/RoleAssignment';
import ReportGenerator from '@/components/admin/ReportGenerator';
import DoctorDispensaryFeeManager from '@/components/admin/DoctorDispensaryFeeManager';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalDoctors, setTotalDoctors] = useState<number>(0);
  const [totalDispensaries, setTotalDispensaries] = useState<number>(0);
  const [totalAppointments, setTotalAppointments] = useState<number>(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0);
  const [weeklyActivity, setWeeklyActivity] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [recentSignups, setRecentSignups] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch current user
        const token = AuthService.getToken();
        if (!token) {
          throw new Error('Not authenticated');
        }

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.userId;

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const userData = await response.json();
        setCurrentUser(userData);

        // Fetch dashboard stats
        const statsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/admin/dashboard-stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!statsResponse.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }

        const statsData = await statsResponse.json();
        setTotalUsers(statsData.totalUsers);
        setTotalDoctors(statsData.totalDoctors);
        setTotalDispensaries(statsData.totalDispensaries);
        setTotalAppointments(statsData.totalAppointments);
        setMonthlyRevenue(statsData.monthlyRevenue);
        setWeeklyActivity(statsData.weeklyActivity);
        setRecentSignups(statsData.recentSignups);

      } catch (err: any) {
        console.error('Error fetching admin data:', err);
        setError(err.message || 'Failed to fetch data');
        toast.error(err.message || 'Failed to fetch data');
        AuthService.logout();
        window.location.href = '/';
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!currentUser) return false;
    
    // Super admin has all permissions
    if (currentUser.role === UserRole.SUPER_ADMIN) return true;
    
    // Hospital admin has specific permissions
    if (currentUser.role === UserRole.HOSPITAL_ADMIN) {
      return requiredRole === UserRole.HOSPITAL_ADMIN || requiredRole === UserRole.DOCTOR || requiredRole === UserRole.PATIENT;
    }
    
    return currentUser.role === requiredRole;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-5">
        Admin Dashboard
      </h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-700">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-green-500" />
              Total Doctors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-700">{totalDoctors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-500" />
              Total Dispensaries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-700">{totalDispensaries}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              Total Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-700">{totalAppointments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">${monthlyRevenue}</div>
            <p className="text-sm text-gray-500">
              <TrendingUp className="h-4 w-4 inline-block mr-1" />
              32% increase from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-red-500" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart3 className="h-48 w-full text-gray-400" />
            <div className="text-sm text-gray-500 text-center">
              Past 7 Days
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Signups */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-purple-500" />
            Recent Signups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Signed Up
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentSignups.map((user) => (
                  <tr key={user.id}>
                    <td className="px-5 py-5 border-b text-sm">
                      <div className="flex items-center">
                        <div className="ml-3">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {user.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{user.email}</p>
                    </td>
                    <td className="px-5 py-5 border-b text-sm">
                      <Badge>{user.role}</Badge>
                    </td>
                    <td className="px-5 py-5 border-b text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        <Clock className="h-4 w-4 inline-block mr-1" />
                        Just now
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Management */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          {hasPermission(UserRole.SUPER_ADMIN) && (
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-1" />
              User Management
            </TabsTrigger>
          )}
          {hasPermission(UserRole.SUPER_ADMIN) && (
            <TabsTrigger value="roles">
              <Shield className="h-4 w-4 mr-1" />
              Role Assignment
            </TabsTrigger>
          )}
          {hasPermission(UserRole.HOSPITAL_ADMIN) && (
            <TabsTrigger value="fees">
              <DollarSign className="h-4 w-4 mr-1" />
              Doctor Fees
            </TabsTrigger>
          )}
          {hasPermission(UserRole.HOSPITAL_ADMIN) && (
            <TabsTrigger value="reports">
              <ClipboardList className="h-4 w-4 mr-1" />
              Reports
            </TabsTrigger>
          )}
        </TabsList>
        
        {hasPermission(UserRole.SUPER_ADMIN) && (
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
        )}
        {hasPermission(UserRole.SUPER_ADMIN) && (
          <TabsContent value="roles">
            <RoleAssignment />
          </TabsContent>
        )}
        {hasPermission(UserRole.HOSPITAL_ADMIN) && (
          <TabsContent value="fees">
            <DoctorDispensaryFeeManager />
          </TabsContent>
        )}
        {hasPermission(UserRole.HOSPITAL_ADMIN) && (
          <TabsContent value="reports">
            <ReportGenerator />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
