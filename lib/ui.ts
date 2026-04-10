export function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function formatMoney(value: number) {
  const absoluteValue = Math.abs(value).toFixed(2);
  return value < 0 ? `-$${absoluteValue}` : `$${absoluteValue}`;
}
