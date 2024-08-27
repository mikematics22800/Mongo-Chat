const router = require('express').Router();
const { Thought, User } = require('../../models');

// get all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find();
    return res.status(200).json(thoughts);
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
    return res.status(200).json(thought);
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
      { username: req.body.username },
      { $addToSet: { thoughts: thought._id } },
      { new: true }
    )
    return res.status(200).json('Thought created!');
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
    return res.status(200).json('Thought updated!');
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

// delete a thought by id
router.delete('/:id', async (req, res) => {
  try {
    const thought = await Thought.findOneAndDelete({ _id: req.params.id });
    if (!thought) {
      return res.status(404).json({ message: 'No thought with that ID' });
    }
    await User.findOneAndUpdate(
      { username: thought.username },
      { $pull: { thoughts: thought._id } }
    )
    return res.status(200).json('Thought deleted!');
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

// create a new reaction
router.post('/:id/reactions', async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { 
          reactions: {
            reactionBody: req.body.reactionBody,
            username: req.body.username
          } 
      }},
      { new: true }
    );
    if (!thought) {
      return res.status(404).json({ message: 'No thought with that ID' });
    }
    return res.status(200).json('Reaction added!');
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

// delete a reaction
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { _id: req.params.reactionId } } }
    );
    if (!thought) {
      return res.status(404).json({ message: 'No thought with that ID' });
    }
    return res.status(200).json('Reaction deleted!');
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

module.exports = router;