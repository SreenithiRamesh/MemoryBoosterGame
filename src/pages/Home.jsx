import React, { useEffect } from 'react';
import './Home.css';
import { FaBrain } from 'react-icons/fa';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Home = () => {
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

      {/* Main Content */}
      <main className="main-content">
        <div className="hero-text animate-on-scroll">
          <h1 className="title">SHARPEN YOUR MIND</h1>
          <p className="subtitle">The Gym Membership Your Brain Deserves</p>
          <button className="cta-button">EXPLORE MORE</button>
        </div>

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
<div className='animation'>


        {/* Game Info Card */}
        <section className="">
<div className="lottie-wrapper">
            <DotLottieReact
              src="https://lottie.host/f6bf6005-b758-4640-ba5b-2ced84931e2b/CIKMlI3wen.lottie"
              loop
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
          </div>
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
        </div>
      </main>

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
      
      <Footer />
    </div>
  );
};

export default Home;