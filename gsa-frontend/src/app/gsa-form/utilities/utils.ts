export function isDefined<T>(o: T | undefined | null): o is T {
  return o !== undefined && o !== null
}
