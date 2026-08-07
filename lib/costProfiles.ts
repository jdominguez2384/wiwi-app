import type { CostProfile } from "./domain";

export type CostProfileRow = {
  id: string;
  name: string;
  tax_rate: number | string;
  mpg: number | string;
  gas_price: number | string;
};

export function mapCostProfileRow(row: CostProfileRow): CostProfile {
  return {
    id: row.id,
    name: row.name,
    taxRate: Number(row.tax_rate),
    mpg: Number(row.mpg),
    gasPrice: Number(row.gas_price),
  };
}
