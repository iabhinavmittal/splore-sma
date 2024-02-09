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

/**
 * Determines if the provided date and time fall within peak hours.
 * @param {Date} dateObj - The date object to check against peak hours.
 * @returns {boolean} - True if the time is within peak hours, false otherwise.
 */
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

/**
 * Reads trip data from a CSV file and converts it into an array of trip objects.
 * @param {string} filePath - The path to the CSV file.
 * @returns {Array} - An array of trip objects.
 */
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

/**
 * Calculates the fare for each route based on daily and weekly caps.
 * @param {Array} trips - An array of trip objects.
 * @returns {Object} - An object containing the calculated fares per route.
 */
const calculateFarePerRoutes = (trips) => {
  const dailyFarePerRoute = {};
  const weeklyFarePerRoute = {};

  for (const t of trips) {
    const tDate = t.dateObj.getDate();
    const tMonth = t.dateObj.getUTCMonth() + 1;
    const tYear = t.dateObj.getUTCFullYear();
    const tWeekNumber = getWeek(t.dateObj);
    const isPeakHour = isPeakHourFunc(t.dateObj);

    const routeKey = `${t.from}.${t.to}`; // sample: 'green.red'
    const dailyHashKey = `${t.from}_${t.to}_date_${tDate}_${tMonth}_${tYear}`; // sample: 'green_red_date_09_02_2024'
    const weeklyHashKey = `${t.from}_${t.to}_week_${tWeekNumber}`; // sample: 'green_red_week_8'

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

/**
 * Calculates the total fare from all routes.
 * @param {Array} trips - An array of trip objects.
 * @returns {number} - The total fare.
 */
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
