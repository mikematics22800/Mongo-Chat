const router = require('express').Router();
const { Thought, User } = require('../../models');

// get all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find();
    return res.json(thoughts);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

// get one thought by id
router.get('/:id', async (req, res) => {
  try {
    const thought = await Thought.findOne({ _id: req.params.id });
    if (!thought) {
      return res.status(404).json({ message: 'No thought with that ID' });
    }
    return res.json(thought);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

// create a new thought
router.post('/', async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    await User.findOneAndUpdate(
      { _id: req.body.userId },
      { $addToSet: { thoughts: thought._id } },
      { new: true }
    )
    return res.json('Thought created!');
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// update a thought by id
router.put('/:id', async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.id },
      { thoughtText: req.body.thoughtText },
    );
    if (!thought) {
      return res.status(404).json({ message: 'No thought with that ID' });
    }
    return res.json('Thought updated!');
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

