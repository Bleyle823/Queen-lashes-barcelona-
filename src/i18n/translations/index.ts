import { en } from "./en";
import { es } from "./es";
import type { Locale } from "../types";

export type { Translation } from "./en";

export const translations = { en, es } as const satisfies Record<Locale, typeof en>;

export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(values[key] ?? ""));
}
