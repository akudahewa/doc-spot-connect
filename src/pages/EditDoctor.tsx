
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DoctorForm from '@/components/DoctorForm';

const EditDoctor = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <h1 className="text-3xl font-bold mb-6">Error: Doctor ID not provided</h1>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Edit Doctor</h1>
        <DoctorForm doctorId={id} isEdit={true} />
      </main>
      <Footer />
    </div>
  );
};

export default EditDoctor;
