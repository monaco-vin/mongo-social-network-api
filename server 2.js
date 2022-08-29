const express = require("express");
const routes = require("./routes");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.Port || 3001;

const { User, Thought } = require("./models");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/socialNetdb", {
  // useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// mongoose.set('useCreateIndex', true);
mongoose.set("debug", true);

app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});
