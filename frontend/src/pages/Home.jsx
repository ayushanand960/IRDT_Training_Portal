  import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';

export default function Home() {
  const  nav = useNavigate();
  return (
    <>
      <Header />
     <section className="bg-#F4F7FE text-center py-5">
  <div className="container"   >
      {/* Add image above the heading */}
  <img src="/images/irdt_logo_01.png"style={{ maxWidth: '250px', marginBottom: '20px' }} />


  <h1 className="display-5 fw-bold" style={{ color: '#4DA8DA' }}>
  Institute of Research, Development & Training
</h1>

    <p className="lead text-muted mt-3">
      {/* your paragraph content here */}
  

            Empowering teaching excellence across 147 Govt. Polytechnics in UP.
          </p>
          
           <div className="mt-4 d-flex flex-wrap justify-content-center gap-2">
</div>
        </div>
      </section>

  <section className="py-5 bg-#E8F6FA text-center">
  <div className="container">
    <h2 className="mb-4">Comprehensive Training Management</h2>
    <div className="row justify-content-center">
      <FeatureCard title="Multi-Role Access" desc="Access modules for all roles." />
      <FeatureCard title="Smart Scheduling" desc="AI-powered session planning." />
      <FeatureCard title="Certificate Management" desc="Instant certificate access." />
    </div>
  </div>
</section>

      <section className="py-5 bg-#F4F7FE text-center">
  <div className="container">
    <h2 className="mb-4">Training Partners</h2>
    <div className="d-flex justify-content-center gap-4 flex-wrap text-muted">
      <div>IRDT Campus</div>
      <div>NITTTR Chandigarh</div>
      <div>NITTTR Bhopal</div>
    </div>
  </div>
</section>

      <Footer />
    </>
  );
}
