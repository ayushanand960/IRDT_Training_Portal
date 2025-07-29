
// import { useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axiosInstance from '../utils/axiosInstance';
// import { useAuth } from '../components/AuthContext';
// import Header from '../components/Header';
// import Footer from '../components/Footer';
// import FeatureCard from '../components/FeatureCard';

// export default function Home() {
//   const { user, setUser } = useAuth();
//   const logoutDone = useRef(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleUser = async () => {
      
//       // ✅ Skip if already handled
//       if (logoutDone.current) return;

//       try {
//         const res = await axiosInstance.get("/login/user/profile/");
//         const { is_superuser, is_coordinator, ehrms_code } = res.data;

//         // ✅ Auto-logout admin/coordinator
//         if (is_superuser || is_coordinator) {
//           logoutDone.current = true;
//           await axiosInstance.post("/login/logout/");
//           setUser(null);
//         } else {
//           // ✅ Redirect trainee to dashboard
//           logoutDone.current = true;
//           // navigate("/dashboard");
//           await axiosInstance.post("/login/logout/");

//         }
//       } catch (err) {
//         logoutDone.current = true;
//         setUser(null); // not logged in
//       }
//     };

//     handleUser();
//   }, [navigate, setUser]);

//   return (
//     <>
//       <Header />
//       <section className="bg-#f4f7fe text-center py-5">
//         <div className="container">
//           <img
//             src="/images/irdt_logo_01.png"
//             alt="IRDT Logo"
//             style={{
//               maxWidth: '250px',
//               marginBottom: '20px',
//               filter: 'brightness(0.3) contrast(1.6)',
//             }}
//           />

//           <h1 className="display-5 fw-bold" style={{ color: '#4DA8DA' }}>
//             Institute of Research, Development & Training
//           </h1>
//           <p className="lead text-muted mt-3">
//             Empowering teaching excellence across 147 Govt. Polytechnics in UP.
//           </p>
//         </div>
//       </section>

//       <section className="py-5 bg-#e8f6fa text-center">
//         <div className="container">
//           <h2 className="mb-4">Comprehensive Training Management</h2>
//           <div className="row justify-content-center">
//             <FeatureCard title="Multi-Role Access" desc="Access modules for all roles." />
//             <FeatureCard title="Smart Scheduling" desc="AI-powered session planning." />
//             <FeatureCard title="Certificate Management" desc="Instant certificate access." />
//           </div>
//         </div>
//       </section>

//       <section className="py-5 bg-#f4f7fe text-center">
//         <div className="container">
//           <h2 className="mb-4">Training Partners</h2>
//           <div className="d-flex justify-content-center gap-4 flex-wrap text-muted">
//             <div>IRDT Campus</div>
//             <div>NITTTR Chandigarh</div>
//             <div>NITTTR Bhopal</div>
//           </div>
//         </div>
//       </section>
//       <Footer />
//     </>
//   );
// }







import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../components/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';

export default function Home() {
  const { user, setUser } = useAuth();
  const logoutDone = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleUser = async () => {
      if (logoutDone.current || !user) return;

      try {
        const res = await axiosInstance.get("/login/user/profile/");
        const { is_superuser, is_coordinator } = res.data;

        if (is_superuser || is_coordinator) {
          logoutDone.current = true;
          await axiosInstance.post("/login/logout/");
          setUser(null);
          // Redirect with session_expired message
          navigate("/");
        }
      } catch (err) {
        logoutDone.current = true;
        // ❌ Don't force logout for guests
      }
    };

    handleUser();
  }, [user, setUser, navigate]);

  return (
    <>
      <Header />
      <section className="bg-#f4f7fe text-center py-5">
        <div className="container">
          <img
            src="/images/irdt_logo_01.png"
            alt="IRDT Logo"
            style={{
              maxWidth: '250px',
              marginBottom: '20px',
              filter: 'brightness(0.3) contrast(1.6)',
            }}
          />
          <h1 className="display-5 fw-bold" style={{ color: '#4DA8DA' }}>
            Institute of Research, Development & Training
          </h1>
          <p className="lead text-muted mt-3">
            Empowering teaching excellence across 147 Govt. Polytechnics in UP.
          </p>
        </div>
      </section>

      <section className="py-5 bg-#e8f6fa text-center">
        <div className="container">
          <h2 className="mb-4">Comprehensive Training Management</h2>
          <div className="row justify-content-center">
            <FeatureCard title="Multi-Role Access" desc="Access modules for all roles." />
            <FeatureCard title="Smart Scheduling" desc="AI-powered session planning." />
            <FeatureCard title="Certificate Management" desc="Instant certificate access." />
          </div>
        </div>
      </section>

      <section className="py-5 bg-#f4f7fe text-center">
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
