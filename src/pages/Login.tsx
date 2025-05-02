
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';
import axios from 'axios';

// Get API URL from environment variables with fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverAvailable, setServerAvailable] = useState(false);
  const [auth0Config, setAuth0Config] = useState<any>(null);
  const [serverStatusMessage, setServerStatusMessage] = useState('Checking server availability...');
  
  // Check server availability and existing auth
  useEffect(() => {
    const checkServer = async () => {
      try {
        // Try to connect to the API server
        console.log('Checking API server availability at:', API_URL);
        const response = await axios.get(API_URL, { timeout: 5000 });
        console.log('API server response:', response.data);
        setServerAvailable(true);
        setServerStatusMessage('Server connected successfully');
        
        // Get Auth0 configuration
        try {
          const auth0Response = await axios.get(`${API_URL}/auth/config`);
          console.log('Auth0 config received:', auth0Response.data);
          setAuth0Config(auth0Response.data);
        } catch (error) {
          console.error('Failed to get Auth0 configuration:', error);
          setServerStatusMessage('Connected, but failed to get Auth0 config');
        }
        
        // Check existing auth
        checkExistingAuth();
      } catch (error) {
        console.error('Server connection failed:', error);
        setServerAvailable(false);
        setServerStatusMessage(`Server connection failed: ${(error as any)?.message || 'Unknown error'}`);
        
        toast({
          title: 'Server Unavailable',
          description: 'The API server is not running or not reachable. Please check your server.',
          variant: 'destructive'
        });
      }
    };
    
    checkServer();
  }, []);
  
  const checkExistingAuth = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        // Try using the token with the API
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data) {
          console.log('Already authenticated as:', response.data.name);
          localStorage.setItem('current_user', JSON.stringify(response.data));
          navigate('/admin/dashboard', { replace: true });
        }
      } catch (error) {
        console.log('Invalid existing session, proceeding to login');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
      }
    }
  };
  
  // Function to handle Auth0 login
  const handleAuth0Login = () => {
    setIsLoading(true);
    
    if (!auth0Config) {
      toast({
        title: 'Error',
        description: 'Auth0 configuration not available',
        variant: 'destructive'
      });
      setIsLoading(false);
      return;
    }
    
    console.log('Auth0 config for login:', auth0Config);
    
    // Construct Auth0 authorization URL with the correct callback URL
    const redirectUri = `${window.location.origin}/callback`;
    console.log('Using redirect URI:', redirectUri);
    
    const authUrl = `https://${auth0Config.domain}/authorize?` +
      `response_type=code&` +
      `client_id=${auth0Config.clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `audience=${encodeURIComponent(auth0Config.audience)}&` +
      `scope=openid profile email&` +
      `state=${encodeURIComponent(window.location.origin)}`;
    
    console.log('Redirecting to Auth0 URL:', authUrl);
    
    // Redirect to Auth0 login page
    window.location.href = authUrl;
  };
  
  // Dev mode login for development only
  const handleDevLogin = () => {
    if (process.env.NODE_ENV !== 'development' && import.meta.env.DEV !== true) {
      return;
    }
    
    localStorage.setItem('auth_token', 'dev-token');
    localStorage.setItem('current_user', JSON.stringify({
      id: 'dev-user-id',
      name: 'Development Admin',
      email: 'dev@example.com',
      role: 'super_admin'
    }));
    
    toast({
      title: 'Dev Login Successful',
      description: 'You are now logged in as a development admin'
    });
    
    navigate('/admin/dashboard', { replace: true });
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
            </CardHeader>
            <CardContent>
              {!serverAvailable && (
                <div className="mb-6 p-3 bg-amber-50 border border-amber-200 text-amber-600 rounded-md">
                  <p className="font-medium">API Server Status</p>
                  <p className="text-sm mt-1">{serverStatusMessage}</p>
                  <p className="text-sm mt-2">
                    Expected API URL: {API_URL}<br/>
                    Please start the server with: <code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code> (from server directory)
                  </p>
                </div>
              )}
              
              <div className="space-y-6">
                <Button 
                  className="w-full bg-medical-600 hover:bg-medical-700"
                  disabled={isLoading || !serverAvailable || !auth0Config}
                  onClick={handleAuth0Login}
                >
                  {isLoading ? 'Logging in...' : 'Login with Auth0'}
                </Button>
                
                {(import.meta.env.DEV || process.env.NODE_ENV === 'development') && (
                  <Button 
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    onClick={handleDevLogin}
                  >
                    Development Login (Skip Auth0)
                  </Button>
                )}
                
                {!serverAvailable && (
                  <div className="text-center text-sm text-amber-600">
                    <p>Server unavailable. Please start the API server first.</p>
                  </div>
                )}
                
                {auth0Config && (
                  <div className="text-center text-xs text-gray-500">
                    <p>Auth0 Domain: {auth0Config.domain}</p>
                    <p>Callback URL: {`${window.location.origin}/callback`}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
