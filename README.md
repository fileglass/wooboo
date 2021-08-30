# wooboo
Fast string formatter on steroids



# Usage
```ts
import Wooboo from "@fileglass/wooboo"
import {CapitalizeFirst} from "@fileglass/woobo/modifiers"

//Create an instance
const formatter = new Wooboo("CATS");

const output = formatter.fmt("Hello, my name is {name} and I like {insert_cats}", {
	"name": {value: "wooboo", modifiers: [new CapitalizeFirst()]},
	"insert_cats": {value: "cats"}
})

console.log(output) //Hello, my name is Wooboo and I like cats
```
# Using the built-in modifiers
There are a few built in modifiers, that can be imported from `@fileglass/woobo/modifiers`. (NOTE: *Whole string* means the `value` property of the current token) <br>
<br>
`UpperCase`: Uppercases the whole string <br>
`LowerCase`: Lowercases the whole string <br>
`CapitalizeFirst`: Capitalizes the first letter of the string <br>
`Localizer`: Utility to resolve locales (explained below) <br>
## Applying modifiers:
Every token accepts a `modifiers` array (example above) <br>
## Creating custom modifiers:
Every modifier has to implement the `WooboModifier` interface, exported from the root of the module. <br>
Example:
```ts
export default class Localizer implements WooboModifier {
    constructor(private readonly locales: { [key: string]: Map<string, string> }) {}
    execute(val: string, rawValue: string | number | boolean, token: string, rawString: string, originalValue: string | number | boolean, self: Wooboo): string {
            const locale = self.getMeta("LOCALE") as string
            return this.locales[locale].get(token) || token
    }
}
```

### Params:
`val`: The stringified value passed to the `value` property <br>
`rawValue`: The raw value passed to the `value` property <br>
`token`: The token without the `{}` <br>
`rawString`: The whole string inputted into the formatter <br>
`originalValue`: The original value of `value` before any modifiers were applied <br>
`self`: The class that the current modifier is executed in <br>

## Using the `Localizer` modifier
*localizer.ts*
```ts
import {Localizer} from "@fileglass/woobo/modifiers"
import Wooboo from "@fileglass/woobo"
// Create locales
const englishLocales = new Map<string, string>()
const hungarianLocales = new Map<string, string>()
englishLocales.set("number_disp", "The number is")
hungarianLocales.set("number_disp", "A szám")
const locales = {["en"]: englishLocales, ["hu"]: hungarianLocales}

// Initiate the formatter
const localeFormatter = new Wooboo("LOCALIZER")
localeFormatter.setMeta("LOCALE", "en") // Set metadata for the formatter (the modifier will get the current locale from this)
function format() {
	return localeFormatter.fmt("{number_disp}: {number}", {
		"number": {value: Math.random()},
		"number_disp": {value: "can be ignored, the localizer will take care of it", modifiers: [new Localizer(locales)]}
	})
}

console.log(format()) // The number is: [random number between 0 and 1]
localeFormatter.setMeta("LOCALE", "hu") // Update the locale to Hungarian
console.log(format()) // A szám: [random number between 0 and 1]
```

# Reusing formatters

If you want to nest formatters, or use them across different files, Wooboo exposes a few utility functions to achieve this in an elegant way. <br>

#### Using the `resolveRef` utility
*other.ts*
```ts
import {resolveRef} from "@fileglass/woobo"

const localizer = resolveRef("LOCALIZER")! // Resolve the reference to the `LOCALE` formatter, and mark it as defined
localizer.setMeta("LOCALE", "en") // Change back the locale to English

function format() {
	return localeFormatter.fmt("{number_disp}: {number}", {
		"number": {value: Math.random()},
		"number_disp": {value: "can be ignored, the localizer will take care of it", modifiers: [new Localizer(locales)]}
	})
}
console.log(format()) // The number is: [random number between 0 and 1]
```

#### Using the `resolveFormatter` method in an existing instance
*other.ts*
```ts
import Wooboo from "@fileglass/woobo"

const myFormatter = new Wooboo("MY_FORMATTER")
const localizer = myFormatter.resolveFormatter("LOCALIZER")

```
Use cases: <br>
Nesting formatters in custom modifiers (`self` argument) <br>
Avoiding useless imports where possible

#### Example
*mymodifier.ts*
```ts
import {WooboModifier} from "@fileglass/wooboo"

export class MyModifier implements WooboModifier {
execute(val: string, rawValue: string | number | boolean, token: string, rawString: string, originalValue: string | number | boolean, self: Wooboo): string {
const localizer = self.resolveFormatter("LOCALIZER")
	const locale = localizer.getMeta("LOCALE")
	// Do actions based on the current locale
	}
}
```

## Using the Localizer efficiently (global modifiers)
While the examples above work, always passing `modifiers: [new Localizer(locales)]` can get tedious. To avoid this, Wooboo has a feature called *global modifiers*. <br>
Global modifiers will be called on *every* token in the current class.
##### Applying global modifiers
```ts
const localizer = new Localizer(locales, "LOC_")
const localeFormatter = new Wooboo("LOCALE", [{modifier: localizer, match: "LOC_*"}])
```
The code above: <br>
1. Creates a new Localizer instance, assigns the `LOC_` prefix to every locale passed to it
2. Creates a new formatter instance, and sets the previously created Localizer instance as a global modifier
##### What does `match` mean?
The `match` property defines a pattern, that if matched (on the token, not on the input string) will trigger the modifier. ([How to match patterns](https://github.com/micromatch/micromatch#matching-features)) <br>
In the example above, everything that starts with `LOC_` will be matched. (Thats why we prefixed all the locales with `LOC_`)
### Notes:
1. The `Localizer` class exposes a hook called `usePrefixer` that will prefix/format the string based on the prefix/formatter passed to the constructor <br>
2. There are use cases where you might want to use more advanced prefixes, in these cases the constructor accepts a function as the prefix, that will be called on every locale.
#### Usage:
**Params**: <br>
`locale`: The locale key  (the inputted string if used from the hook) <br>
`value`: The locale value in the current language (`false` if used from the hook ) <br>
`lang`: The current locale language that the function is being executed on (`undefined` if used from the hook)
```ts
const localizer = new Localizer(locales, (locale, value, lang) => {
	return `LOC_${locale}`
})
```


