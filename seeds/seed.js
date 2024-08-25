const connection = require('../config/connection');
const { Thought, User } = require('../models');
const users = require('./users.json');
const thoughts = require('./thoughts.json');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');
  // Delete the collections if they exist
  let thoughtCheck = await connection.db.listCollections({ name: 'thought' }).toArray();
  if (thoughtCheck.length) {
    await connection.dropCollection('Thoughts');
  }

  let usersCheck = await connection.db.listCollections({ name: 'user' }).toArray();
  if (usersCheck.length) {
    await connection.dropCollection('Users');
  }

  // Add Users to the collections
  await User.create(users);

  // Add Thoughts to the collection
  await Thought.create(thoughts);

  // Log out the seed data to indicate what should appear in the database
  console.table(users);
  console.table(thoughts);
  console.info('Seeding complete! 🌱');
  process.exit(0);
});
