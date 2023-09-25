const mongoose = require('mongoose');
const usersData = require('./sampledata');
const User = require('../models/User'); // Import your User model

const seedDatabase = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Insert usersData into the User collection
    await User.insertMany(usersData);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Export the seedDatabase function
module.exports = seedDatabase;
