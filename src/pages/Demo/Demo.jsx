import React, { useEffect } from 'react';
import './Demo.css';
import { FaBrain, FaGamepad, FaChartLine, FaUsers, FaMedal, FaLock } from 'react-icons/fa';

import { Link } from 'react-router-dom';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Demo = () => {
  useEffect(() => {
    // Main Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    // Number counter animation
    const animateNumbers = () => {
      const numberElements = document.querySelectorAll('.stat-number');
      
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
      document.querySelectorAll('.progress-fill').forEach(bar => {
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

    document.querySelectorAll('.stat-card').forEach(card => {
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
      <div className="video-background">
        <video autoPlay loop muted playsInline>
          <source src="https://ik.imagekit.io/ytissbwn8/12691871_1920_1080_30fps%20(1).mp4?updatedAt=1750657705495" type="video/mp4" />
        </video>
        <div className="overlay"></div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="logo">NEUROPLAY</div>
        <nav className="nav">
          <a href="#home" className="nav-link">Home</a>
          <a href="/play" className="nav-link">Games</a>
          <a href="#news" className="nav-link">Benefits</a>
          <a href="#community" className="nav-link">Community</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>
      </header>

      
<section className="hero-section">
  <main className="main-content">
        <div className="hero-text animate-on-scroll">
          <h1 className="title">SHARPEN YOUR MIND</h1>
          <p className="subtitle">The Gym Membership Your Brain Deserves</p>
          <button className="cta-button">EXPLORE MORE</button>
        </div>
        </main>
  
  <div className="hero-image">
    <div className="hero-image-background"></div>
    <div className="floating-games">
      {/* Wordle */}
      <div className="floating-game wordle">
        <div className="game-card-wrapper">
          <img 
            src="./wordle.png" 
            alt="Wordle game" 
            className="game-image"
          />
          <div className="game-label">Wordle</div>
        </div>
      </div>
      
      {/* Chess */}
      <div className="floating-game chess">
        <div className="game-card-wrapper">
          <img 
            src="./chess.jpg" 
            alt="Chess game" 
            className="game-image"
          />
          <div className="game-label">Chess</div>
        </div>
      </div>
      
      {/* Simon */}
      <div className="floating-game simon">
        <div className="game-card-wrapper">
          <img 
            src="./simon2.jpg" 
            alt="Simon game" 
            className="game-image"
          />
          <div className="game-label">Simon</div>
        </div>
      </div>
      
      {/* 2048 */}
      <div className="floating-game game2048">
        <div className="game-card-wrapper">
          <img 
            src="./20483.png" 
            alt="2048 game" 
            className="game-image"
          />
          <div className="game-label">2048</div>
        </div>
      </div>
    </div>
    
    {/* Decorative elements */}
    <div className="hero-decorations">
      <div className="decoration-circle circle-1"></div>
      <div className="decoration-circle circle-2"></div>
      <div className="decoration-circle circle-3"></div>
    </div>
  </div>
</section>

        {/* Brain Benefits Section */}
        <section className="brain-benefits full-width-section">
          <h2 className="section-title animate-on-scroll">YOUR BRAIN ON NEUROPLAY</h2>
          

          <div className="animated-stats">
            <div className="stat-card animate-on-scroll">
              <div className="stat-number" data-target="87">0</div>
              <p>Memory Retention</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '87%' }}></div>
              </div>
            </div>
            
            <div className="stat-card animate-on-scroll">
              <div className="stat-number" data-target="63">0</div>
              <p>Focus Improvement</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '63%' }}></div>
              </div>
            </div>
            
            <div className="stat-card animate-on-scroll">
              <div className="stat-number" data-target="91">0</div>
              <p>User Satisfaction</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '91%' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-title animate-on-scroll">WHY CHOOSE NEUROPLAY?</h2>
          <div className="features-grid">
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <FaBrain />
              </div>
              <h3>Science-Based Design</h3>
              <p>Every game is crafted by neuroscientists using proven cognitive training methodologies to maximize brain improvement</p>
            </div>
            
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <FaGamepad />
              </div>
              <h3>Engaging Gameplay</h3>
              <p>Experience addictive, fun games that make brain training feel like entertainment rather than work</p>
            </div>
            
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <FaChartLine />
              </div>
              <h3>Progress Tracking</h3>
              <p>Monitor your cognitive improvement with detailed analytics and personalized insights into your brain training journey</p>
            </div>
            
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <FaUsers />
              </div>
              <h3>Community Challenges</h3>
              <p>Compete with friends and join global leaderboards to stay motivated and challenge yourself against others</p>
            </div>
            
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <FaMedal />
              </div>
              <h3>Achievement System</h3>
              <p>Unlock rewards, badges, and achievements as you progress through levels and reach new cognitive milestones</p>
            </div>
            
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <FaLock />
              </div>
              <h3>Secure & Private</h3>
              <p>Your personal data and progress are protected with enterprise-grade security and privacy measures</p>
            </div>
          </div>
        </section>

        {/* <div className='animation'>
          {/* Game Info Card 
          <section className="">
          </section>

          <div className="game-card animate-on-scroll">
            <h2>WORDLE CHALLENGE</h2>
            <div className="game-details">
              <p>Our scientifically-designed version of Wordle enhances:</p>
              <ul>
                <li>Vocabulary retention</li>
                <li>Pattern recognition</li>
                <li>Cognitive flexibility</li>
                <li>Working memory</li>
              </ul>
              <div className="stats">
                <div className="stat-item">
                  <FaBrain className="stat-icon" />
                  <span> +31% memory improvement</span>
                </div>
              </div>
              <div className="rating">⭐⭐⭐⭐⭐ 4.9/5</div>
            </div>
            <Link to="/wordle-levels" className="preview-button">
              PLAY NOW
            </Link>
          </div>
        </div> */}
      

      {/* Featured Games Section */}
      <section className="featured-games">
        <h2 className="section-title animate-on-scroll">FEATURED GAMES</h2>
        <div className="game-grid">
          {[
            { id: 1, title: "Neon Apocalypse", genre: "FPS" },
            { id: 2, title: "Quantum Drift", genre: "Racing" },
            { id: 3, title: "Shadow Legends", genre: "RPG" },
            { id: 4, title: "Cyber Siege", genre: "Strategy" }
          ].map((game) => (
            <div key={game.id} className="game-tile animate-on-scroll">
              <div className="game-image"></div>
              <h3>{game.title}</h3>
              <span className="game-genre">{game.genre}</span>
              <button className="game-button">EXPLORE</button>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter animate-on-scroll">
        <h2>STAY UPDATED</h2>
        <p>Subscribe to our newsletter for the latest gaming news and exclusive offers</p>
        <form className="newsletter-form">
          <input type="email" placeholder="Your email address" required />
          <button type="submit">SUBSCRIBE</button>
        </form>
      </section>
    
    </div>
  );
};

export default Demo;