export function camelCase(v: string): string {
  return v.replace(/[\W_\s]+([^\W_\s])/g, (arg$, c) => c[0].toUpperCase());
}
