import moment from "moment";
import Moment from "moment";

export const toVnDateTimeString = (datetime) => {
  // console.log(datetime);
  return Moment(datetime).format("HH:mm - DD-MM-YYYY");
};

export const getMaximumDob = () => {
  return moment().subtract(5, "years").toDate();
};

export const toVnDateString = (datetime) => {
  return Moment(datetime).format("DD-MM-YYYY");
};

export const toVnTimeString = (datetime) => {
  return moment(datetime, "HH:mm:ss").format("HH:mm");
};

export const calculateAge = (dateOfBirth) => {
  var years = moment().diff(
    new Moment(dateOfBirth).format("YYYY-MM-DD"),
    "years",
    false
  );
  return years;
};

export const getDifference = (startTime, endTime) => {
  // console.log(startTime, endTime);
  const first = moment(startTime);
  const second = moment(endTime);
  const diffDays = second.diff(first, "days");
  const diffHours = second.diff(first, "hours");
  const diffMinutes = second.diff(first, "minutes");
  return { diffDays, diffHours, diffMinutes };
};

export const getDayOfWeek = (date) => {
  const dayOfWeek = moment(date, "YYYY-MM-DD").day();
  switch (dayOfWeek) {
    case 0:
      return "CN";
    case 1:
      return "T2";
    case 2:
      return "T3";
    case 3:
      return "T4";
    case 4:
      return "T5";
    case 5:
      return "T6";
    case 6:
      return "T7";
  }
};
