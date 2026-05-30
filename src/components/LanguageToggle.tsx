import { useTranslation } from "@/i18n/LocaleProvider";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useTranslation();

  return (
    <div
      className={`inline-flex items-center rounded-sm border border-ink/20 overflow-hidden ${className}`}
      role="group"
      aria-label={locale === "en" ? "Language" : "Idioma"}
    >
      {(["en", "es"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={`px-2.5 py-1 text-xs font-display tracking-widest transition-colors ${
            locale === code ? "bg-ink text-background" : "text-ink/70 hover:text-ink hover:bg-ink/5"
          }`}
          aria-pressed={locale === code}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
