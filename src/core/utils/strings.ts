export function isStringInLengthBetween(
  str: string,
  minLength: number,
  maxLength: number,
): boolean {
  if (str.length < minLength || str.length > maxLength) {
    return false;
  }
  return true;
}

export function isStringMatchingRegex(str: string, regex: RegExp): boolean {
  if (!regex.test(str)) {
    return false;
  }
  return true;
}
