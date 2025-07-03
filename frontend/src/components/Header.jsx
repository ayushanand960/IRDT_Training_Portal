  import { useNavigate } from 'react-router-dom';

const Header = () => {
  const nav = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <a className="navbar-brand fw-bold text-primary" href="/" onClick={(e) => { e.preventDefault(); nav('/'); }}>
          IRDT Portal
        </a>

        <div className="ms-auto">
          <button className="btn btn-outline-primary me-2" onClick={() => nav('/login')}>
            Login
          </button>
         <button className="btn btn-outline-primary me-2" onClick={() => nav('/register/staff')}>
  Register
</button>

{/* ➕ Admin/Coordinator Login Button with left margin */}
<button
  className="btn btn-outline-primary me-2"
  onClick={() => nav('/admin-coordinator-login')}
>
  Admin/Coordinator Login
</button>

        </div>
      </div>
    </nav>
  );
};

export default Header;
