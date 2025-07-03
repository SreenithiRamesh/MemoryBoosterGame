import React, { useEffect } from 'react';
import './Home.css';
import { FaBrain } from 'react-icons/fa';
import Footer from '../../components/Footer/Footer';
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

    // Game Icon floating animation (new observer)
    const gameIconsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('floating-active');
          gameIconsObserver.unobserve(entry.target); // Stop observing once animated
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.floating-game-icon').forEach((el) => {
      gameIconsObserver.observe(el);
    });


    return () => {
      observer.disconnect();
      statsObserver.disconnect();
      gameIconsObserver.disconnect(); // Disconnect new observer
    };
  }, []);

  // Define your game icons and their paths
  const gameIcons = [
    { id: 'logic', name: 'Logic Puzzles', iconSrc: '/images/icon-logic.png', link: '/games/logic' },
    { id: 'memory', name: 'Memory Match', iconSrc: '/images/icon-memory.png', link: '/games/memory' },
    { id: 'strategy', name: 'Strategy Challenges', iconSrc: '/images/icon-strategy.png', link: '/games/strategy' },
    { id: 'word', name: 'Word Games', iconSrc: '/images/icon-word.png', link: '/games/word' },
    { id: 'visual', name: 'Visual Perception', iconSrc: '/images/icon-visual.png', link: '/games/visual' },
    { id: 'riddle', name: 'Riddles', iconSrc: '/images/icon-riddle.png', link: '/games/riddle' },
  ];

  return (
    <div className="home-page">
      {/* Video Background */}
      <div className="video-background">
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
        <div className="overlay"></div>
      </div>
      {/* Header */}
      <header className="header">
        <div className="logo">NEUROPLAY</div>
        <nav className="nav">
          <a href="#home" className="nav-link">Home</a>
          <a href="/Games" className="nav-link">Games</a>
          <a href="/login" className="nav-link">Login / Register</a>
         
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
          {/* <section className="">
           
          </section> */}

          {/* <div className="game-card animate-on-scroll">
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
            <Link to="/wordle-levels" className="game-button">
              PLAY NOW
            </Link>
          </div> */}
        </div>
      </main>

      

      {/* --- NEW SECTION: Game Explorer with Floating Icons --- */}
      {/* <section className="game-explorer-section full-width-section">
        <h2 className="section-title animate-on-scroll">EXPLORE OUR BRAIN GAMES</h2>
        <p className="section-description animate-on-scroll">Dive into a world of challenges designed to boost your cognitive skills.</p>

        <div className="floating-icons-container">
          <div className="central-cta animate-on-scroll">
            <h3>Find Your Game!</h3>
            <p>Click an icon to learn more</p>
            <Link to="/play" className="cta-button small-button">VIEW ALL GAMES</Link>
          </div>

          {gameIcons.map((game, index) => (
            <Link
              to={game.link}
              key={game.id}
              className={`floating-game-icon icon-${game.id}`}
              style={{ '--animation-delay': `${index * 0.15}s` }} // Staggered animation
            >
              <img src={game.iconSrc} alt={`${game.name} icon`} />
              <span className="icon-name">{game.name}</span>
            </Link>
          ))}
        </div>
      </section> */}
      {/* --- END NEW SECTION --- */}

      {/* Featured Games Section */}
   <section className="featured-games">
  <h2 className="section-title animate-on-scroll">FEATURED GAMES</h2>
  <div className="game-grid">
    {[
      { 
        id: 1, 
        title: "Wordle", 
        genre: "Word Puzzle", 
        link: "/wordle-levels",
        
      },
      { 
        id: 2, 
        title: "Chess", 
        genre: "Strategy", 
        link: "/Chess-game",
       
      },
      { 
        id: 3, 
        title: "2048", 
        genre: "Puzzle", 
        link: "/flow2048",
       
      },
      { 
        id: 4, 
        title: "Simon", 
        genre: "Memory", 
        link: "/simon-game", // Replace with your Simon game route when ready
       
      }
    ].map((game) => (
      <div key={game.id} className="game-tile animate-on-scroll">
        <div className="game-image"></div>
        <h3>{game.title}</h3>
        <span className="game-genre">{game.genre}</span>
        
        <Link to={game.link} className="game-button">EXPLORE</Link>
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