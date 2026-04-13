const NON_NEGATIVE_DECIMAL_PATTERN = /^\d*\.?\d*$/;

export function isNonNegativeDecimalInput(value: string) {
  return value === "" || NON_NEGATIVE_DECIMAL_PATTERN.test(value);
}

export function getNonNegativeNumber(value: string) {
  const number = Number(value);
  if (value.trim() === "" || !Number.isFinite(number) || number < 0) {
    return null;
  }

  return number;
}

export function getPositiveNumber(value: string) {
  const number = getNonNegativeNumber(value);
  if (number === null || number <= 0) {
    return null;
  }

  return number;
}
