export type Shift = {
  id: string;
  date: string;
  appName: string;
  grossEarnings: number;
  hoursWorked: number;
  milesDriven: number;
  otherExpenses: number;
  taxRateSnapshot: number | null;
  mpgSnapshot: number | null;
  gasPriceSnapshot: number | null;
};

export type AppSettings = {
  taxRate: number;
  mpg: number;
  gasPrice: number;
  weeklyGoal: number;
};
