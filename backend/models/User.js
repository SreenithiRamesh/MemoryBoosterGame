
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profileImage: {
    type: String,
    default: null
  },
  level: {
    type: Number,
    default: 1
  },
  totalXP: {
    type: Number,
    default: 0
  },
  gamesPlayed: {
    type: Number,
    default: 0
  },
  totalPlayTime: {
    type: Number,
    default: 0
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    notifications: {
      type: Boolean,
      default: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    }
  },
  achievements: [{
    type: {
      type: String,
      required: true
    },
    unlockedAt: {
      type: Date,
      default: Date.now
    },
    gameType: String
  }],
  gameStats: {
    chess: {
      gamesPlayed: { type: Number, default: 0 },
      bestScore: { type: Number, default: 0 },
      totalScore: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 }
    },
    wordle: {
      gamesPlayed: { type: Number, default: 0 },
      bestScore: { type: Number, default: 0 },
      totalScore: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 }
    },
    simon: {
      gamesPlayed: { type: Number, default: 0 },
      bestScore: { type: Number, default: 0 },
      totalScore: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 }
    },
    '2048': {
      gamesPlayed: { type: Number, default: 0 },
      bestScore: { type: Number, default: 0 },
      totalScore: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 }
    }
  }
}, {
  timestamps: true
});

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.updateGameStats = function (gameType, score) {
  if (this.gameStats[gameType]) {
    this.gameStats[gameType].gamesPlayed += 1;
    this.gameStats[gameType].totalScore += score;

    if (score > this.gameStats[gameType].bestScore) {
      this.gameStats[gameType].bestScore = score;
    }

    this.gameStats[gameType].averageScore = Math.round(
      this.gameStats[gameType].totalScore / this.gameStats[gameType].gamesPlayed
    );
  }

  this.gamesPlayed += 1;
};


userSchema.methods.calculateLevel = function () {

  this.level = Math.floor(this.totalXP / 1000) + 1;
};


userSchema.methods.addXP = function (xp) {
  this.totalXP += xp;
  this.calculateLevel();
};


userSchema.methods.unlockAchievement = function (type, gameType = null) {
  const existingAchievement = this.achievements.find(ach => ach.type === type && ach.gameType === gameType);

  if (!existingAchievement) {
    this.achievements.push({
      type,
      gameType,
      unlockedAt: new Date()
    });
  }
};


userSchema.virtual('currentStreak').get(function () {

  return 5;
});


userSchema.virtual('totalAchievements').get(function () {
  return this.achievements.length;
});


module.exports = mongoose.models.User || mongoose.model('User', userSchema);