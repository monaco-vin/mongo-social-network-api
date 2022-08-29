const router = require("express").Router();
const {
  addThought,
  getThoughts,
  getThoughtById,
  updateThoughtById,
  removeThought,
  addReaction,
  removeReaction,
} = require("../../controllers/thought-controller.js");

// /api/thoughts
router.route("/").get(getThoughts);

// /api/thoughts/:thoughtId
router.route("/:thoughtId").get(getThoughtById).put(updateThoughtById);

// /api/thoughts/<userId>
router.route("/:userId").post(addThought);

// /api/thoughts/<userId>/<thoughtId>
router.route("/:thoughtId").delete(removeThought);

// /api/thoughts/<thoughId>/reactions
router.route("/:thoughtId/reactions").put(addReaction);

// /api/thoughts/<thoughtId>/reactions/<reactionId>
router.route("/:thoughtId/reactions/:reactionId").delete(removeReaction);

module.exports = router;
