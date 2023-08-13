/**
 * Omit the specified key from the object<br>
 * Alternative to lodash omit<br>
 * https://stackoverflow.com/questions/59447415/alternative-to-lodash-omit
 *
 * @param obj - target object
 * @param keys - Keys for properties to exclude
 * @returns Object omitting the specified key
 */
export const omit = <T extends object>(obj: T, keys: string[]) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));
