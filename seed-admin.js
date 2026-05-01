#!/usr/bin/env node

/**
 * Seed Script - Create Test Admin User
 * Usage: node seed-admin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/unisphere';
const TEST_ADMIN = {
  name: 'Admin User',
  email: 'admin@unisphere.edu',
  password: 'admin123',
  role: 'admin'
};

async function seedAdmin() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: TEST_ADMIN.email });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create new admin
    console.log('👤 Creating admin user...');
    const admin = new User({
      name: TEST_ADMIN.name,
      email: TEST_ADMIN.email,
      password: TEST_ADMIN.password,
      role: TEST_ADMIN.role
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log(`📧 Email: ${TEST_ADMIN.email}`);
    console.log(`🔑 Password: ${TEST_ADMIN.password}`);

    await mongoose.disconnect();
    console.log('✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedAdmin();
