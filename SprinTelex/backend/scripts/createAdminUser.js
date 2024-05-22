const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const dotenv = require('dotenv');

dotenv.config();

async function createAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL; // Use environment variable for admin's email
  const adminPassword = process.env.ADMIN_PASSWORD; // Use environment variable for admin's password
  const adminUsername = "admin";
  const adminLocation = process.env.ADMIN_LOCATION; // Use environment variable for admin's location
  const adminBio = "Admin user";

  try {
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      console.log('Admin user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    const adminUser = new User({
      email: adminEmail,
      password: hashedPassword,
      username: adminUsername,
      location: adminLocation,
      bio: adminBio,
      isAdmin: true // Ensure your user model supports an 'isAdmin' field or equivalent
    });

    await adminUser.save();
    console.log('Admin user created successfully');

    const token = jwt.sign(
      { email: adminUser.email, id: adminUser._id, isAdmin: adminUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log(`Admin JWT Token: ${token}`);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser();