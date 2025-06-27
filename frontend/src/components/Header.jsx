import { NavLink, useNavigate } from 'react-router-dom';

function Header({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded hover:bg-blue-100 transition ${
      isActive ? 'text-blue-600 font-medium' : 'text-gray-700'
    }`;

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo / Brand */}
        <NavLink to="/" className="text-xl font-bold text-blue-600">
          BlogApp
        </NavLink>

        {/* Navigation Links */}
        <div className="flex space-x-4 items-center">
          {user ? (
            <>
              <NavLink to="/create" className={navLinkClass}>
                Create Post
              </NavLink>
              <span className="text-gray-600">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="ml-2 text-red-500 hover:underline focus:outline-none"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={navLinkClass}>
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
