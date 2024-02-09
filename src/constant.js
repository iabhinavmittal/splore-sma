// fare configuration across different segments
// add fares for new lines when available
export const peakFaresConfig = {
  green: { green: 2, red: 4 },
  red: { green: 3, red: 3 },
};

export const nonPeakFaresConfig = {
  green: { green: 1, red: 3 },
  red: { green: 2, red: 2 },
};

export const dailyFareCapConfig = {
  green: { green: 8, red: 15 },
  red: { green: 15, red: 12 },
};

export const weeklyFareCapConfig = {
  green: { green: 55, red: 90 },
  red: { green: 90, red: 70 },
};

export const peakHoursConfig = {
  // Mon
  1: [
    { from: "08:00", to: "10:00" },
    { from: "16:30", to: "19:00" },
  ],
  2: [
    { from: "08:00", to: "10:00" },
    { from: "16:30", to: "19:00" },
  ],
  3: [
    { from: "08:00", to: "10:00" },
    { from: "16:30", to: "19:00" },
  ],
  4: [
    { from: "08:00", to: "10:00" },
    { from: "16:30", to: "19:00" },
  ],
  5: [
    { from: "08:00", to: "10:00" },
    { from: "16:30", to: "19:00" },
  ],
  6: [
    { from: "10:00", to: "14:00" },
    { from: "18:00", to: "23:00" },
  ],
  0: [{ from: "18:00", to: "23:00" }],
};
