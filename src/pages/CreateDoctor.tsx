
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DoctorForm from '@/components/DoctorForm';

const CreateDoctor = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Add New Doctor</h1>
        <DoctorForm />
      </main>
      <Footer />
    </div>
  );
};

export default CreateDoctor;
