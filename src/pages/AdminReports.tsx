
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReportGenerator from '@/components/admin/ReportGenerator';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AuthService } from '@/api/services';

const AdminReports = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      // Get token from local storage
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please log in to access the reports",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }
      
      try {
        // Get current user with token
        const user = await AuthService.getCurrentUser(token);
        
        if (!user) {
          throw new Error("Invalid session");
        }
        
        setCurrentUser(user);
      } catch (error) {
        console.error("Auth error:", error);
        toast({
          title: "Session expired",
          description: "Please log in again",
          variant: "destructive"
        });
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate, toast]);
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-xl">Loading reports...</p>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Reports</h1>
          
          <Button onClick={() => navigate('/admin/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
        
        <ReportGenerator />
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminReports;
