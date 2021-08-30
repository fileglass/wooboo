import Wooboo, {resolveRef} from "./wooboo"
import {LowerCase, UpperCase} from "./modifiers/casing";
import Localizer from "./modifiers/locales";


new Wooboo("TESTING")
const instance = resolveRef("TESTING")!
instance.setMeta("LOCALE", "en")
const m = new Map<string, string>()
m.set("test_text", "English locale")
const locales = {["en"]: m}

const start = Date.now()
const r = instance.fmt("{start} {center} {test_text} {ignored}", {
    "start": {value: "hello sir", modifiers: [new UpperCase()]},
    "center": {value: "YOO", modifiers: [new LowerCase()]},
    "test_text": {value: "will be ingored because the localizer handles the translation", modifiers: [new Localizer(locales)]}
})


console.log(`Took: ${Date.now() - start} ms`)

console.log("Resp", r)