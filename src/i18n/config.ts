export const i18n = {
  defaultLocale: "en",
  // Add locales here during setup. All dictionaries in src/i18n/dictionaries/
  // must have a matching JSON file for each locale listed.
  locales: ["en", "pl", "ru"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

// Locales that support the intranet interface
export const INTRANET_LOCALES: Locale[] = ["en"];

export const localeNames: Record<Locale, string> = {
  en: "English",
  pl: "Polski",
  ru: "Русский",
};

export const localeFlags: Record<Locale, string> = {
  en: "\u{1F1FA}\u{1F1F8}",
  pl: "\u{1F1F5}\u{1F1F1}",
  ru: "\u{1F1F7}\u{1F1FA}",
};
