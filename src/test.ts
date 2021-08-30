import Wooboo, {resolveRef} from "./wooboo"
import Localizer from "./modifiers/locales";


const englishLocales = new Map<string, string>()
const hungarianLocales = new Map<string, string>()
englishLocales.set("number_disp", "The number is")
hungarianLocales.set("number_disp", "A szám")
const locales = {["en"]: englishLocales, ["hu"]: hungarianLocales}


const localizer = new Localizer(locales, (locale, key, lang) => {
	return `LOC_${locale}`
})
const localeFormatter = new Wooboo("LOCALE", [{modifier: localizer, match: "LOC_*"}])
localeFormatter.setMeta("LOCALE", "en") //set metadata for the formatter (the modifier will get the current locale from this)
function format() {
	return localeFormatter.fmt(`{${localizer.usePrefixer("number_disp")}}: {number}`, {
		"number": {value: Math.random()},
		"LOC_number_disp": {value: "can be ignored, the localizer will take care of it"}
	})
}
console.log(format())
