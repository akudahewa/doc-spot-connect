
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UserRole } from '@/api/models';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import axios from 'axios';

// Get API URL from environment variables with fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Detect environment - local by default
const IS_LOVABLE_ENVIRONMENT = window.location.hostname.includes('lovableproject.com') || 
                              window.location.hostname.includes('lovable.app');
// Force local development mode if needed
const LOCAL_DEV_MODE = false;

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication on component mount
    const checkAuth = async () => {
      setIsLoading(true);
      console.log('Checking authentication...');
      
      try {
        // Get token from local storage
        const token = localStorage.getItem('auth_token');
        console.log('Auth token found:', !!token);
        
        if (!token) {
          console.log('No auth token in localStorage');
          throw new Error("No authentication token found");
        }
        
        // Check if we're in a simulated environment
        if (IS_LOVABLE_ENVIRONMENT || LOCAL_DEV_MODE) {
          console.log('Using simulated authentication in development mode');
          const user = JSON.parse(localStorage.getItem('current_user') || '{}');
          if (!user || !user.id) {
            throw new Error("Invalid user session");
          }
          setCurrentUser(user);
          setIsLoading(false);
          return;
        }
        
        // Get current user with token from the API
        console.log('Fetching current user with token from API...');
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.data) {
          console.log('User validation failed');
          throw new Error("Invalid user session");
        }
        
        console.log('User authenticated successfully:', response.data.name);
        
        // Update current user state
        setCurrentUser(response.data);
        
        // Update user data in localStorage in case it changed
        localStorage.setItem('current_user', JSON.stringify(response.data));
        
      } catch (error: any) {
        console.error("Authentication error:", error.message);
        
        // Show toast notification
        toast({
          title: "Session expired",
          description: "Please log in again to continue",
          variant: "destructive"
        });
        
        // Clear authentication data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        
        // Redirect to login
        navigate('/login', { replace: true });
        return;
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out"
    });
    navigate('/login', { replace: true });
  };

  // Check if user has a specific permission
  const hasPermission = (permission: string) => {
    if (IS_LOVABLE_ENVIRONMENT || LOCAL_DEV_MODE) {
      // In development mode, allow all permissions
      return true;
    }
    
    if (!currentUser || !currentUser.permissions) {
      return false;
    }
    
    return currentUser.permissions.includes(permission);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-xl">Loading dashboard...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500">
              Welcome back, {currentUser?.name} ({currentUser?.role.replace('_', ' ')})
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 space-x-2">
            <Button onClick={() => navigate('/admin/profile')} variant="outline">
              Profile
            </Button>
            <Button onClick={handleLogout} variant="outline" className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700">
              Logout
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="dispensaries">Dispensaries</TabsTrigger>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Dispensaries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">4</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Doctors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">3</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Today's Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Completed Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">45</div>
                </CardContent>
              </Card>
            </div>
            
            {/* More dashboard content based on role */}
            {currentUser?.role === UserRole.SUPER_ADMIN && (
              <div className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>System Administration</CardTitle>
                    <CardDescription>Manage users and system settings</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button onClick={() => navigate('/admin/users')} className="w-full">
                      Manage Users
                    </Button>
                    <Button onClick={() => navigate('/admin/roles')} className="w-full">
                      Manage Roles
                    </Button>
                    <Button onClick={() => navigate('/admin/settings')} className="w-full">
                      System Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {currentUser?.role === UserRole.DISPENSARY_ADMIN && (
              <div className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Dispensary Management</CardTitle>
                    <CardDescription>Manage your dispensary operations</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button onClick={() => navigate('/admin/dispensary/doctors')} className="w-full">
                      Manage Doctors
                    </Button>
                    <Button onClick={() => navigate('/admin/dispensary/timeslots')} className="w-full">
                      Manage Time Slots
                    </Button>
                    <Button onClick={() => navigate('/admin/dispensary/staff')} className="w-full">
                      Manage Staff
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {currentUser?.role === UserRole.DISPENSARY_STAFF && (
              <div className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Management</CardTitle>
                    <CardDescription>Manage patient check-ins and appointments</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button onClick={() => navigate('/admin/patients/check-in')} className="w-full">
                      Patient Check-In
                    </Button>
                    <Button onClick={() => navigate('/admin/appointments')} className="w-full">
                      Today's Appointments
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="dispensaries" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Dispensaries Management</CardTitle>
                <CardDescription>View and manage all dispensaries in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Dispensaries list will be displayed here based on user role permissions.</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate('/admin/dispensaries')}>View All Dispensaries</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="doctors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Doctors Management</CardTitle>
                <CardDescription>View and manage all doctors in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Doctors list will be displayed here based on user role permissions.</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate('/admin/doctors')}>View All Doctors</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bookings Management</CardTitle>
                <CardDescription>View and manage all bookings in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Bookings list will be displayed here based on user role permissions.</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate('/admin/bookings')}>View All Bookings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>Generate and view system reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button>Daily Bookings Report</Button>
                  <Button>Monthly Summary Report</Button>
                  <Button>Doctor Performance Report</Button>
                  {currentUser?.role === UserRole.SUPER_ADMIN && (
                    <Button>Dispensary Revenue Report</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
