import React, { useEffect } from 'react';
import './Home.css';
import { FaBrain, FaGamepad, FaChartLine, FaUsers, FaMedal, FaLock } from 'react-icons/fa';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Home = () => {
  useEffect(() => {
    // Main Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('home-animate-active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.home-animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    // Number counter animation
    const animateNumbers = () => {
      const numberElements = document.querySelectorAll('.home-stat-number');
      
      numberElements.forEach(element => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        
        let current = start;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            clearInterval(timer);
            current = target;
          }
          element.textContent = Math.floor(current);
        }, 16);
      });

      // Animate progress bars
      document.querySelectorAll('.home-progress-fill').forEach(bar => {
        const targetWidth = bar.parentElement.previousElementSibling.getAttribute('data-target') + '%';
        bar.style.width = targetWidth;
      });
    };

    // Stats observer with higher threshold
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateNumbers();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.home-stat-card').forEach(card => {
      statsObserver.observe(card);
    });

    return () => {
      observer.disconnect();
      statsObserver.disconnect();
    };
  }, []);

  return (
    <div className="home-page">
      {/* Video Background */}
      <div className="home-video-background">
        <video autoPlay loop muted playsInline poster="/images/video-fallback.jpg">
          <source
            src="/videos/background-video.mp4"
            type="video/mp4"
            onError={(e) => {
              console.error("Video failed to load", e);
              e.target.parentElement.style.backgroundImage = "url('/images/video-fallback.jpg')";
              e.target.parentElement.querySelector('video').style.display = 'none';
            }}
          />
          Your browser does not support the video tag.
        </video>
        <div className="home-overlay"></div>
      </div>

      {/* Header */}
      <header className="home-header">
        <div className="home-logo">NEUROPLAY</div>
        <nav className="home-nav">
          <a href="#home" className="home-nav-link">Home</a>
          <a href="/Games" className="home-nav-link">Games</a>
         
          <a href="/login" className="home-nav-link">Login / Register</a>
        </nav>
      </header>

      
<section className="home-hero-section">
  <main className="home-main-content">
        <div className="home-hero-text home-animate-on-scroll">
          <h1 className="home-title">SHARPEN YOUR MIND</h1>
          <p className="home-subtitle">The Gym Membership Your Brain Deserves</p>
          <button className="home-cta-button">EXPLORE MORE</button>
        </div>
        </main>
  
  <div className="home-hero-image">
    <div className="home-hero-image-background"></div>
    <div className="home-floating-games">
      {/* Wordle */}
      <div className="home-floating-game home-wordle">
        <div className="home-game-card-wrapper">
          <img 
            src="./wordle.png" 
            alt="Wordle game" 
            className="home-game-image"
          />
          <div className="home-game-label">Wordle</div>
        </div>
      </div>
      
      {/* Chess */}
      <div className="home-floating-game home-chess">
        <div className="home-game-card-wrapper">
          <img 
            src="./chess.jpg" 
            alt="Chess game" 
            className="home-game-image"
          />
          <div className="home-game-label">Chess</div>
        </div>
      </div>
      
      {/* Simon */}
      <div className="home-floating-game home-simon">
        <div className="home-game-card-wrapper">
          <img 
            src="./simon2.jpg" 
            alt="Simon game" 
            className="home-game-image"
          />
          <div className="home-game-label">Simon</div>
        </div>
      </div>
      
      {/* 2048 */}
      <div className="home-floating-game home-game2048">
        <div className="home-game-card-wrapper">
          <img 
            src="./20483.png" 
            alt="2048 game" 
            className="home-game-image"
          />
          <div className="home-game-label">2048</div>
        </div>
      </div>
    </div>
    
    {/* Decorative elements */}
    <div className="home-hero-decorations">
      <div className="home-decoration-circle home-circle-1"></div>
      <div className="home-decoration-circle home-circle-2"></div>
      <div className="home-decoration-circle home-circle-3"></div>
    </div>
  </div>
</section>

        {/* Brain Benefits Section */}
        <section className="home-brain-benefits home-full-width-section">
          <h2 className="home-section-title home-animate-on-scroll">YOUR BRAIN ON NEUROPLAY</h2>
          

          <div className="home-animated-stats">
            <div className="home-stat-card home-animate-on-scroll">
              <div className="home-stat-number" data-target="87">0</div>
              <p>Memory Retention</p>
              <div className="home-progress-bar">
                <div className="home-progress-fill" style={{ width: '87%' }}></div>
              </div>
            </div>
            
            <div className="home-stat-card home-animate-on-scroll">
              <div className="home-stat-number" data-target="63">0</div>
              <p>Focus Improvement</p>
              <div className="home-progress-bar">
                <div className="home-progress-fill" style={{ width: '63%' }}></div>
              </div>
            </div>
            
            <div className="home-stat-card home-animate-on-scroll">
              <div className="home-stat-number" data-target="91">0</div>
              <p>User Satisfaction</p>
              <div className="home-progress-bar">
                <div className="home-progress-fill" style={{ width: '91%' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="home-features-section">
          <h2 className="home-section-title home-animate-on-scroll">WHY CHOOSE NEUROPLAY?</h2>
          <div className="home-features-grid">
            <div className="home-feature-card home-animate-on-scroll">
              <div className="home-feature-icon">
                <FaBrain />
              </div>
              <h3>Science-Based Design</h3>
              <p>Every game is crafted by neuroscientists using proven cognitive training methodologies to maximize brain improvement</p>
            </div>
            
            <div className="home-feature-card home-animate-on-scroll">
              <div className="home-feature-icon">
                <FaGamepad />
              </div>
              <h3>Engaging Gameplay</h3>
              <p>Experience addictive, fun games that make brain training feel like entertainment rather than work</p>
            </div>
            
            <div className="home-feature-card home-animate-on-scroll">
              <div className="home-feature-icon">
                <FaChartLine />
              </div>
              <h3>Progress Tracking</h3>
              <p>Monitor your cognitive improvement with detailed analytics and personalized insights into your brain training journey</p>
            </div>
            
            <div className="home-feature-card home-animate-on-scroll">
              <div className="home-feature-icon">
                <FaUsers />
              </div>
              <h3>Community Challenges</h3>
              <p>Compete with friends and join global leaderboards to stay motivated and challenge yourself against others</p>
            </div>
            
            <div className="home-feature-card home-animate-on-scroll">
              <div className="home-feature-icon">
                <FaMedal />
              </div>
              <h3>Achievement System</h3>
              <p>Unlock rewards, badges, and achievements as you progress through levels and reach new cognitive milestones</p>
            </div>
            
            <div className="home-feature-card home-animate-on-scroll">
              <div className="home-feature-icon">
                <FaLock />
              </div>
              <h3>Secure & Private</h3>
              <p>Your personal data and progress are protected with enterprise-grade security and privacy measures</p>
            </div>
          </div>
        </section>

      {/* Featured Games Section */}
      <section className="home-featured-games">
        <h2 className="home-section-title home-animate-on-scroll">FEATURED GAMES</h2>
        <div className="home-game-grid">
          {[
            { id: 1, title: "Neon Apocalypse", genre: "FPS" },
            { id: 2, title: "Quantum Drift", genre: "Racing" },
            { id: 3, title: "Shadow Legends", genre: "RPG" },
            { id: 4, title: "Cyber Siege", genre: "Strategy" }
          ].map((game) => (
            <div key={game.id} className="home-game-tile home-animate-on-scroll">
              <div className="home-game-tile-image"></div>
              <h3>{game.title}</h3>
              <span className="home-game-genre">{game.genre}</span>
              <button className="home-game-button">EXPLORE</button>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="home-newsletter home-animate-on-scroll">
        <h2>STAY UPDATED</h2>
        <p>Subscribe to our newsletter for the latest gaming news and exclusive offers</p>
        <form className="home-newsletter-form">
          <input type="email" placeholder="Your email address" required />
          <button type="submit">SUBSCRIBE</button>
        </form>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;