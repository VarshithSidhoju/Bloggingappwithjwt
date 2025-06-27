import { Link, useNavigate } from 'react-router-dom';

function Header({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">
          <Link to="/">Blog App</Link>
        </h1>
        <nav className="navigation" aria-label="Main navigation">
          {user ? (
            <>
              <Link to="/create" className="nav-link">Create Post</Link>
              <span className="user-greeting">Hi, {user.name}</span>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;


