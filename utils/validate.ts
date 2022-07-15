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

export function isValidCPF(value: unknown): value is string {
  if (!isValidString(value)) {
    return false;
  }
  const cpf = value.replace(/[^\d]+/g, '');
  if (cpf == '') return false;

  if (
    cpf.length != 11 ||
    cpf == '00000000000' ||
    cpf == '11111111111' ||
    cpf == '22222222222' ||
    cpf == '33333333333' ||
    cpf == '44444444444' ||
    cpf == '55555555555' ||
    cpf == '66666666666' ||
    cpf == '77777777777' ||
    cpf == '88888888888' ||
    cpf == '99999999999'
  ) {
    return false;
  }

  let add = 0;
  for (let i = 0; i < 9; i++) {
    add += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let rev = 11 - (add % 11);
  if (rev == 10 || rev == 11) {
    rev = 0;
  }
  if (rev != parseInt(cpf.charAt(9))) {
    return false;
  }

  add = 0;
  for (let i = 0; i < 10; i++) {
    add += parseInt(cpf.charAt(i)) * (11 - i);
  }
  rev = 11 - (add % 11);
  if (rev == 10 || rev == 11) {
    rev = 0;
  }
  if (rev != parseInt(cpf.charAt(10))) {
    return false;
  }
  return true;
}
