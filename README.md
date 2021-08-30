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
There are a few built in modifiers, that can be imported from `@fileglass/woobo/modifiers`. <br>
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
   




