
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';
import axios from 'axios';

// Get API URL from environment variables with fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Detect environment - local by default
const IS_LOVABLE_ENVIRONMENT = window.location.hostname.includes('lovableproject.com') || 
                              window.location.hostname.includes('lovable.app');
                              
// Force local development mode if needed
const LOCAL_DEV_MODE = false;

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverAvailable, setServerAvailable] = useState(false);
  const [checkingServer, setCheckingServer] = useState(true);
  
  // Check server availability and existing auth
  useEffect(() => {
    const checkServer = async () => {
      // If we're in Lovable's preview environment, don't attempt to connect to the server
      if (IS_LOVABLE_ENVIRONMENT) {
        console.log('Running in Lovable preview environment - API server connection skipped');
        setServerAvailable(false);
        setCheckingServer(false);
        toast({
          title: 'Development Mode',
          description: 'Running in Lovable preview environment. To test with the real API, deploy your server or run locally.',
          variant: 'default'
        });
        return;
      }
      
      try {
        // Try to connect to the API server
        console.log('Checking API server availability at:', API_URL);
        const response = await axios.get(API_URL, { timeout: 5000 });
        console.log('API server response:', response.data);
        setServerAvailable(true);
        console.log('Server connection successful');
        
        // If server is available, check existing auth
        checkExistingAuth();
      } catch (error) {
        console.error('Server connection failed:', error);
        setServerAvailable(false);
        
        if (LOCAL_DEV_MODE) {
          toast({
            title: 'Local Development Mode',
            description: 'Running in local development mode with simulated authentication.',
            variant: 'default'
          });
        } else {
          toast({
            title: 'Server Unavailable',
            description: 'The API server is not running or not reachable. Please check your server or use simulated login.',
            variant: 'default'
          });
        }
      } finally {
        setCheckingServer(false);
      }
    };
    
    checkServer();
  }, []);
  
  const checkExistingAuth = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        // Try using the token with the new API
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data) {
          console.log('Already authenticated as:', response.data.name);
          
          // Store the user data
          localStorage.setItem('current_user', JSON.stringify(response.data));
          
          navigate('/admin/dashboard', { replace: true });
          return;
        }
      } catch (error) {
        console.log('Invalid existing session, proceeding to login');
        // Clear invalid auth data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
      }
    }
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (IS_LOVABLE_ENVIRONMENT || !serverAvailable || LOCAL_DEV_MODE) {
      // In Lovable environment or when server is unavailable, simulate login success
      toast({
        title: 'Development Mode Login',
        description: serverAvailable ? 
          'In development mode, authentication is simulated.' :
          'API server is not available. Using simulated login for development.',
      });
      
      // Mock user for development purposes
      const mockUser = {
        id: '1',
        name: 'Demo Admin',
        email: email || 'admin@example.com',
        role: 'super_admin',
      };
      
      localStorage.setItem('auth_token', 'mock-token-for-development');
      localStorage.setItem('current_user', JSON.stringify(mockUser));
      
      setTimeout(() => navigate('/admin/dashboard', { replace: true }), 300);
      return;
    }
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please enter your email and password',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Attempting login with:', { email });
      console.log('Using API URL:', `${API_URL}/auth/login`);
      
      // Use axios directly instead of the service to ensure we're using the new API
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      console.log('Login response received:', { success: !!response.data.token });
      
      if (!response.data.user || !response.data.token) {
        toast({
          title: 'Login Failed',
          description: response.data.message || 'Invalid credentials',
          variant: 'destructive'
        });
        setIsLoading(false);
        return;
      }
      
      console.log('Login successful, saving auth data...');
      
      // Clear any previous auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
      
      // Save auth token and user info to local storage
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('current_user', JSON.stringify(response.data.user));
      
      console.log('Auth data saved successfully. Token:', response.data.token);
      
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${response.data.user.name}!`
      });
      
      // Wait briefly to ensure localStorage is updated before navigation
      setTimeout(() => {
        console.log('Navigating to dashboard...');
        navigate('/admin/dashboard', { replace: true });
      }, 300);
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      // Handle specific error responses
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your connection.';
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <div className="w-full max-w-md px-4">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-medical-100 p-3 rounded-full">
                  <Lock className="h-6 w-6 text-medical-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
              {(IS_LOVABLE_ENVIRONMENT || LOCAL_DEV_MODE || !serverAvailable) && (
                <p className="text-sm text-amber-600 mt-2">
                  Running in development mode. Login will be simulated.
                </p>
              )}
            </CardHeader>
            <CardContent>
              {!serverAvailable && !IS_LOVABLE_ENVIRONMENT && !checkingServer && (
                <div className="mb-6 p-3 bg-amber-50 border border-amber-200 text-amber-600 rounded-md">
                  <p className="font-medium">API Server Not Available</p>
                  <p className="text-sm mt-1">
                    The API server is not running or not accessible at {API_URL}.<br/>
                    You can proceed with simulated login, or start the server by running:<br />
                    <code className="bg-gray-100 px-2 py-1 rounded">./start-server.sh</code>
                  </p>
                </div>
              )}
              
              {IS_LOVABLE_ENVIRONMENT && (
                <div className="mb-6 p-3 bg-blue-50 border border-blue-200 text-blue-600 rounded-md">
                  <p className="font-medium">Lovable Preview Environment</p>
                  <p className="text-sm mt-1">
                    You're viewing this in the Lovable preview. The login process will be simulated.<br />
                    For full functionality, deploy your API server or run locally.
                  </p>
                </div>
              )}
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button variant="link" className="p-0 h-auto text-xs text-medical-600">
                      Forgot password?
                    </Button>
                  </div>
                  <Input 
                    id="password"
                    type="password" 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-medical-600 hover:bg-medical-700"
                  disabled={isLoading || (checkingServer && !IS_LOVABLE_ENVIRONMENT && !LOCAL_DEV_MODE)}
                >
                  {isLoading ? 'Logging in...' : 
                   (checkingServer && !IS_LOVABLE_ENVIRONMENT && !LOCAL_DEV_MODE) ? 'Checking API...' : 'Login'}
                </Button>
                
                <div className="text-center text-sm text-gray-500">
                  <p>Demo credentials:</p>
                  <p>Email: admin@example.com</p>
                  <p>Password: 123456</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
