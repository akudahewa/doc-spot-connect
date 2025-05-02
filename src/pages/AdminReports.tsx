
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReportGenerator from '@/components/admin/ReportGenerator';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminReports = () => {
  const navigate = useNavigate();
  
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
