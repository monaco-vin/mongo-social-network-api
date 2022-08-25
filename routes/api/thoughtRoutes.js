const router = require("express").Router();
const { Thought } = require("../../models");

router
  .route("/")
  .get((req, res) => {
    Thought.find({})
      .then((thoughts) => res.json(thoughts))
      .catch((err) => console.log(err)); //res.status(500).json(err));
  })
  .post((req, res) => {
    Thought.create(req.body)
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  });

router
  .route("/:id")
  .get((req, res) => {
    Thought.findOne({ _id: req.params.id })
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  })
  .put((req, res) => {
    Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with this id!" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  })
  .delete((req, res) => {
    Thought.findOneAndDelete({ _id: req.params.id })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json({ message: "Thought deleted!" })
      )
      .catch((err) => res.status(500).json(err));
  });

router.route("/:thoughtId/reactions").post((req, res) => {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $addToSet: { reactions: req.body } },
    { runValidators: true, new: true }
  )
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: "No thought with this id!" })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
});

router.route("/:thoughtId/reactions/:reactionId").delete((req, res) => {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: { reactionId: req.params.reactionId } } }
  )
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(500).json(err));
});
module.exports = router;
