import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, X, HelpCircle, Lightbulb, RotateCcw, Sparkles } from 'lucide-react';
import './AIAssistant.css';

const AIAssistant = ({ gameState, onGameAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your Game Genius AI assistant. I can help with strategies for Memory Booster, Wordle, Chess, 2048, Simon, and more. What game would you like assistance with?",
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAttention, setShowAttention] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isOpen && showAttention) {
      const timer = setTimeout(() => {
        setShowAttention(true);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, showAttention]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enthusiastic Response Generator
  const getEnthusiasticResponse = () => {
    const responses = [
      "Fantastic! Get ready to flex that brain muscle—you've totally got this! 🚀",
      "Okay! Time to crush this level. Remember: focus like a laser and trust your instincts! 💥",
      "All systems go! Your memory is about to level up. Let's do this! 🌟",
      "Heck yes! Prepare for liftoff 🚨—your focus is your superpower today. Go get 'em! 🔥",
      "Okay! Deep breath... now let's conquer this challenge together! I believe in you! 💪",
      "Game face ON! 🎯 This is where the magic happens. Show that memory who's boss! 😎",
      "Ready? Set? DOMINATE! Your brain is a powerhouse—unleash it! ⚡",
      "Okay! Warning: Extreme awesomeness ahead. Dive in and own this round! 🌈",
      "Let's goooo! 🎮 Your focus is unstoppable today. Make those neurons proud! 🧠✨",
      "Perfect! Channel your inner memory champion—today's victory is yours! 🏆",
      "Epic! Your brain's about to go into beast mode - let's make those patterns bow down! 🦁⚡",
      "Confirmation received! Initiating maximum focus protocol in 3...2...1... GO! 🚨🧠",
      "YES! Cue the superhero music 🎧 - your memory powers are activating NOW! 💥🦸",
      "Game engines FIRED UP! Prepare for memory domination - I'll be your hype squad! 📣🔥",
      "Acknowledged! Warning: Cognitive overload imminent - in the BEST way possible! ⚠️💡"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Enhanced AI Response Logic
  const generateAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Check for enthusiastic response triggers first
    if (message.includes('ok') || 
        message.includes('ready') || 
        message.includes('go') || 
        message.includes('start') ||
        message.includes('let\'s go') ||
        message.includes('begin')) {
      return getEnthusiasticResponse();
    }
    
    // Memory Booster responses
    if (message.includes('memory') || message.includes('booster')) {
      if (message.includes('hint') || message.includes('help') || message.includes('stuck')) {
        return "For Memory Booster:\n\n• Chunking: Group items into smaller, manageable pieces\n• Visualization: Create mental images of sequences\n• Repetition: Practice patterns mentally\n• Association: Connect patterns to familiar things\n\nFocus on one section at a time!";
      }
      
      if (message.includes('score') || message.includes('improve')) {
        return "To improve your score:\n\n• Start with shorter sequences\n• Take breaks to avoid mental fatigue\n• Practice consistently\n• Use the 'memory palace' technique\n• Stay relaxed and focused";
      }
      
      return "Memory Booster trains short-term memory:\n\n• Focus intensely during pattern display\n• Create strong associations between items\n• Practice daily for best results\n• Gradually increase difficulty";
    }
    
    // Wordle responses
    if (message.includes('wordle')) {
      if (message.includes('start')) {
        return "Effective Wordle starting words:\n\n• CRANE: Common consonants and vowels\n• SLATE: Balanced vowel/consonant mix\n• ROAST: Tests multiple vowels\n• PIOUS: Reveals important vowels";
      }
      
      if (message.includes('strategy')) {
        return "Wordle strategies:\n\n1. Use first two guesses to test vowels\n2. Focus on letter frequency (E, T, A, O, I)\n3. Consider letter combinations (TH, CH, SH)\n4. Watch for double letters\n5. Eliminate possibilities systematically";
      }
      
      return "Wordle tips:\n\n• Start with words containing 2-3 vowels\n• Use second guess to test new letters\n• Pay attention to letter position clues\n• Consider multiple possibilities";
    }
    
    // Chess responses
    if (message.includes('chess')) {
      if (message.includes('beginner')) {
        return "Chess fundamentals:\n\n• Control the center\n• Develop pieces early\n• Castle for king safety\n• Piece Values: Pawn=1, Knight/Bishop=3, Rook=5, Queen=9\n• Tactics: Pins, forks, skewers";
      }
      
      if (message.includes('open')) {
        return "Popular chess openings:\n\n• Italian Game: e4 e5, Nf3 Nc6, Bc4\n• Ruy Lopez: e4 e5, Nf3 Nc6, Bb5\n• Sicilian Defense: e4 c5\n• French Defense: e4 e6";
      }
      
      return "Chess improvement:\n\n• Analyze your games (especially losses)\n• Solve tactical puzzles daily\n• Study endgame principles\n• Learn 1-2 openings deeply\n• Play longer time controls";
    }
    
    // 2048 responses
    if (message.includes('2048')) {
      if (message.includes('strategy')) {
        return "2048 strategy:\n\n1. Corner Strategy: Pick a corner (bottom right)\n2. Build Chains: Create descending order\n3. Fixed Direction: Stick to one primary direction\n4. Avoid Up Moves: Only when necessary\n5. Plan Merges: Think 2-3 moves ahead";
      }
      
      return "2048 tips:\n\n• Focus on building chains\n• Keep tiles organized\n• Avoid random moves\n• Create space by merging\n• Keep the board as empty as possible";
    }
    
    // Simon responses
    if (message.includes('simon')) {
      if (message.includes('remember')) {
        return "Simon pattern techniques:\n\n• Color Association: Assign numbers to colors\n• Chunking: Group sequences\n• Rhythm Method: Create rhythmic patterns\n• Storytelling: Colors represent characters/actions";
      }
      
      return "Simon strategies:\n\n• Focus on sound cues\n• Tap sequences on your leg\n• Use both visual and auditory memory\n• Relax to improve recall\n• Practice daily";
    }
    
    // Game recommendations
    if (message.includes('which game') || message.includes('recommend')) {
      return `Game recommendations:\n
• Memory Training: Memory Booster, Simon, Match Madness\n
• Word Skills: Wordle, Scrabble Go, Alphabear\n
• Strategy: Chess, Mini Metro, Plague Inc.\n
• Puzzle Solving: 2048, Monument Valley, The Room\n
• Quick Thinking: Reaction Arena, Quick Brain, Helix Jump\n
• Logic Boost: Lumosity, Sudoku, Brain It On!\n
• Creative: Minecraft, Terraforming Mars, Baba Is You`;
    }
    else if (message.includes('memory game') || message.includes('concentration')) {
      return "Boost your recall power with:\n\n• Peak Memory Games\n• Elevate - Brain Training\n• Memory Match: Brain Trainer\n• Memorado\n(Pro tip: Start with 5-minute daily sessions!)";
    }
    else if (message.includes('word game') || message.includes('vocabulary')) {
      return "Level up your language skills:\n\n• Duolingo\n• Bookworm Adventures\n• TypeShift\n• Anagrams\n\n🔥 Try the 'Word Master' challenge mode!";
    }
    else if (message.includes('quick game') || message.includes('fast')) {
      return "Need a speedy brain boost? Try:\n\n• 60 Seconds Challenge!\n• Fast Like a Fox\n• Stack Jump\n• Tiles Hop\n\n⌛ Perfect for 3-minute breaks!";
    }
    else if (message.includes('offline game') || message.includes('no wifi')) {
      return "No internet? No problem!\n\n• Brain Dots (Puzzle)\n• Unblock Me (Logic)\n• Flow Free (Spatial)\n• Brain Test (Riddles)\n\n🚀 All work offline!";
    }
    else if (message.includes('kids game') || message.includes('child')) {
      return "Kid-friendly brain builders:\n\n• Thinkrolls (Logic)\n• Endless Alphabet\n• MentalUP Kids\n• Sago Mini\n\n👧 Rated 5+ with educational benefits!";
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! I can help with:\n\n• Memory Booster strategies\n• Wordle starting words\n• Chess openings\n• 2048 techniques\n• Simon pattern memorization\n\nWhich game interests you?";
    }
    
    if (message.includes('thank')) {
      return "You're welcome! Happy gaming! 🎮";
    }
    
    // Default response
    return "I specialize in:\n\n• Memory Booster: Pattern strategies\n• Wordle: Starting words, letter strategies\n• Chess: Openings, tactics\n• 2048: Merging techniques\n• Simon: Memorization methods\n\nHow can I assist you?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setShowAttention(false);

    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { icon: HelpCircle, text: "Memory hint", action: () => setInputMessage("Memory Booster strategy") },
    { icon: Lightbulb, text: "Wordle start", action: () => setInputMessage("Wordle starting words") },
    { icon: RotateCcw, text: "2048 strategy", action: () => setInputMessage("2048 merging strategy") },
    { icon: HelpCircle, text: "Chess opening", action: () => setInputMessage("Best chess opening") }
  ];

  return (
    <div className="ai-assistant-container">
    
      {!isOpen && showAttention && (
        <div 
          className="attention-grabber"
          onClick={() => setIsOpen(true)}
        >
          <div className="assistant-icon">
            <Sparkles size={24} />
          </div>
          <div className="attention-content">
            <div className="attention-text">Game Assistant</div>
            <div className="sub-text">Need Help?</div>
          </div>
          <div className="arrow-indicator">
            <div className="arrow-dot"></div>
            <div className="arrow-dot"></div>
            <div className="arrow-dot"></div>
          </div>
        </div>
      )}

      {/* Chat Button - Minimal version */}
      {!isOpen && !showAttention && (
        <button
          onClick={() => setIsOpen(true)}
          className="chat-toggle-btn"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div className="chat-interface">
          <div className="chat-header">
            <div className="header-content">
              <div className="ai-icon">
                <Sparkles size={18} />
              </div>
              <span className="header-title">Game Genius Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="close-btn"
            >
              <X size={18} />
            </button>
          </div>

          <div className="messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-wrapper ${message.type === 'user' ? 'user-message' : 'ai-message'}`}
              >
                <div className={`message-bubble ${message.type === 'user' ? 'user-bubble' : 'ai-bubble'} ${message.id === 1 ? 'welcome-message' : ''}`}>
                  <div className="message-content">{message.content}</div>
                  <div className="message-timestamp">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message-wrapper ai-message">
                <div className="message-bubble ai-bubble">
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="quick-actions">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="quick-action-btn"
              >
                <action.icon size={12} />
                {action.text}
              </button>
            ))}
          </div>

          <div className="input-container">
            <div className="input-wrapper">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Memory Booster, Wordle, Chess, 2048..."
                className="message-input"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="send-btn"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;