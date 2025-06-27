import { Link, NavLink, useNavigate } from 'react-router-dom';

function Header({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <header className="header bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <h1 className="text-2xl font-bold text-blue-600">
          <Link to="/">Blog App</Link>
        </h1>

        <nav className="flex items-center space-x-4" aria-label="Main navigation">
          {user ? (
            <>
              <NavLink to="/create" className="text-sm font-medium hover:text-blue-500">
                Create Post
              </NavLink>
              <span className="text-sm text-gray-700">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:underline"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-sm font-medium hover:text-blue-500">
                Login
              </NavLink>
              <NavLink to="/register" className="text-sm font-medium hover:text-blue-500">
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
