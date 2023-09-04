export const determineDefaultScreen = (user) => {
  // console.log("Determine");
  if (user) {
    if (user.status == "PENDING") {
      // console.log("Pending");
      return "DriverUpdateProfile";
    } else {
      return "Home";
    }
  }
  return "Login";
};
