const NON_NEGATIVE_DECIMAL_PATTERN = /^\d*\.?\d*$/;

export function getLocalDateInputValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

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
