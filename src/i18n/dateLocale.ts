import { format } from "date-fns";
import { de as deLocale, enUS, es as esLocale } from "date-fns/locale";
import type { Locale } from "./types";

export function getDateFnsLocale(locale: Locale) {
  switch (locale) {
    case "es":
      return esLocale;
    case "de":
      return deLocale;
    default:
      return enUS;
  }
}

export function formatDatePart(date: Date, locale: Locale, style: "short" | "weekday"): string {
  const dateLocale = getDateFnsLocale(locale);
  if (style === "short") {
    if (locale === "es") return format(date, "d MMM", { locale: dateLocale });
    if (locale === "de") return format(date, "d. MMM", { locale: dateLocale });
    return format(date, "MMM d", { locale: dateLocale });
  }
  if (locale === "es") return format(date, "EEE, d MMM", { locale: dateLocale });
  if (locale === "de") return format(date, "EEE, d. MMM", { locale: dateLocale });
  return format(date, "EEE, MMM d", { locale: dateLocale });
}
