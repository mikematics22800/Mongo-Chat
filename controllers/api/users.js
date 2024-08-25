// ObjectId() method for converting UserId string into an ObjectId for querying database
const router = require('express').Router();
const { User, Thought } = require('../../models');

// Get all users
router.get('/', async (req, res) => {
  try {
    const Users = await User.find();
    return res.json(Users);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

// Get a user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: 'No User with that ID' });
    }
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

// Create a user
router.post('/', async (req, res) => {
  try {
    await User.create(req.body);
    return res.json('User created!');
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Update a user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ message: 'No User with that ID' });
    }
    return res.json('User updated!');
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

// Delete a user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: 'No User with that ID' });
    }
    await Thought.deleteMany({ username: user.username });
    await User.findOneAndDelete({ _id: req.params.id });
    return res.json({ message: 'User deleted!' });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Add a friend to a user's friend list
router.post('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'No User with that ID' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'No User with that ID' });
    }
    return res.json({ message: 'Friend deleted!' });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

module.exports = router;

