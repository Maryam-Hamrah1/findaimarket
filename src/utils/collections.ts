/** Adds the value when missing, removes it when present. Never mutates the list. */
export function toggleItem<T>(list: readonly T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value]
}
