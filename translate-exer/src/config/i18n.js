import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resources from "./translate";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources,
    lng: i18n.options.lng,
    fallbackLng: localStorage.getItem("langCode") || "kr",
    debug: true,
    supportedLngs: ["kr", "en"],
    ns: ["translate"],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
