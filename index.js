import fs from "fs";
import _get from "lodash/get.js";
import _set from "lodash/set.js";

import {
  dailyFareCapConfig,
  nonPeakFaresConfig,
  peakFaresConfig,
  peakHoursConfig,
  weeklyFareCapConfig,
} from "./constant.js";
import { getWeek } from "./helper.js";

// returns if the time of day is peak hour or not
const isPeakHourFunc = (dateObj) => {
  const dayOfWeek = dateObj.getDay();
  const time = dateObj.getHours() + ":" + dateObj.getMinutes();

  const peakHoursOfDay = peakHoursConfig[dayOfWeek];
  for (const p of peakHoursOfDay) {
    if (time > p.from && time < p.to) return true;
  }

  return false;
};

const readInputFromCSV = (filePath) => {
  const content = fs.readFileSync(filePath, "utf-8");
  const items = content.split("\n");

  const trips = items.map((item) => {
    const [from, to, date] = item.split(",");
    return {
      from: from.trim().toLowerCase(),
      to: to.trim().toLowerCase(),
      dateObj: new Date(date.trim()),
    };
  });

  return trips;
};

const calculateFarePerRoutes = (trips) => {
  const routesFareAmount = {};

  for (const t of trips) {
    const tDate = t.dateObj.getDate();
    const tMonth = t.dateObj.getUTCMonth() + 1;
    const tYear = t.dateObj.getUTCFullYear();
    const tWeekNumber = getWeek(t.dateObj);
    const isPeakHour = isPeakHourFunc(t.dateObj);

    const routeKey = `${t.from}.${t.to}`;
    const dailyHashKey = `${t.from}_${t.to}_date_${tDate}_${tMonth}_${tYear}`;
    const weeklyHashKey = `${t.from}_${t.to}_week_${tWeekNumber}`;

    // calculate fare for this trip
    const currFare = _get(
      isPeakHour ? peakFaresConfig : nonPeakFaresConfig,
      routeKey,
      0
    );

    // daily fare
    const dailyFareCap = _get(dailyFareCapConfig, routeKey, Infinity);
    const prevDailyFare = _get(routesFareAmount, dailyHashKey, 0);
    const newDailyFare = Math.min(dailyFareCap, prevDailyFare + currFare);
    _set(routesFareAmount, dailyHashKey, newDailyFare);

    // weekly fare
    const weeklyFareCap = _get(weeklyFareCapConfig, routeKey, Infinity);
    const prevWeeklyFare = _get(routesFareAmount, weeklyHashKey, 0);
    const newWeeklyFare = Math.min(weeklyFareCap, prevWeeklyFare + currFare);
    _set(routesFareAmount, weeklyHashKey, newWeeklyFare);

    // console.log(
    //   "fare calc:",
    //   dailyFareCap,
    //   prevDailyFare,
    //   currFare,
    //   newDailyFare,
    //   newWeeklyFare
    // );
  }

  return routesFareAmount;
};

const calculateTotalFare = (routesFareAmount) => {
  let totalFare = Object.values(routesFareAmount).reduce((prev, curr, _) => {
    return prev + curr;
  });

  return totalFare;
};

const main = () => {
  const trips = readInputFromCSV("./input.csv");
  const routesFareAmount = calculateFarePerRoutes(trips);
  console.log(JSON.stringify(routesFareAmount));
  const totalFare = calculateTotalFare(routesFareAmount);
  console.log("Total Fare: ", totalFare);
};

main();
