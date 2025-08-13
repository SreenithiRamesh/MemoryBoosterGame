
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();


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
         
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    };

    checkAuth();
    
   
    window.addEventListener('storage', checkAuth);
    
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = useCallback(() => {

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
   
    setUser(null);
    setIsDropdownOpen(false);
    

    navigate('/');
    
    
    setTimeout(() => {
      alert('Logged out successfully!');
    }, 100);
  }, [navigate]);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  
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

  
  const AvatarIcon = ({ size = 32, className = "", username = "" }) => {
  
    const initial = username ? username.charAt(0).toUpperCase() : '?';
    
    return (
      <div 
        className={`nav-avatar-icon ${className}`} 
        style={{ 
          width: size, 
          height: size,
          borderRadius: '50%',
          backgroundColor: '#6e00ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: `${size * 0.4}px`,
          fontWeight: 'bold'
        }}
      >
        {initial}
      </div>
    );
  };


  const ProfileImage = ({ src, alt, size = 32, className = "", username = "" }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(!!src);

    const handleImageError = useCallback(() => {
      console.log('Image failed to load:', src);
      setImageError(true);
      setImageLoading(false);
    }, [src]);

    const handleImageLoad = useCallback(() => {
      setImageLoading(false);
      setImageError(false);
    }, []);

    
    useEffect(() => {
      if (src) {
        setImageError(false);
        setImageLoading(true);
      }
    }, [src]);

    
    if (!src || imageError) {
      return <AvatarIcon size={size} className={className} username={username} />;
    }

    return (
      <div style={{ position: 'relative', width: size, height: size }}>
        {imageLoading && (
          <AvatarIcon 
            size={size} 
            className={className} 
            username={username}
          />
        )}
        <img 
          src={src}
          alt={alt || `${username}'s profile`}
          className={`${className} ${imageLoading ? 'nav-image-loading' : ''}`}
          style={{ 
            width: size, 
            height: size,
            borderRadius: '50%',
            objectFit: 'cover',
            position: imageLoading ? 'absolute' : 'static',
            top: 0,
            left: 0,
            display: imageLoading ? 'none' : 'block'
          }}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
        />
      </div>
    );
  };

 
  const generateFallbackAvatar = (username, size = 40) => {
    if (!username) return null;
    
    try {
     
      const name = encodeURIComponent(username);
      return `https://ui-avatars.com/api/?name=${name}&size=${size}&background=6e00ff&color=ffffff&bold=true`;
    } catch (error) {
      console.warn('Error generating fallback avatar:', error);
      return null;
    }
  };

  return (
    <header className="home-header">
      <div className="home-logo">NEUROPLAY</div>
      <nav className="home-nav">
        <Link to="/" className="home-nav-link">Home</Link>
        <Link to="/Games" className="home-nav-link">Games</Link>
        
        {user ? (
     
          <div className="nav-profile-dropdown">
            <button 
              className="nav-profile-button"
              onClick={toggleDropdown}
              aria-label={`${user.username} user menu`}
            >
              <ProfileImage
                src={user.profileImage || generateFallbackAvatar(user.username, 32)}
                alt={`${user.username}'s profile`}
                size={32}
                className="nav-profile-image"
                username={user.username}
              />
              <span className="nav-username">{user.username}</span>
              <svg 
                className={`nav-dropdown-arrow ${isDropdownOpen ? 'rotated' : ''}`}
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="none"
                aria-hidden="true"
              >
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="nav-dropdown-menu" role="menu">
                <div className="nav-user-info">
                  <ProfileImage
                    src={user.profileImage || generateFallbackAvatar(user.username, 50)}
                    alt="Profile"
                    size={50}
                    className="nav-dropdown-avatar"
                    username={user.username}
                  />
                  <div className="nav-user-details">
                    <div className="nav-user-name">{user.username}</div>
                    <div className="nav-user-email">{user.email}</div>
                  </div>
                </div>
                
                <div className="nav-dropdown-divider"></div>
                
                
                
                
                <div className="nav-dropdown-divider"></div>
                
                <button 
                  className="nav-dropdown-item nav-logout-btn"
                  onClick={handleLogout}
                  role="menuitem"
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                    <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
         
          <Link to="/login" className="home-nav-link nav-login-register">
            Login / Register
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Navigation;