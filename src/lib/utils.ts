/**
 * Minimal class-name combiner (no dependencies).
 * Filters out falsy values and joins the rest with spaces.
 */
export type ClassValue = string | number | null | false | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
