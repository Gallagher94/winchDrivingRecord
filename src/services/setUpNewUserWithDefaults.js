const setUpNewUser = signedUpUser => {

  const userChoosenSignUpStartDateInMilliseconds = new Date(
    signedUpUser.cycleStartDate
  ).getTime();

  const sixMonthsTimeInUTC =
    userChoosenSignUpStartDateInMilliseconds + 15552000000;

  const lastDateDrivenInMilliseconds = new Date(
    signedUpUser.lastDateDriven
  ).getTime();

  return {
    ...signedUpUser,
    cycleStartDate: userChoosenSignUpStartDateInMilliseconds, // changed this
    cycleEndDate: sixMonthsTimeInUTC,
    lastDateDriven: lastDateDrivenInMilliseconds,
    isQualifiedToDrive: true
  };
};

module.exports = setUpNewUser;
