const router = require("express").Router();
const { Thought, User } = require("../../models");

router
  .route("/")
  .get((req, res) => {
    User.find()
      .select("-__v")
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  })
  .post((req, res) => {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  });

router
  .route("/:id")
  .get((req, res) => {
    User.findOne({ _id: req.params.id })
      .select("-__v")
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  })
  .put((req, res) => {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with this id!" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  })
  .delete((req, res) => {
    User.findOneAndDelete({ _id: req.params.id })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: "User and Thoughts deleted!" }))
      .catch((err) => res.status(500).json(err));
  });

router
  .route("/:userId/friends/:friendId")
  .post((req, res) => {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) =>
        User.findOneAndUpdate(
          { _id: req.params.friendId },
          { $addToSet: { friends: req.params.userId } },
          { new: true }
        )
      )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID" })
          : res.json("Friend added! 🎉")
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  })
  .delete((req, res) => {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with this id!" })
          : User.findOneAndUpdate(
              { _id: req.params.friendId },
              { $pull: { friends: req.params.userId } }
            )
      )
      .then((user) => res.json({ message: "Friends successfully removed!" }))
      .catch((err) => res.status(500).json(err));
  });

module.exports = router;
