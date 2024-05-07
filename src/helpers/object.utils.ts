export function omitKeys<T extends object, K extends keyof T>(o: T, keys: K[]): Omit<T, K> {
  return Object.keys(o).reduce((a, k) => {
    if (!keys.includes(k as K)) a[k] = o[k];
    return a;
  }, {} as any);
}

export function pickKeys<T extends object, K extends keyof T>(o: T, keys: K[]): Pick<T, K> {
  return Object.keys(o).reduce((a, k) => {
    if (keys.includes(k as K)) a[k] = o[k];
    return a;
  }, {} as any);
}
