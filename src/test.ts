import Wooboo, {resolveRef} from "./wooboo"
import Localizer from "./modifiers/locales";


const englishLocales = new Map<string, string>()
const hungarianLocales = new Map<string, string>()
englishLocales.set("number_disp", "The number is")
hungarianLocales.set("number_disp", "A szám")
const locales = {["en"]: englishLocales, ["hu"]: hungarianLocales}
const localeFormatter = new Wooboo("LOCALE")
localeFormatter.setMeta("LOCALE", "en") //set metadata for the formatter (the modifier will get the current locale from this)
function format() {
	return localeFormatter.fmt("{number_disp}: {number}", {
		"number": {value: Math.random()},
		"number_disp": {value: "can be ignored, the localizer will take care of it", modifiers: [new Localizer(locales)]}
	})
}

console.log(format()) // The number is: [random number between 0 and 1]
localeFormatter.setMeta("LOCALE", "hu") // Update the locale to Hungarian
console.log(format())


const localizer = resolveRef("LOCALE")! // Resolve the reference to the `LOCALE` formatter
localizer.setMeta("LOCALE", "en") // Change back the locale to English

function format2() {
	return localeFormatter.fmt("{number_disp}: {number}", {
		"number": {value: Math.random()},
		"number_disp": {value: "can be ignored, the localizer will take care of it", modifiers: [new Localizer(locales)]}
	})
}
console.log(format2()) // The number is: [random number between 0 and 1]
