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
  costProfileId: string | null;
  costProfileNameSnapshot: string | null;
  notes: string;
  tags: string[];
};

export type AppSettings = {
  taxRate: number;
  mpg: number;
  gasPrice: number;
  weeklyGoal: number;
};

export type CostProfile = {
  id: string;
  name: string;
  taxRate: number;
  mpg: number;
  gasPrice: number;
};
