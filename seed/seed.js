const connection = require("../config/connection");
const { Thought, User } = require("../models");
const Chance = require("chance");
const { Types } = require("mongoose");

String.prototype.capitalise = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
const chance = new Chance();

const theNumber = 10;

connection.on("error", (err) => err);

connection.once("open", async () => {
  console.log("connected");

  // Drop existing courses
  await User.deleteMany({});

  // Drop existing students
  await Thought.deleteMany({});

  // Create empty array to hold the students
  const startArray = [...Array(theNumber).keys()];

  const usersStarter = startArray.map((item) => {
    return {
      _id: new Types.ObjectId(),
      username: chance.first().toLowerCase() + chance.last().capitalise(),
      email: chance.email(),
    };
  });

  const thoughts = startArray.map((item) => {
    const reactionArray = [...Array(Math.floor(Math.random() * 3)).keys()];
    return {
      _id: new Types.ObjectId(),
      thoughtText: chance.sentence(),
      username: usersStarter[Math.floor(Math.random() * theNumber)].username,
      reactions: reactionArray.map((item) => {
        return {
          reactionId: new Types.ObjectId(),
          reactionBody: chance.word(),
          username:
            usersStarter[Math.floor(Math.random() * theNumber)].username,
        };
      }),
    };
  });

  const users = usersStarter.map((user) => {
    // add randomly generated thoughts
    const inti = thoughts.filter((thought) => {
      if (thought.username === user.username) {
        return thought._id;
      }
    });
    user.thoughts = inti.map((thought) => {
      return thought._id;
    });
    return user;
  });

  // Add students to the collection and await the results
  const thing = await User.collection.insertMany(users);

  // Add courses to the collection and await the results
  const res = await Thought.collection.insertMany(thoughts);

  // Log out the seed data to indicate what should appear in the database
  console.log(res);
  console.info("Seeding complete! 🌱");
  process.exit(0);
});
