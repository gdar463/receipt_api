export function deepMerge<T>(target: T, source: Partial<T>): T {
  for (const key in source) {
    if (
      typeof source[key] === "object" &&
      source[key] !== null &&
      !Array.isArray(source[key])
    ) {
      target[key] = deepMerge((target[key] ?? {}) as any, source[key] as any);
    } else {
      target[key] = source[key] as T[Extract<keyof T, string>];
    }
  }
  return target;
}
