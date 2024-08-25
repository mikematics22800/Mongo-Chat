const connection = require('../config/connection');
const { User, Thought } = require('../models');
const userData = require('./userData.json');
const thoughtData = require('./thoughtData.json');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');
  // Delete the collections if they exist
  if (await connection.db.listCollections({ name: 'thoughts' }).hasNext()) {
    await connection.dropCollection('thoughts');
  }
  if (await connection.db.listCollections({ name: 'users' }).hasNext()) {
    await connection.dropCollection('users');
  }

  // Add data to collections 
  await User.create(userData);
  await Thought.create(thoughtData);

  const thoughts = await Thought.find();

  for (const thought of thoughts) {
    await User.findOneAndUpdate(
      { username: thought.username },
      { $addToSet: { thoughts: thought._id } },
      { new: true }
    );
  }

  console.info('Seeding complete! 🌱');
  process.exit(0);
});
