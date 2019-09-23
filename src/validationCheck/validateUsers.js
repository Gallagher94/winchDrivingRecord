const User = require("../models/user");

const TARGET_TIMES_DRIVEN = 11;

const validateUsers = async () => {
  console.log("validateUsers");
  const users = await User.find();

  if (!users) {
    return new Error("No Users returned");
  }

  users.forEach(async user => {
    validateSingleUser(user);
  });
};

const validateSingleUser = async user => {
  console.log("validateSingleUser");
  var todaysDate = new Date();
  var todaysDateInUTC = todaysDate.getTime();
  if (todaysDateInUTC >= user.cycleEndDate) {
    console.log("HERE ", user);
    if (user.currentCount < TARGET_TIMES_DRIVEN) {
      user.isQualifiedToDrive = false;
    }
    if (user.currentCount >= TARGET_TIMES_DRIVEN) {
      var todaysDate = new Date();
      var todaysDateInUTC = todaysDate.getTime();
      var sixMonthsTimeInUTC = todaysDateInUTC + 15552000000;

      user.currentCount = 0;
      user.cycleStartDate = todaysDateInUTC;
      user.cycleEndDate = sixMonthsTimeInUTC;
      user.isQualifiedToDrive = true;
    }
  } else if (user.currentCount >= TARGET_TIMES_DRIVEN) {
    resetUser(user);
  }

  await user.save();
};

const resetUser = user => {
  let todaysDate = new Date();
  let todaysDateInUTC = todaysDate.getTime();
  let sixMonthsTimeInUTC = todaysDateInUTC + 15552000000;

  user.currentCount = 0;
  user.cycleStartDate = todaysDateInUTC;
  user.cycleEndDate = sixMonthsTimeInUTC;
  user.isQualifiedToDrive = true;
};

module.exports = { validateUsers, validateSingleUser };
