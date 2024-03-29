export const isGreaterThan = (time1, time2) => {
  let date1 = new Date(`1970-01-01T${time1}:00Z`);
  let date2 = new Date(`1970-01-01T${time2}:00Z`);

  if (date1 >= date2) {
    return true;
  } else {
    return false;
  }
};

export const getWeek = (date, dowOffset) => {
  dowOffset = typeof dowOffset == "number" ? dowOffset : 0; //default dowOffset to zero
  var newYear = new Date(date.getFullYear(), 0, 1);
  var day = newYear.getDay() - dowOffset; //the day of week the year begins on
  day = day >= 0 ? day : day + 7;
  var daynum =
    Math.floor(
      (date.getTime() -
        newYear.getTime() -
        (date.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) /
        86400000
    ) + 1;
  var weeknum;
  //if the year starts before the middle of a week
  if (day < 4) {
    weeknum = Math.floor((daynum + day - 1) / 7) + 1;
    if (weeknum > 52) {
      nYear = new Date(date.getFullYear() + 1, 0, 1);
      nday = nYear.getDay() - dowOffset;
      nday = nday >= 0 ? nday : nday + 7;
      /*if the next year starts before the middle of
              the week, it is week #1 of that year*/
      weeknum = nday < 4 ? 1 : 53;
    }
  } else {
    weeknum = Math.floor((daynum + day - 1) / 7);
  }
  return weeknum;
};
