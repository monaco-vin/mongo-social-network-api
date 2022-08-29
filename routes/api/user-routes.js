const router = require("express").Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require("../../controllers/user-controller.js");

// Set up GET all and POST at /api/users
router.route("/").get(getAllUsers).post(createUser);

// set up POST route at /api/users/<userId>/friends/<friendId>
router
  .route("/:userId/friends/:friendsId")
  .post(addFriend)
  .delete(removeFriend);

// Set up GET one, PUT, and DELETE at /api/users/:id
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;
