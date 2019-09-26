const express = require("express");
const User = require("../models/user");
const setUpNewUser = require("../services/setUpNewUserWithDefaults");
const {
  validateUsers,
  validateSingleUser
} = require("../validationCheck/validateUsers");
const router = new express.Router();

const TARGET_TIMES_DRIVEN = 11;

router.post("/user", async (req, res) => {
  try {
    const newUser = setUpNewUser(req.body);
    const user = new User(newUser);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/users", async (req, res) => {
  try {
    validateUsers();
    const users = await User.find();
    if (!users) {
      return res.status(404).send();
    }
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

const resetUser = user => {
  let todaysDate = new Date();
  let todaysDateInUTC = todaysDate.getTime();
  let sixMonthsTimeInUTC = todaysDateInUTC + 15552000000;

  user.currentCount = 0;
  user.cycleStartDate = todaysDateInUTC;
  user.cycleEndDate = sixMonthsTimeInUTC;
  user.isQualifiedToDrive = true;
};

router.patch("/user/:id", async (req, res) => {
  const { id } = req.params;
  const updates = Object.keys(req.body);
  updates.push("cycleEndDate");

  const allowedToUpdate = [
    "firstName",
    "lastName",
    "currentCount",
    "lastDateDriven",
    "isQualifiedToDrive",
    "totalNumberOfTimesDriven",
    "resetIsQualifiedToDrive",
    "cycleStartDate",
    "cycleEndDate"
  ];
  let isValidOp = updates.every(update => allowedToUpdate.includes(update));

  if (!isValidOp) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    const lastDateDrivenInMilliseconds = new Date(
      req.body.lastDateDriven
    ).getTime();

    const cycleStartDateInMilliseconds = new Date(
      req.body.cycleStartDate
    ).getTime();

    const cycleEndDateTimeInUTC = cycleStartDateInMilliseconds + 15552000000;

    const transformedBody = {
      ...req.body,
      lastDateDriven: lastDateDrivenInMilliseconds,
      cycleStartDate: cycleStartDateInMilliseconds,
      cycleEndDate: cycleEndDateTimeInUTC
    };

    const user = await User.findById(id);

    updates.forEach(update => (user[update] = transformedBody[update]));

    if (
      user.resetIsQualifiedToDrive ||
      parseInt(user.currentCount) >= TARGET_TIMES_DRIVEN // think the string number needs parse
    ) {
      resetUser(user);
    }

    await validateSingleUser(user);

    console.log("user", user);
    // await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await User.remove({ _id: id });
    res.status(200).send();
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
