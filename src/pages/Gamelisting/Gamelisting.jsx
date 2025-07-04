import React, { useState } from 'react';

export default function GamesListing() {
  const [hoveredGame, setHoveredGame] = useState(null);

  const games = [
    {
      id: 'wordle',
      title: 'Wordle',
      description: 'Guess the 5-letter word in 6 tries. Test your vocabulary! Green means go, yellow means slow, gray means... oh no',
      color: 'linear-gradient(135deg, #6e00ff, #9d00ff, #ff00e4)',
      bgColor: 'linear-gradient(135deg, rgba(110, 0, 255, 0.2), rgba(157, 0, 255, 0.2))',
      glowColor: 'rgba(110, 0, 255, 0.3)',
      icon: 'W',
      difficulty: 'Medium',
      players: '1 Player'
    },
      {
      id: 'chess',
      title: 'Chess',
      description: 'Classic strategy game. Plan your moves and outsmart your opponent in this timeless battle.',
      color: 'linear-gradient(135deg, #a78bfa, #6366f1, #2563eb)',
      bgColor: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(37, 99, 235, 0.2))',
      glowColor: 'rgba(139, 92, 246, 0.3)',
      icon: '♛',
      difficulty: 'Expert',
      players: '2 Players'
    },
    {
      id: '2048',
      title: '2048',
      description: 'Combine tiles to reach 2048! Strategic sliding puzzle that challenges your planning.',
      color: 'linear-gradient(135deg, #ff00e4, #9d00ff, #00f7ff)',
      bgColor: 'linear-gradient(135deg, rgba(255, 0, 228, 0.2), rgba(157, 0, 255, 0.2))',
      glowColor: 'rgba(255, 0, 228, 0.3)',
      icon: '2048',
      difficulty: 'Hard',
      players: '1 Player'
    },
  
    {
      id: 'simon',
      title: 'Simon Says',
      description: 'Remember and repeat the sequence! Train your memory with this colorful challenge.',
      color: 'linear-gradient(135deg, #22d3ee, #3b82f6, #6366f1)',
      bgColor: 'linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(37, 99, 235, 0.2))',
      glowColor: 'rgba(34, 211, 238, 0.3)',
      icon: '●',
      difficulty: 'Easy',
      players: '1 Player'
    }
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0f2e 25%, #2d1b4e 50%, #1a0f2e 75%, #0f0f1a 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Montserrat', system-ui, -apple-system, sans-serif"
    },
    backgroundEffects: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none'
    },
    bgEffect1: {
      position: 'absolute',
      top: '25%',
      left: '25%',
      width: '384px',
      height: '384px',
      background: 'radial-gradient(circle, rgba(110, 0, 255, 0.1) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(60px)',
      animation: 'pulse 4s ease-in-out infinite'
    },
    bgEffect2: {
      position: 'absolute',
      bottom: '25%',
      right: '25%',
      width: '320px',
      height: '320px',
      background: 'radial-gradient(circle, rgba(255, 0, 228, 0.1) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(60px)',
      animation: 'pulse 4s ease-in-out infinite 2s'
    },
    bgEffect3: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '288px',
      height: '288px',
      background: 'radial-gradient(circle, rgba(0, 247, 255, 0.05) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(60px)'
    },
    header: {
      position: 'relative',
      zIndex: 10,
      textAlign: 'center',
      padding: '32px 0'
    },
    mainTitle: {
      fontSize: 'clamp(3rem, 8vw, 7rem)',
      fontWeight: '700',
      fontFamily: "'Orbitron', monospace",
      marginBottom: '16px',
      background: 'linear-gradient(135deg, #6e00ff, #ff00e4, #00f7ff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '1.25rem',
      maxWidth: '512px',
      margin: '0 auto',
      lineHeight: '1.6',
      fontWeight: '300'
    },
    gamesContainer: {
      position: 'relative',
      zIndex: 10,
      maxWidth: '1024px',
      margin: '0 auto',
      padding: '0 32px 64px'
    },
    gamesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '48px',
      justifyItems: 'center',
      maxWidth: '800px',
      margin: '0 auto'
    },
    gameCard: {
      position: 'relative',
      cursor: 'pointer',
      perspective: '1000px'
    },
    cardInner: (isHovered) => ({
      transform: isHovered 
        ? 'rotateX(-10deg) rotateY(10deg) translateZ(50px) scale(1.05)' 
        : 'rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
      transformStyle: 'preserve-3d',
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative'
    }),
    cardGlow: (game, isHovered) => ({
      position: 'absolute',
      inset: '-16px',
      background: game.color,
      borderRadius: '24px',
      filter: 'blur(40px)',
      opacity: isHovered ? 0.6 : 0.3,
      transition: 'opacity 0.5s ease'
    }),
    card: (game) => ({
      position: 'relative',
      width: '320px',
      height: '420px',
      background: game.bgColor,
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }),
    iconSection: {
      position: 'relative',
      height: '192px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    },
    backgroundPattern: {
      position: 'absolute',
      inset: 0,
      opacity: 0.1
    },
    patternOverlay: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%)'
    },
    gameIcon: (game, isHovered) => ({
      position: 'relative',
      zIndex: 10,
      width: '96px',
      height: '96px',
      background: game.color,
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      transform: isHovered ? 'scale(1.1) rotate(12deg)' : 'scale(1) rotate(0deg)',
      transition: 'all 0.5s ease',
      fontSize: game.id === '2048' ? '14px' : '32px',
      fontWeight: 'bold',
      color: 'white'
    }),
    iconGlow: (game) => ({
      position: 'absolute',
      inset: 0,
      background: game.color,
      borderRadius: '16px',
      filter: 'blur(16px)',
      opacity: 0.5,
      zIndex: -1
    }),
    contentSection: {
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      flex: 1,
      justifyContent: 'space-between'
    },
    gameTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#ffffff',
      marginBottom: '8px'
    },
    gameDescription: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '14px',
      lineHeight: '1.5'
    },
    gameInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    infoColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    infoRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    infoDot: (game) => ({
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: game.color
    }),
    infoText: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '12px'
    },
      playButton: (game) => ({
        background: 'transparent',
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '8px',
    width: 'fit-content',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.1)'
    }
    }),
    floatingParticle1: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      width: '8px',
      height: '8px',
      backgroundColor: 'rgba(0, 247, 255, 0.6)',
      borderRadius: '50%',
      animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
    },
    floatingParticle2: {
      position: 'absolute',
      top: '32px',
      right: '32px',
      width: '4px',
      height: '4px',
      backgroundColor: 'rgba(255, 0, 228, 0.4)',
      borderRadius: '50%',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
    },
    floatingParticle3: {
      position: 'absolute',
      bottom: '16px',
      left: '16px',
      width: '6px',
      height: '6px',
      backgroundColor: 'rgba(110, 0, 255, 0.5)',
      borderRadius: '50%',
      animation: 'bounce 1s infinite'
    },
    bottomCta: {
      position: 'relative',
      zIndex: 10,
      textAlign: 'center',
      paddingBottom: '64px'
    },
    ctaBox: {
      display: 'inline-block',
      background: 'rgba(15, 15, 26, 0.8)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(110, 0, 255, 0.3)',
      borderRadius: '16px',
      padding: '16px 32px'
    },
    ctaText: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '18px'
    }
  };

  // CSS animations
  const cssAnimations = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes ping {
      75%, 100% {
        transform: scale(2);
        opacity: 0;
      }
    }
    @keyframes bounce {
      0%, 100% {
        transform: translateY(-25%);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      }
      50% {
        transform: translateY(0);
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      }
    }
    .play-button:hover {
      transform: scale(1.05) !important;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2) !important;
    }
  `;

  // Grid patterns for each game
  const renderBackgroundPattern = (gameId) => {
    if (gameId === 'wordle') {
      return (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', padding: '16px'}}>
          {Array.from({length: 25}).map((_, i) => (
            <div key={i} style={{aspectRatio: '1', backgroundColor: 'rgba(110, 0, 255, 0.2)', borderRadius: '2px'}}></div>
          ))}
        </div>
      );
    }
    if (gameId === '2048') {
      return (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', padding: '16px'}}>
          {Array.from({length: 16}).map((_, i) => (
            <div key={i} style={{aspectRatio: '1', backgroundColor: 'rgba(255, 0, 228, 0.2)', borderRadius: '2px'}}></div>
          ))}
        </div>
      );
    }
    if (gameId === 'chess') {
      return (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 0, padding: '16px'}}>
          {Array.from({length: 64}).map((_, i) => (
            <div key={i} style={{
              aspectRatio: '1', 
              backgroundColor: (Math.floor(i/8) + i) % 2 === 0 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'
            }}></div>
          ))}
        </div>
      );
    }
    if (gameId === 'simon') {
      return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px'}}>
            <div style={{width: '64px', height: '64px', backgroundColor: 'rgba(248, 113, 113, 0.3)', borderRadius: '64px 0 0 0'}}></div>
            <div style={{width: '64px', height: '64px', backgroundColor: 'rgba(96, 165, 250, 0.3)', borderRadius: '0 64px 0 0'}}></div>
            <div style={{width: '64px', height: '64px', backgroundColor: 'rgba(250, 204, 21, 0.3)', borderRadius: '0 0 0 64px'}}></div>
            <div style={{width: '64px', height: '64px', backgroundColor: 'rgba(34, 197, 94, 0.3)', borderRadius: '0 0 64px 0'}}></div>
          </div>
        </div>
      );
    }
  };

  const GameCard = ({ game, index }) => {
    const isHovered = hoveredGame === game.id;

    return (
      <div 
        style={styles.gameCard}
        onMouseEnter={() => setHoveredGame(game.id)}
        onMouseLeave={() => setHoveredGame(null)}
      >
        <div style={styles.cardInner(isHovered)}>
          <div style={styles.cardGlow(game, isHovered)}></div>
          <div style={styles.card(game)}>
            <div style={styles.iconSection}>
              <div style={styles.backgroundPattern}>
                <div style={styles.patternOverlay}></div>
                {renderBackgroundPattern(game.id)}
              </div>
              <div>
                <div style={styles.iconGlow(game)}></div>
                <div style={styles.gameIcon(game, isHovered)}>
                  {game.icon}
                </div>
              </div>
            </div>
            <div style={styles.contentSection}>
              <div>
                <h3 style={styles.gameTitle}>{game.title}</h3>
                <p style={styles.gameDescription}>{game.description}</p>
              </div>
              <div style={styles.gameInfo}>
                <div style={styles.infoColumn}>
                  <div style={styles.infoRow}>
                    <div style={styles.infoDot(game)}></div>
                    <span style={styles.infoText}>{game.difficulty}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <div style={{...styles.infoDot(game), background: 'rgba(255, 255, 255, 0.7)'}}></div>
                    <span style={styles.infoText}>{game.players}</span>
                  </div>
                </div>
                <button 
                  className="play-button"
                  style={styles.playButton(game)}
                >
                  Play Now
                </button>
              </div>
            </div>
            {isHovered && (
              <>
                <div style={styles.floatingParticle1}></div>
                <div style={styles.floatingParticle2}></div>
                <div style={styles.floatingParticle3}></div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{cssAnimations}</style>
      <div style={styles.container}>
        <div style={styles.backgroundEffects}>
          <div style={styles.bgEffect1}></div>
          <div style={styles.bgEffect2}></div>
          <div style={styles.bgEffect3}></div>
        </div>
        
        <div style={styles.header}>
          <h1 style={styles.mainTitle}>Memory Games</h1>
          <p style={styles.subtitle}>
            Challenge your mind with our collection of brain-training games. 
            Boost your memory, strategy, and problem-solving skills!
          </p>
        </div>
        
        <div style={styles.gamesContainer}>
          <div style={styles.gamesGrid}>
            {games.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </div>
        </div>
        
        <div style={styles.bottomCta}>
          <div style={styles.ctaBox}>
            <span style={styles.ctaText}>
              More games coming soon! Stay tuned for updates.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}