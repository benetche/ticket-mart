export function isDefined(value: unknown): boolean {
  return value !== undefined && value !== null;
}

export function isValidString(value: unknown): value is string {
  return isDefined(value) && typeof value === 'string' && value.length > 0;
}

export function isValidNumber(
  value: unknown,
  positive = false
): value is number {
  return (
    isDefined(value) &&
    typeof value === 'number' &&
    !Number.isNaN(value) &&
    (!positive || value > 0)
  );
}

export function isValidEmail(value: unknown): value is string {
  return (
    isValidString(value) &&
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      value
    )
  );
}
