import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    newsletter: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeProgress, setActiveProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Frontend validation
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match!');
        setIsLoading(false);
        return;
      }
      if (!formData.agreeTerms) {
        setError('Please agree to the Terms of Service');
        setIsLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        setIsLoading(false);
        return;
      }
    }

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            newsletter: formData.newsletter
          };

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Success - store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setSuccess(data.message);

      // Redirect after success
      setTimeout(() => {
        navigate('/'); // Redirect to home page
      }, 1500);

    } catch (error) {
      console.error('Auth error:', error);
      setError(error.message || 'Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const socialLogin = (provider) => {
    setError('');
    // Placeholder for social login implementation
    setError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login not implemented yet`);
  };

  const showForgotPassword = () => {
    const email = prompt('Enter your email address to reset password:');
    if (email) {
      // TODO: Implement password reset
      setSuccess(`Password reset functionality will be implemented soon. Email: ${email}`);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
      newsletter: false
    });
    setError('');
    setSuccess('');
  };

  // Particle animation (unchanged)
  const createFloatingParticle = () => {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.background = `var(--neon-${['blue', 'purple', 'pink'][Math.floor(Math.random() * 3)]})`;
    particle.style.borderRadius = '50%';
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = window.innerHeight + 'px';
    particle.style.zIndex = '1';
    particle.style.opacity = '0.7';
    particle.style.pointerEvents = 'none';

    document.body.appendChild(particle);

    const animation = particle.animate([
      { transform: 'translateY(0px)', opacity: 0.7 },
      { transform: `translateY(-${window.innerHeight + 100}px)`, opacity: 0 }
    ], {
      duration: 6000 + Math.random() * 4000,
      easing: 'linear'
    });

    animation.onfinish = () => particle.remove();
  };

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setActiveProgress(prev => (prev + 1) % 3);
    }, 3000);

    const particleInterval = setInterval(createFloatingParticle, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(particleInterval);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Montserrat:wght@300;400;600&display=swap');
        :root {
          --primary-color: #6e00ff;
          --secondary-color: #ff00e4;
          --accent-color: #00f7ff;
          --dark-bg: #0f0f1a;
          --text-light: #ffffff;
          --text-muted: rgba(255, 255, 255, 0.7);
          --neon-blue: #00f7ff;
          --neon-purple: #9d00ff;
          --neon-pink: #ff00e4;
          --error-color: #ff4757;
          --success-color: #2ed573;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Montserrat', sans-serif;
          background: var(--dark-bg);
          color: var(--text-light);
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
        }

        .auth-cosmic-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -2;
          background:
            radial-gradient(ellipse at top, rgba(110, 0, 255, 0.3) 0%, transparent 60%),
            radial-gradient(ellipse at bottom, rgba(255, 0, 228, 0.2) 0%, transparent 60%),
            radial-gradient(ellipse at center, rgba(0, 247, 255, 0.1) 0%, transparent 70%),
            var(--dark-bg);
          animation: cosmicShift 12s ease-in-out infinite;
        }

        @keyframes cosmicShift {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(2deg); }
        }

        .auth-orb {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), transparent);
          animation: float 8s ease-in-out infinite;
          filter: blur(1px);
        }

        .auth-orb:nth-child(2) {
          width: 60px;
          height: 60px;
          top: 10%;
          left: 10%;
          background: radial-gradient(circle at 30% 30%, var(--neon-blue), transparent);
          animation-delay: 0s;
        }

        .auth-orb:nth-child(3) {
          width: 40px;
          height: 40px;
          top: 70%;
          right: 15%;
          background: radial-gradient(circle at 30% 30%, var(--neon-purple), transparent);
          animation-delay: 2s;
        }

        .auth-orb:nth-child(4) {
          width: 80px;
          height: 80px;
          bottom: 20%;
          left: 20%;
          background: radial-gradient(circle at 30% 30%, var(--neon-pink), transparent);
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
          50% { transform: translateY(-30px) scale(1.1); opacity: 0.8; }
        }

        .auth-main-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
          position: relative;
        }

        .auth-header-section {
          text-align: center;
          margin-bottom: 40px;
          z-index: 5;
        }

        .auth-main-title {
          font-family: 'Orbitron', monospace;
          font-size: 3rem;
          font-weight: 700;
          background-clip: text;
          margin-bottom: 10px;
        }

        .auth-main-subtitle {
          font-size: 1.1rem;
          font-weight: 300;
          color: var(--text-muted);
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .auth-card {
          background: rgba(15, 15, 26, 0.9);
          border-radius: 25px;
          padding: 40px;
          width: 400px;
          max-width: 90vw;
          backdrop-filter: blur(20px);
          border: 2px solid rgba(110, 0, 255, 0.2);
          position: relative;
          overflow: hidden;
          transition: all 0.5s ease;
          z-index: 5;
        }

        .auth-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(
            from 0deg,
            transparent,
            var(--neon-blue),
            transparent,
            var(--neon-purple),
            transparent,
            var(--neon-pink),
            transparent
          );
          animation: rotate 6s linear infinite;
          z-index: -1;
        }

        .auth-card::after {
          content: '';
          position: absolute;
          inset: 2px;
          background: rgba(15, 15, 26, 0.95);
          border-radius: 23px;
          z-index: -1;
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .auth-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 60px rgba(110, 0, 255, 0.3);
        }

        .auth-card-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .auth-card-title {
          font-family: 'Orbitron', monospace;
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--neon-blue);
          margin-bottom: 10px;
          text-shadow: 0 0 20px rgba(0, 247, 255, 0.5);
        }

        .auth-card-subtitle {
          font-size: 0.9rem;
          color: var(--text-muted);
          font-weight: 300;
        }

        .auth-form-field {
          margin-bottom: 25px;
          position: relative;
        }

        .auth-form-field label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: var(--text-light);
          font-size: 0.9rem;
        }

        .auth-form-field input {
          width: 100%;
          padding: 16px 20px;
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(110, 0, 255, 0.3);
          border-radius: 12px;
          color: var(--text-light);
          font-family: 'Montserrat', sans-serif;
          font-size: 1rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);
        }

        .auth-form-field input:focus {
          outline: none;
          border-color: var(--neon-blue);
          box-shadow: 0 0 25px rgba(0, 247, 255, 0.4);
          background: rgba(0, 0, 0, 0.6);
        }

        .auth-form-field input::placeholder {
          color: var(--text-muted);
        }

        .auth-action-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          gap: 10px;
        }

        .auth-action-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, var(--neon-purple), var(--neon-blue));
          border: none;
          border-radius: 10px;
          color: var(--text-light);
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          text-transform: uppercase;
          letter-spacing: 1px;
          text-align: center;
        }

        .auth-action-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.6s ease;
        }

        .auth-action-btn:hover::before {
          left: 100%;
        }

        .auth-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(110, 0, 255, 0.5);
        }

        .auth-action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-forgot-link {
          flex: 1;
          text-align: right;
        }

        .auth-forgot-link a {
          color: var(--neon-blue);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: color 0.3s ease;
          cursor: pointer;
        }

        .auth-forgot-link a:hover {
          color: var(--neon-pink);
        }

        .auth-social-section {
          margin-top: 30px;
          text-align: center;
        }

        .auth-social-divider {
          position: relative;
          margin: 20px 0;
        }

        .auth-social-divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--neon-blue), transparent);
        }

        .auth-social-divider span {
          background: rgba(15, 15, 26, 0.9);
          padding: 0 15px;
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 500;
        }

        .auth-social-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .auth-social-btn {
          padding: 12px 20px;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          color: var(--text-light);
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          flex: 1;
        }

        .auth-social-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: var(--neon-blue);
          transform: translateY(-2px);
        }

        .auth-register-extras {
          margin-top: 20px;
        }

        .auth-checkbox-group {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }

        .auth-checkbox-group input[type="checkbox"] {
          margin-right: 10px;
          width: 18px;
          height: 18px;
          accent-color: var(--neon-blue);
        }

        .auth-checkbox-group label {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 0;
        }

        .auth-checkbox-group a {
          color: var(--neon-blue);
          text-decoration: none;
          cursor: pointer;
        }

        .auth-checkbox-group a:hover {
          color: var(--neon-pink);
        }

        .auth-progress-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 20px;
        }

        .auth-progress-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }

        .auth-progress-dot.active {
          background: var(--neon-blue);
          box-shadow: 0 0 15px rgba(0, 247, 255, 0.6);
        }

        .auth-toggle-section {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .auth-toggle-text {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 10px;
        }

        .auth-toggle-btn {
          background: none;
          border: none;
          color: var(--neon-blue);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .auth-toggle-btn:hover {
          color: var(--neon-pink);
        }

        .auth-message {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.9rem;
          font-weight: 500;
          text-align: center;
        }

        .auth-error {
          background: rgba(255, 71, 87, 0.1);
          border: 1px solid rgba(255, 71, 87, 0.3);
          color: var(--error-color);
        }

        .auth-success {
          background: rgba(46, 213, 115, 0.1);
          border: 1px solid rgba(46, 213, 115, 0.3);
          color: var(--success-color);
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .auth-slide-in {
          animation: slideInUp 0.8s ease-out;
        }

        @media (max-width: 768px) {
          .auth-card {
            width: 100%;
            max-width: 400px;
            padding: 30px 25px;
          }

          .auth-main-title {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: 25px 20px;
          }

          .auth-main-title {
            font-size: 2rem;
          }

          .auth-social-buttons {
            flex-direction: column;
          }
        }
      `}
      </style>
      
      <div className="auth-cosmic-bg"></div>
      <div className="auth-orb"></div>
      <div className="auth-orb"></div>
      <div className="auth-orb"></div>

      <div className="auth-main-wrapper">
        <div className="auth-header-section">
          <h1 className="auth-main-title">MEMORY BOOSTER</h1>
          <p className="auth-main-subtitle">Cognitive Enhancement Platform</p>
        </div>

        <div className="auth-card auth-slide-in">
          <div className="auth-card-header">
            <h2 className="auth-card-title">{isLogin ? 'LOGIN' : 'REGISTER'}</h2>
            <p className="auth-card-subtitle">
              {isLogin ? 'Welcome back, enhance your mind' : 'Start your cognitive journey'}
            </p>
          </div>

          {error && <div className="auth-message auth-error">{error}</div>}
          {success && <div className="auth-message auth-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="auth-form-field">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Choose a username"
                  required
                />
              </div>
            )}

            <div className="auth-form-field">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="auth-form-field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={isLogin ? "Enter your password" : "Create a password (min 6 chars)"}
                required
              />
            </div>

            {!isLogin && (
              <div className="auth-form-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            {!isLogin && (
              <div className="auth-register-extras">
                <div className="auth-checkbox-group">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="agreeTerms">
                    I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                  </label>
                </div>
                <div className="auth-checkbox-group">
                  <input
                    type="checkbox"
                    id="newsletter"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="newsletter">
                    Send me updates about new features and improvements
                  </label>
                </div>
              </div>
            )}

            <div className="auth-action-section">
              <button
                type="submit"
                disabled={isLoading}
                className="auth-action-btn"
              >
                {isLoading
                  ? isLogin
                    ? 'Accessing...'
                    : 'Creating Account...'
                  : isLogin
                  ? 'Access Portal'
                  : 'Create Account'}
              </button>
              {isLogin && (
                <div className="auth-forgot-link">
                  <a onClick={showForgotPassword}>Forgot Password?</a>
                </div>
              )}
            </div>
          </form>

          <div className="auth-social-section">
            <div className="auth-social-divider">
              <span>or {isLogin ? 'continue' : 'sign up'} with</span>
            </div>
            <div className="auth-social-buttons">
              <button className="auth-social-btn" onClick={() => socialLogin('google')}>
                Google
              </button>
            </div>
          </div>

          <div className="auth-toggle-section">
            <p className="auth-toggle-text">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button className="auth-toggle-btn" onClick={toggleAuthMode} type="button">
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </div>
        </div>

        <div className="auth-progress-dots">
          {[0, 1, 2].map(index => (
            <div
              key={index}
              className={`auth-progress-dot ${activeProgress === index ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default LoginRegister;