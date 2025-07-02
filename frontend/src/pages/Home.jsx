  import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';

export default function Home() {
  const nav = useNavigate();
  return (
    <>
      <Header />
      <section className="bg-light text-center py-5">
        <div className="container">
          <h1 className="display-5 fw-bold text-primary">Institute of Research, Development & Training</h1>
          <p className="lead text-muted mt-3">
            Empowering teaching excellence across 147 Govt. Polytechnics in UP.
          </p>
          
           <div className="mt-4 d-flex flex-wrap justify-content-center gap-2">
  {/* <button
    className="btn btn-primary"
    onClick={() => nav('/register/staff')}
  >
    Register as Staff
  </button>
  <button
    className="btn btn-outline-primary"
    onClick={() => nav('/register/admin')}
  >
    Register as Admin
  </button>
  <button
    className="btn btn-outline-primary"
    onClick={() => nav('/register/coordinator')}
  >
    Register as Coordinator
  </button> */}
  {/* <button
    className="btn btn-secondary"
    onClick={() => nav('/login')}
  >
    Login
  </button> */}
</div>
        </div>
      </section>

      <section className="py-5 bg-white text-center">
        <div className="container">
          <h2 className="text-primary mb-4">Comprehensive Training Management</h2>
          <div className="row justify-content-center">
            <FeatureCard title="Multi-Role Access" desc="Access modules for all roles." />
            <FeatureCard title="Smart Scheduling" desc="AI-powered session planning." />
            <FeatureCard title="Certificate Management" desc="Instant certificate access." />
          </div>
        </div>
      </section>

      <section className="py-5 bg-light text-center">
        <div className="container">
          <h2 className="text-primary mb-4">Training Partners</h2>
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
