const express = require("express");
const validateUsers = require("./validationCheck/validateUsers"); // file runs - mongoose connects to db

const cors = require("cors");

require("./db/mongoose"); // file runs - mongoose connects to db

const userRouter = require("./routers/user");
const app = express();

app.use(express.json()); // parse incoming data to be json.
app.use(cors());

const allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
};

app.use(allowCrossDomain);
app.use(userRouter);

// setInterval(() => {
//   console.log("Calling validate User");
//   validateUsers();
// }, 6000);

module.exports = app;
