
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.CLIENT_URL,
     process.env.FRONTEND_URL,
  'https://memoryboostergame-frontend.onrender.com'
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/memorybooster', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('MongoDB connection error:', err);
});

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
    default: function () {
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

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);


    if (!this.profileImage) {
      this.profileImage = `https://via.placeholder.com/40/6e00ff/ffffff?text=${this.username[0].toUpperCase()}`;
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function () {
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
    type: Number,
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


gameSessionSchema.virtual('formattedDate').get(function () {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

const GameSession = mongoose.model('GameSession', gameSessionSchema);


const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

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

app.get('/api/test', (req, res) => {
  res.json({
    message: '🚀 Memory Booster Backend is running!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, newsletter } = req.body;


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


    const user = new User({
      username,
      email,
      password,
      newsletter: newsletter || false
    });

    await user.save();

    const token = user.generateAuthToken();

    res.status(201).json({
      message: 'User registered successfully! Welcome to Memory Booster!',
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