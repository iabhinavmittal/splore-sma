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
import { getWeek, isGreaterThan } from "./helper.js";

// returns if the time of day is peak hour or not
const isPeakHourFunc = (dateObj) => {
  const dayOfWeek = dateObj.getDay();
  const hour = ("0" + dateObj.getHours()).slice(-2); // adding 0 to maintain '08' format
  const min = ("0" + dateObj.getMinutes()).slice(-2);
  const time = hour + ":" + min;

  const peakHoursOfDay = peakHoursConfig[dayOfWeek];
  for (const p of peakHoursOfDay) {
    if (isGreaterThan(time, p.from) && isGreaterThan(p.to, time)) return true;
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
  const dailyFarePerRoute = {};
  const weeklyFarePerRoute = {};

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
    let amountToBeDebited = currFare;

    // daily fare
    const dailyFareCap = _get(dailyFareCapConfig, routeKey, Infinity);
    const prevDailyFare = _get(dailyFarePerRoute, dailyHashKey, 0);
    amountToBeDebited = Math.min(
      dailyFareCap - prevDailyFare,
      amountToBeDebited
    );

    // weekly fare
    const weeklyFareCap = _get(weeklyFareCapConfig, routeKey, Infinity);
    const prevWeeklyFare = _get(weeklyFarePerRoute, weeklyHashKey, 0);
    amountToBeDebited = Math.min(
      weeklyFareCap - prevWeeklyFare,
      amountToBeDebited
    );

    _set(dailyFarePerRoute, dailyHashKey, prevDailyFare + amountToBeDebited);
    _set(weeklyFarePerRoute, weeklyHashKey, prevWeeklyFare + amountToBeDebited);
  }

  return dailyFarePerRoute;
};

export const calculateTotalFare = (trips) => {
  const routesFareAmount = calculateFarePerRoutes(trips);

  let totalFare = Object.values(routesFareAmount).reduce((prev, curr, _) => {
    return prev + curr;
  });

  return totalFare;
};

const main = () => {
  const trips = readInputFromCSV("./src/input.csv");

  const totalFare = calculateTotalFare(trips);
  console.log("Total Fare: ", totalFare);
};

main();
