const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password in queries by default
    },
    studentId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values while keeping uniqueness
      trim: true,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    avatar: {
      type: String,
      default: null,
    },
    gpa: {
      type: Number,
      default: 0,
      min: 0,
      max: 4,
    },
    creditsEarned: {
      type: Number,
      default: 0,
    },
    totalCredits: {
      type: Number,
      default: 130,
    },
    yearLevel: {
      type: Number,
      default: 1,
      min: 1,
      max: 6,
    },
    // Privacy & preferences (matches Flutter settings/privacy screens)
    preferences: {
      pushNotifications: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: false },
      darkMode: { type: Boolean, default: false },
    },
    privacy: {
      profileVisible: { type: Boolean, default: true },
      showEmail: { type: Boolean, default: false },
      activityStatus: { type: Boolean, default: true },
      dataSharing: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true, // Adds createdAt & updatedAt automatically
  }
);

// ─── Hash password before saving ───────────────────
userSchema.pre('save', async function (next) {
  // Only hash if password was modified
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ─── Compare entered password with hashed password ─
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
