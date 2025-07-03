import React, { useState, useEffect } from 'react';

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

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true);

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!');
        setIsLoading(false);
        return;
      }
      if (!formData.agreeTerms) {
        alert('Please agree to the Terms of Service');
        setIsLoading(false);
        return;
      }
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (isLogin) {
        alert(`Login successful for: ${formData.email}`);
      } else {
        alert(`Account created successfully for: ${formData.username}`);
      }
    }, 2000);
  };

  // Social login
  const socialLogin = (provider) => {
    alert(`Connecting with ${provider.charAt(0).toUpperCase() + provider.slice(1)}...`);
  };

  // Forgot password
  const showForgotPassword = () => {
    const email = prompt('Enter your email address to reset password:');
    if (email) {
      alert(`Password reset link sent to: ${email}`);
    }
  };

  // Toggle auth mode
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
  };

  // Create floating particles
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

  // Effects
  useEffect(() => {
    // Animate progress dots
    const progressInterval = setInterval(() => {
      setActiveProgress(prev => (prev + 1) % 3);
    }, 3000);

    // Generate floating particles
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

        .cosmic-bg {
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

        .orb {
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), transparent);
            animation: float 8s ease-in-out infinite;
            filter: blur(1px);
        }

        .orb:nth-child(1) {
            width: 60px;
            height: 60px;
            top: 10%;
            left: 10%;
            background: radial-gradient(circle at 30% 30%, var(--neon-blue), transparent);
            animation-delay: 0s;
        }

        .orb:nth-child(2) {
            width: 40px;
            height: 40px;
            top: 70%;
            right: 15%;
            background: radial-gradient(circle at 30% 30%, var(--neon-purple), transparent);
            animation-delay: 2s;
        }

        .orb:nth-child(3) {
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

        .main-wrapper {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            position: relative;
        }

        .header-section {
            text-align: center;
            margin-bottom: 40px;
            z-index: 5;
        }

        .main-title {
            font-family: 'Orbitron', monospace;
            font-size: 3rem;
            font-weight: 700;
            // background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple), var(--neon-pink));
            // -webkit-background-clip: text;
            // -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
            // text-shadow: 0 0 40px rgba(110, 0, 255, 0.5);
            // animation: titleGlow 3s ease-in-out infinite;
        }

        @keyframes titleGlow {
            0%, 100% { filter: drop-shadow(0 0 20px rgba(0, 247, 255, 0.6)); }
            50% { filter: drop-shadow(0 0 30px rgba(157, 0, 255, 0.8)); }
        }

        .main-subtitle {
            font-size: 1.1rem;
            font-weight: 300;
            color: var(--text-muted);
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-bottom: 10px;
        }

        .stats-bar {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-bottom: 20px;
        }

        .stat-item {
            text-align: center;
            padding: 10px 20px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            border: 1px solid rgba(110, 0, 255, 0.3);
            backdrop-filter: blur(10px);
        }

        .stat-number {
            font-family: 'Orbitron', monospace;
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--neon-blue);
            margin-bottom: 5px;
        }

        .stat-label {
            font-size: 0.8rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 1px;
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

        .card-header {
            text-align: center;
            margin-bottom: 30px;
        }

        .card-title {
            font-family: 'Orbitron', monospace;
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--neon-blue);
            margin-bottom: 10px;
            text-shadow: 0 0 20px rgba(0, 247, 255, 0.5);
        }

        .card-subtitle {
            font-size: 0.9rem;
            color: var(--text-muted);
            font-weight: 300;
        }

        .form-field {
            margin-bottom: 25px;
            position: relative;
        }

        .form-field label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--text-light);
            font-size: 0.9rem;
        }

        .form-field input {
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

        .form-field input:focus {
            outline: none;
            border-color: var(--neon-blue);
            box-shadow: 0 0 25px rgba(0, 247, 255, 0.4);
            background: rgba(0, 0, 0, 0.6);
        }

        .form-field input::placeholder {
            color: var(--text-muted);
        }

        .action-btn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, var(--neon-purple), var(--neon-blue));
            border: none;
            border-radius: 12px;
            color: var(--text-light);
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 20px;
        }

        .action-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.6s ease;
        }

        .action-btn:hover::before {
            left: 100%;
        }

        .action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 40px rgba(110, 0, 255, 0.5);
        }

        .action-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .forgot-link {
            text-align: center;
            margin-top: 15px;
        }

        .forgot-link a {
            color: var(--neon-blue);
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
            transition: color 0.3s ease;
            cursor: pointer;
        }

        .forgot-link a:hover {
            color: var(--neon-pink);
        }

        .social-section {
            margin-top: 30px;
            text-align: center;
        }

        .social-divider {
            position: relative;
            margin: 20px 0;
        }

        .social-divider::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--neon-blue), transparent);
        }

        .social-divider span {
            background: rgba(15, 15, 26, 0.9);
            padding: 0 15px;
            color: var(--text-muted);
            font-size: 0.85rem;
            font-weight: 500;
        }

        .social-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
        }

        .social-btn {
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

        .social-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: var(--neon-blue);
            transform: translateY(-2px);
        }

        .register-extras {
            margin-top: 20px;
        }

        .checkbox-group {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }

        .checkbox-group input[type="checkbox"] {
            margin-right: 10px;
            width: 18px;
            height: 18px;
            accent-color: var(--neon-blue);
        }

        .checkbox-group label {
            font-size: 0.85rem;
            color: var(--text-muted);
            margin-bottom: 0;
        }

        .checkbox-group a {
            color: var(--neon-blue);
            text-decoration: none;
            cursor: pointer;
        }

        .checkbox-group a:hover {
            color: var(--neon-pink);
        }

        .progress-dots {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-top: 20px;
        }

        .progress-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease;
        }

        .progress-dot.active {
            background: var(--neon-blue);
            box-shadow: 0 0 15px rgba(0, 247, 255, 0.6);
        }

        .toggle-section {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .toggle-text {
            color: var(--text-muted);
            font-size: 0.9rem;
            margin-bottom: 10px;
        }

        .toggle-btn {
            background: none;
            border: none;
            color: var(--neon-blue);
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: color 0.3s ease;
        }

        .toggle-btn:hover {
            color: var(--neon-pink);
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

        .slide-in {
            animation: slideInUp 0.8s ease-out;
        }

        @media (max-width: 768px) {
            .auth-card {
                width: 100%;
                max-width: 400px;
                padding: 30px 25px;
            }

            .main-title {
                font-size: 2.5rem;
            }

            .stats-bar {
                flex-wrap: wrap;
                gap: 20px;
            }

            .stat-item {
                padding: 8px 15px;
            }
        }

        @media (max-width: 480px) {
            .auth-card {
                padding: 25px 20px;
            }

            .main-title {
                font-size: 2rem;
            }

            .social-buttons {
                flex-direction: column;
            }

            .stats-bar {
                display: none;
            }
        }
      `}</style>

      <div className="cosmic-bg"></div>
      
      <div className="orb"></div>
      <div className="orb"></div>
      <div className="orb"></div>

      <div className="main-wrapper">
        <div className="header-section">
          <h1 className="main-title">MEMORY BOOSTER</h1>
          <p className="main-subtitle">Cognitive Enhancement Platform</p>
          
          {/* <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1M+</div>
              <div className="stat-label">Games Played</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Improvement Rate</div>
            </div>
          </div> */}
        </div>

        <div className="auth-card slide-in">
          <div className="card-header">
            <h2 className="card-title">{isLogin ? 'LOGIN' : 'REGISTER'}</h2>
            <p className="card-subtitle">
              {isLogin ? 'Welcome back, enhance your mind' : 'Start your cognitive journey'}
            </p>
          </div>

          <div>
            {!isLogin && (
              <div className="form-field">
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

            <div className="form-field">
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

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={isLogin ? "Enter your password" : "Create a password"}
                required
              />
            </div>

            {!isLogin && (
              <div className="form-field">
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
              <div className="register-extras">
                <div className="checkbox-group">
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
                <div className="checkbox-group">
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

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="action-btn"
            >
              {isLoading ? 
                (isLogin ? 'Accessing...' : 'Creating Account...') : 
                (isLogin ? 'Access Portal' : 'Create Account')
              }
            </button>

            {isLogin && (
              <div className="forgot-link">
                <a onClick={showForgotPassword}>Forgot Password?</a>
              </div>
            )}
          </div>

          <div className="social-section">
            <div className="social-divider">
              <span>or {isLogin ? 'continue' : 'sign up'} with</span>
            </div>
            <div className="social-buttons">
              <button className="social-btn" onClick={() => socialLogin('google')}>
                Google
              </button>
              <button className="social-btn" onClick={() => socialLogin('discord')}>
                Discord
              </button>
            </div>
          </div>

          <div className="toggle-section">
            <p className="toggle-text">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button className="toggle-btn" onClick={toggleAuthMode}>
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </div>
        </div>

        <div className="progress-dots">
          {[0, 1, 2].map(index => (
            <div
              key={index}
              className={`progress-dot ${activeProgress === index ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default LoginRegister;