// timeComparison.test.js
import { getWeek, isGreaterThan } from "./helper.js";

describe("Time Comparison", () => {
  test("Time1 is greater than Time2", () => {
    const result = isGreaterThan("12:30", "10:45");
    expect(result).toBe(true);
  });

  test("Time2 is greater than Time1", () => {
    const result = isGreaterThan("08:15", "09:30");
    expect(result).toBe(false);
  });

  test("Same time, Time1 is not greater than Time2", () => {
    const result = isGreaterThan("14:00", "14:00");
    expect(result).toBe(true);
  });

  test("Invalid time format for Time1", () => {
    const result = isGreaterThan("invalidTime", "16:30");
    expect(result).toBe(false);
  });

  test("Invalid time format for Time2", () => {
    const result = isGreaterThan("12:45", "invalidTime");
    expect(result).toBe(false);
  });

  test("Time1 is greater than Time2", () => {
    const result = isGreaterThan("09:58", "08:00");
    expect(result).toBe(true);
  });
});

describe("Week Number Calculation", () => {
  test("Week number for January 1, 2022 (Saturday)", () => {
    const date = new Date("2022-01-01T00:00:00");
    expect(getWeek(date)).toBe(0);
  });

  test("Week number for August 15, 2022 (Monday)", () => {
    const date = new Date("2022-08-15T00:00:00");
    expect(getWeek(date)).toBe(33);
  });

  test("Week number for December 31, 2022 (Saturday)", () => {
    const date = new Date("2022-12-31T00:00:00");
    expect(getWeek(date)).toBe(52);
  });

  test("Week number for January 1, 2023 (Sunday)", () => {
    const date = new Date("2023-01-01T00:00:00");
    expect(getWeek(date)).toBe(1);
  });

  test("Week number for February 14, 2023 (Tuesday) with dowOffset 1", () => {
    const date = new Date("2023-02-14T00:00:00");
    expect(getWeek(date, 1)).toBe(7);
  });

  test("Week number for March 1, 2023 (Wednesday) with dowOffset 2", () => {
    const date = new Date("2023-03-01T00:00:00");
    expect(getWeek(date, 2)).toBe(9);
  });
});
