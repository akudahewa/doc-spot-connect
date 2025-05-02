
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
import { AuthService } from '@/api/services/AuthService';

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if user is already logged in
  useEffect(() => {
    const checkExistingAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          // Validate existing token
          const user = await AuthService.getCurrentUser(token);
          if (user) {
            console.log('Already authenticated as:', user.name);
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
    
    checkExistingAuth();
  }, [navigate]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      const response = await AuthService.login(email, password);
      console.log('Login response received:', { success: !!response.token });
      
      if (!response.user || !response.token) {
        toast({
          title: 'Login Failed',
          description: response.message || 'Invalid credentials',
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
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('current_user', JSON.stringify(response.user));
      
      console.log('Auth data saved successfully. Token:', response.token);
      
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${response.user.name}!`
      });
      
      // Wait briefly to ensure localStorage is updated before navigation
      setTimeout(() => {
        console.log('Navigating to dashboard...');
        navigate('/admin/dashboard', { replace: true });
      }, 300);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
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
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-medical-600 hover:bg-medical-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
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
