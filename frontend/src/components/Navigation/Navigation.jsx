// Navigation.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    };

    checkAuth();
    
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkAuth);
    
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update state
    setUser(null);
    setIsDropdownOpen(false);
    
    // Redirect to home
    navigate('/');
    
    // Show success message (optional)
    setTimeout(() => {
      alert('Logged out successfully!');
    }, 100);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.nav-profile-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isDropdownOpen]);

  // Avatar Icon Component
  const AvatarIcon = ({ size = 32, className = "" }) => (
    <div className={`nav-avatar-icon ${className}`} style={{ width: size, height: size }}>
      <svg 
        width={size * 0.6} 
        height={size * 0.6} 
        viewBox="0 0 24 24" 
        fill="none"
      >
        <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.8"/>
        <path 
          d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          fill="none"
          opacity="0.8"
        />
      </svg>
    </div>
  );

  // Profile Image Component with fallback to avatar icon
  const ProfileImage = ({ src, alt, size = 32, className = "" }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleImageError = () => {
      setImageError(true);
      setImageLoading(false);
    };

    const handleImageLoad = () => {
      setImageLoading(false);
      setImageError(false);
    };

    // If no src provided or image failed to load, show avatar icon
    if (!src || imageError) {
      return <AvatarIcon size={size} className={className} />;
    }

    return (
      <>
        {imageLoading && <AvatarIcon size={size} className={className} />}
        <img 
          src={src}
          alt={alt}
          className={`${className} ${imageLoading ? 'nav-image-loading' : ''}`}
          style={{ 
            width: size, 
            height: size,
            display: imageLoading ? 'none' : 'block'
          }}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      </>
    );
  };

  return (
    <header className="home-header">
      <div className="home-logo">NEUROPLAY</div>
      <nav className="home-nav">
        <Link to="/" className="home-nav-link">Home</Link>
        <Link to="/Games" className="home-nav-link">Games</Link>
        
        {user ? (
          // Authenticated Navigation
          <div className="nav-profile-dropdown">
            <button 
              className="nav-profile-button"
              onClick={toggleDropdown}
              aria-label="User menu"
            >
              <ProfileImage
                src={user.profileImage}
                alt={`${user.username}'s profile`}
                size={32}
                className="nav-profile-image"
              />
              <span className="nav-username">{user.username}</span>
              <svg 
                className={`nav-dropdown-arrow ${isDropdownOpen ? 'rotated' : ''}`}
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="none"
              >
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="nav-dropdown-menu">
                <div className="nav-user-info">
                  <ProfileImage
                    src={user.profileImage}
                    alt="Profile"
                    size={50}
                    className="nav-dropdown-avatar"
                  />
                  <div className="nav-user-details">
                    <div className="nav-user-name">{user.username}</div>
                    <div className="nav-user-email">{user.email}</div>
                    <div className="nav-user-level">Level {user.level || 1}</div>
                  </div>
                </div>
                
                <div className="nav-dropdown-divider"></div>
                
                <Link to="/profile" className="nav-dropdown-item">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                  </svg>
                  Profile
                </Link>
                
                <Link to="/dashboard" className="nav-dropdown-item">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zm-3.5-7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"/>
                  </svg>
                  Dashboard
                </Link>
                
                <Link to="/leaderboard" className="nav-dropdown-item">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 .146.354v7a.5.5 0 0 1-.5.5H14a.5.5 0 0 1-.5-.5v-4H3v4a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .146-.354l6-6zM2.5 7.5h11L8 2 2.5 7.5z"/>
                  </svg>
                  Leaderboard
                </Link>
                
                <div className="nav-dropdown-divider"></div>
                
                <button 
                  className="nav-dropdown-item nav-logout-btn"
                  onClick={handleLogout}
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                    <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // Unauthenticated Navigation
          <Link to="/login" className="home-nav-link nav-login-register">
            Login / Register
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Navigation;