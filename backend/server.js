// server.js - Complete Express Backend for Memory Booster
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',  // Create React App
    'http://localhost:5173',  // Vite
    'http://127.0.0.1:5173',  // Alternative localhost
    process.env.CLIENT_URL    // Production URL from .env
  ].filter(Boolean), // Remove undefined values
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/memorybooster', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('❌ MongoDB connection error:', err);
});

// User Schema - Enhanced for your gaming website
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profileImage: {
    type: String,
    default: function() {
      return `https://via.placeholder.com/40/6e00ff/ffffff?text=${this.username ? this.username[0].toUpperCase() : 'U'}`;
    }
  },
  newsletter: {
    type: Boolean,
    default: false
  },
  gameStats: {
    wordle: {
      gamesPlayed: { type: Number, default: 0 },
      gamesWon: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      maxStreak: { type: Number, default: 0 },
      bestTime: { type: Number, default: null }
    },
    chess: {
      gamesPlayed: { type: Number, default: 0 },
      gamesWon: { type: Number, default: 0 },
      rating: { type: Number, default: 1200 },
      bestGame: { type: String, default: null }
    },
    simon: {
      gamesPlayed: { type: Number, default: 0 },
      highScore: { type: Number, default: 0 },
      longestSequence: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 }
    },
    game2048: {
      gamesPlayed: { type: Number, default: 0 },
      highScore: { type: Number, default: 0 },
      bestTile: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 }
    }
  },
  totalScore: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  achievements: [{
    name: String,
    description: String,
    unlockedAt: { type: Date, default: Date.now }
  }],
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Set profile image if not provided
    if (!this.profileImage) {
      this.profileImage = `https://via.placeholder.com/40/6e00ff/ffffff?text=${this.username[0].toUpperCase()}`;
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { 
      userId: this._id, 
      email: this.email,
      username: this.username 
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
  return token;
};

const User = mongoose.model('User', userSchema);

// Game Score Schema for future game score tracking
const gameScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameType: {
    type: String,
    required: true,
    enum: ['wordle', 'chess', 'simon', '2048']
  },
  score: {
    type: Number,
    required: true
  },
  gameData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const GameScore = mongoose.model('GameScore', gameScoreSchema);

// Game Session Schema - Compatible with your dashboard
const gameSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameType: {
    type: String,
    required: true,
    enum: ['chess', 'wordle', 'simon', '2048']
  },
  score: {
    type: Number,
    required: true,
    default: 0
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  moves: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  completed: {
    type: Boolean,
    default: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  gameData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Virtual for formatted date
gameSessionSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

const GameSession = mongoose.model('GameSession', gameSessionSchema);

// Authentication Middleware - Updated to match dashboard expectations
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user from token
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Add user to request object - compatible with dashboard
    req.user = {
      id: user._id,
      userId: user._id,
      email: user.email,
      username: user.username
    };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// ROUTES

// Test Route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '🚀 Memory Booster Backend is running!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// Register Route - Matches your frontend exactly
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, newsletter } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: 'Username, email, and password are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email ? 
          'Email already registered' : 
          'Username already taken' 
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      newsletter: newsletter || false
    });

    await user.save();

    // Generate token
    const token = user.generateAuthToken();

    res.status(201).json({
      message: '✅ User registered successfully! Welcome to Memory Booster!',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        level: user.level,
        totalScore: user.totalScore
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login Route - Matches your frontend exactly
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = user.generateAuthToken();

    res.json({
      message: `🎮 Welcome back, ${user.username}! Ready to boost your memory?`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        level: user.level,
        totalScore: user.totalScore,
        gameStats: user.gameStats
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Helper function to calculate user statistics
const calculateUserStats = (sessions) => {
  if (!sessions.length) {
    return {
      totalGames: 0,
      bestScores: { chess: 0, wordle: 0, simon: 0, '2048': 0 },
      averageScores: { chess: 0, wordle: 0, simon: 0, '2048': 0 },
      totalPlayTime: 0,
      gamesPerType: { chess: 0, wordle: 0, simon: 0, '2048': 0 }
    };
  }

  const gameTypes = ['chess', 'wordle', 'simon', '2048'];
  const bestScores = {};
  const averageScores = {};
  const gamesPerType = {};
  
  gameTypes.forEach(type => {
    const typeSessions = sessions.filter(s => s.gameType === type);
    gamesPerType[type] = typeSessions.length;
    
    if (typeSessions.length > 0) {
      bestScores[type] = Math.max(...typeSessions.map(s => s.score));
      averageScores[type] = Math.round(
        typeSessions.reduce((sum, s) => sum + s.score, 0) / typeSessions.length
      );
    } else {
      bestScores[type] = 0;
      averageScores[type] = 0;
    }
  });

  const totalPlayTime = sessions.reduce((sum, session) => sum + session.duration, 0);

  return {
    totalGames: sessions.length,
    bestScores,
    averageScores,
    totalPlayTime: Math.round(totalPlayTime / 60), // convert to minutes
    gamesPerType
  };
};

// Helper function to get progress data for charts
const getProgressData = (sessions) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  
  const recentSessions = sessions.filter(session => 
    new Date(session.createdAt) >= thirtyDaysAgo
  );

  // Group by date
  const dailyData = {};
  recentSessions.forEach(session => {
    const date = new Date(session.createdAt).toISOString().split('T')[0];
    if (!dailyData[date]) {
      dailyData[date] = {
        date,
        games: 0,
        totalScore: 0,
        averageScore: 0
      };
    }
    dailyData[date].games++;
    dailyData[date].totalScore += session.score;
  });

  // Calculate averages and convert to array
  const progressArray = Object.values(dailyData).map(day => ({
    ...day,
    averageScore: Math.round(day.totalScore / day.games)
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  return progressArray;
};

// Main Dashboard Route - Fixed and Updated
app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user info
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all user's game sessions
    const allSessions = await GameSession.find({ userId })
      .sort({ createdAt: -1 });

    // Calculate user stats
    const stats = calculateUserStats(allSessions);

    // Get recent activity (last 10 games)
    const recentActivity = allSessions.slice(0, 10).map(session => ({
      gameType: session.gameType,
      score: session.score,
      duration: session.duration,
      date: session.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      completed: session.completed
    }));

    // Get progress data for charts (last 30 days)
    const progressData = getProgressData(allSessions);

    res.json({
      user: {
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        level: user.level || 1
      },
      stats,
      recentActivity,
      progressData
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Dashboard Stats Route
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const sessions = await GameSession.find({ userId });
    const stats = calculateUserStats(sessions);
    
    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard Recent Games Route
app.get('/api/dashboard/recent', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;
    
    const recentGames = await GameSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);
    
    const formattedGames = recentGames.map(game => ({
      gameType: game.gameType,
      score: game.score,
      duration: game.duration,
      date: game.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      completed: game.completed
    }));
    
    res.json(formattedGames);
  } catch (error) {
    console.error('Recent games error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save Game Session Route - Updated
app.post('/api/dashboard/game-session', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { gameType, score, duration, moves, level, gameData, difficulty } = req.body;

    // Validate required fields
    if (!gameType || score === undefined || !duration) {
      return res.status(400).json({ 
        message: 'Missing required fields: gameType, score, duration' 
      });
    }

    const newSession = new GameSession({
      userId,
      gameType,
      score,
      duration,
      moves: moves || 0,
      level: level || 1,
      difficulty: difficulty || 'medium',
      gameData: gameData || {}
    });

    await newSession.save();

    // Update user stats
    const user = await User.findById(userId);
    if (user) {
      user.gameStats[gameType === '2048' ? 'game2048' : gameType].gamesPlayed += 1;
      if (gameType === 'simon' || gameType === '2048') {
        const gameStatKey = gameType === '2048' ? 'game2048' : gameType;
        if (score > user.gameStats[gameStatKey].highScore) {
          user.gameStats[gameStatKey].highScore = score;
        }
      }
      user.totalScore += score;
      user.level = Math.floor(user.totalScore / 1000) + 1;
      await user.save();
    }

    res.status(201).json({
      message: 'Game session saved successfully',
      session: newSession
    });

  } catch (error) {
    console.error('Save game session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get User Profile Route
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        level: user.level,
        totalScore: user.totalScore,
        gameStats: user.gameStats,
        achievements: user.achievements,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// Update Game Score Route (for future game integration)
app.post('/api/game/score', authenticateToken, async (req, res) => {
  try {
    const { gameType, score, gameData } = req.body;

    // Validation
    const validGameTypes = ['wordle', 'chess', 'simon', '2048'];
    if (!validGameTypes.includes(gameType)) {
      return res.status(400).json({ message: 'Invalid game type' });
    }

    if (typeof score !== 'number') {
      return res.status(400).json({ message: 'Score must be a number' });
    }

    // Create game score record
    const gameScore = new GameScore({
      userId: req.user.userId,
      gameType,
      score,
      gameData: gameData || {}
    });

    await gameScore.save();

    // Update user stats
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update game-specific stats
    const gameStatKey = gameType === '2048' ? 'game2048' : gameType;
    const gameStats = user.gameStats[gameStatKey];
    gameStats.gamesPlayed += 1;

    // Game-specific updates
    switch (gameType) {
      case 'wordle':
        if (gameData.won) {
          gameStats.gamesWon += 1;
          gameStats.currentStreak += 1;
          gameStats.maxStreak = Math.max(gameStats.maxStreak, gameStats.currentStreak);
        } else {
          gameStats.currentStreak = 0;
        }
        if (gameData.time && (!gameStats.bestTime || gameData.time < gameStats.bestTime)) {
          gameStats.bestTime = gameData.time;
        }
        break;
        
      case 'simon':
        gameStats.highScore = Math.max(gameStats.highScore, score);
        gameStats.longestSequence = Math.max(gameStats.longestSequence, score);
        const total = gameStats.averageScore * (gameStats.gamesPlayed - 1) + score;
        gameStats.averageScore = Math.round(total / gameStats.gamesPlayed);
        break;
        
      case '2048':
        gameStats.highScore = Math.max(gameStats.highScore, score);
        if (gameData.bestTile) {
          gameStats.bestTile = Math.max(gameStats.bestTile, gameData.bestTile);
        }
        const total2048 = gameStats.averageScore * (gameStats.gamesPlayed - 1) + score;
        gameStats.averageScore = Math.round(total2048 / gameStats.gamesPlayed);
        break;
        
      case 'chess':
        if (gameData.won) {
          gameStats.gamesWon += 1;
          gameStats.rating += 20;
        } else {
          gameStats.rating = Math.max(800, gameStats.rating - 15);
        }
        break;
    }

    // Update total score and level
    user.totalScore += score;
    user.level = Math.floor(user.totalScore / 1000) + 1;

    await user.save();

    res.json({
      message: '🎯 Score updated successfully!',
      newStats: user.gameStats[gameStatKey],
      totalScore: user.totalScore,
      level: user.level
    });

  } catch (error) {
    console.error('Score update error:', error);
    res.status(500).json({ message: 'Server error updating score' });
  }
});

// Get Leaderboard Route (for future leaderboard feature)
app.get('/api/leaderboard/:gameType', authenticateToken, async (req, res) => {
  try {
    const { gameType } = req.params;
    const validGameTypes = ['wordle', 'chess', 'simon', '2048'];
    
    if (!validGameTypes.includes(gameType)) {
      return res.status(400).json({ message: 'Invalid game type' });
    }

    // Get top scores for the game type
    const topScores = await GameScore.aggregate([
      { $match: { gameType } },
      { $group: {
        _id: '$userId',
        bestScore: { $max: '$score' },
        gamesPlayed: { $sum: 1 },
        lastPlayed: { $max: '$completedAt' }
      }},
      { $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }},
      { $unwind: '$user' },
      { $project: {
        username: '$user.username',
        profileImage: '$user.profileImage',
        bestScore: 1,
        gamesPlayed: 1,
        lastPlayed: 1
      }},
      { $sort: { bestScore: -1 } },
      { $limit: 10 }
    ]);

    res.json({ leaderboard: topScores });

  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    res.status(500).json({ message: 'Server error fetching leaderboard' });
  }
});

// Logout Route (mainly handled on frontend)
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  res.json({ message: '👋 Logged out successfully! See you soon!' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'API endpoint not found',
    availableEndpoints: [
      'GET /api/test',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/user/profile',
      'POST /api/game/score',
      'GET /api/leaderboard/:gameType',
      'GET /api/dashboard',
      'GET /api/dashboard/stats',
      'GET /api/dashboard/recent',
      'POST /api/dashboard/game-session'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Memory Booster Backend running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🎮 Ready to serve your gaming website!`);
  console.log(`🎯 Dashboard API: http://localhost:${PORT}/api/dashboard`);
});