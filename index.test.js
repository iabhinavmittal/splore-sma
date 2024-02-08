import { calculateTotalFare } from "./index.js";

describe("Fare Calculator", () => {
  test("Basic Fare Calculation", () => {
    const trips = [
      { from: "green", to: "green", dateObj: new Date("2021-03-24T07:58:30") },
    ];
    expect(calculateTotalFare(trips)).toBe(1);
  });

  test("Different Lines during Peak Hours", () => {
    const trips = [
      { from: "green", to: "red", dateObj: new Date("2021-03-24T09:58:30") },
    ];
    expect(calculateTotalFare(trips)).toBe(4);
  });

  test("Same Line during Peak Hours", () => {
    const trips = [
      { from: "red", to: "red", dateObj: new Date("2021-03-25T09:30:00") },
    ];
    expect(calculateTotalFare(trips)).toBe(3);
  });

  test("Different Lines during Non-Peak Hours", () => {
    const trips = [
      { from: "red", to: "green", dateObj: new Date("2021-03-25T14:30:00") },
    ];
    expect(calculateTotalFare(trips)).toBe(2);
  });

  test("Same Line during Non-Peak Hours", () => {
    const trips = [
      { from: "green", to: "green", dateObj: new Date("2021-03-26T20:00:00") },
    ];
    expect(calculateTotalFare(trips)).toBe(1);
  });

  test("Daily Cap Enforcement", () => {
    let trips = [];
    for (let i = 0; i < 30; i++) {
      trips.push({
        from: "green",
        to: "red",
        dateObj: new Date("2021-03-23T09:00:00"),
      });
    }
    expect(calculateTotalFare(trips)).toBe(15);
  });

  test("Weekly Cap Enforcement", () => {
    let trips = [];
    for (let i = 12; i < 19; i++) {
      for (let j = 0; j < 30; j++) {
        trips.push({
          from: "green",
          to: "red",
          dateObj: new Date(`2024-02-${i.toString()}T09:00:00`),
        });
      }
    }

    expect(calculateTotalFare(trips)).toBe(105);
  });

  // Add more test cases for other scenarios as needed
});
