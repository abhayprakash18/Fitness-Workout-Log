import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, LayoutDashboard, PlusCircle, History, User, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="navbar-brand" onClick={closeMenu}>
          <div className="logo-icon-bg">
            <Dumbbell className="logo-icon" size={24} />
          </div>
          <span className="brand-text">
            Fitness<span className="brand-accent">Log</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/history" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                <History size={18} />
                <span>History</span>
              </NavLink>
              <NavLink to="/add-workout" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                <PlusCircle size={18} />
                <span>Add Workout</span>
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                <User size={18} />
                <span>Profile</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                <span>Home</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Right Action / Auth Status */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="user-nav-profile">
              <div className="user-avatar-badge" title={user?.name || user?.email}>
                {(user?.name ? user.name.charAt(0) : 'U').toUpperCase()}
              </div>
              <span className="user-name-display">{user?.name || 'Athlete'}</span>
              <button onClick={handleLogout} className="btn btn-outline-danger btn-sm" title="Log Out">
                <LogOut size={16} />
                <span className="btn-text-desktop">Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-btn-group">
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button className="mobile-toggle-btn" onClick={toggleMenu} aria-label="Toggle Navigation Menu">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <nav className="mobile-nav-links">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" onClick={closeMenu} className="mobile-link">
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink to="/history" onClick={closeMenu} className="mobile-link">
                  <History size={20} />
                  <span>Workout History</span>
                </NavLink>
                <NavLink to="/add-workout" onClick={closeMenu} className="mobile-link">
                  <PlusCircle size={20} />
                  <span>Add Workout</span>
                </NavLink>
                <NavLink to="/profile" onClick={closeMenu} className="mobile-link">
                  <User size={20} />
                  <span>My Profile</span>
                </NavLink>
                <button onClick={handleLogout} className="mobile-link logout-link">
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <NavLink to="/" onClick={closeMenu} className="mobile-link">
                  <span>Home</span>
                </NavLink>
                <NavLink to="/login" onClick={closeMenu} className="mobile-link">
                  <span>Login</span>
                </NavLink>
                <NavLink to="/register" onClick={closeMenu} className="mobile-link primary-mobile-link">
                  <span>Register Account</span>
                </NavLink>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
