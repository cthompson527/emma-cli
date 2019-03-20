/**
 *
 * Fallback function.
 *
 * @param fallback
 */
export function withDefault<T>(fallback: T): (value: T | undefined) => T {
  return val => {
    if (val === undefined) return fallback
    else return val
  }
}
