import type { Locale } from "./config";
import type { Dictionary } from "./types";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  pl: () => import("./dictionaries/pl.json").then((m) => m.default),
  ru: () => import("./dictionaries/ru.json").then((m) => m.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  return dictionaries[locale]();
};
