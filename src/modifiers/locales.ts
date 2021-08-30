import Wooboo, {WooboModifier} from "../wooboo";

type LocaleFactory = (locale: string, value: string | boolean, lang?: string) => string

export default class Localizer implements WooboModifier {
    constructor(private readonly locales: { [key: string]: Map<string, string> }, private readonly prefix?: string | LocaleFactory) {
    	if (typeof prefix === "string") {
			this.prefixWith(prefix)
			} else if (typeof prefix === "function") {
    		this.prefixWithFactory(prefix)
			}
		}

		private prefixWith(prefix: string) {
			for (const [k, v] of Object.entries(this.locales)) {
				const clone = new Map<string, string>()
				v.forEach((loc, idx) => {
					clone.set(`${prefix}${idx}`, loc)
				})
				this.locales[k] = clone
			}
		}

		private prefixWithFactory(factory: LocaleFactory) {
			for (const [k, v] of Object.entries(this.locales)) {
				const clone = new Map<string, string>()
				v.forEach((loc, idx) => {
					clone.set(factory(idx, loc, k), loc)
				})
				this.locales[k] = clone
			}

		}

    execute(val: string, rawValue: string | number | boolean, token: string, rawString: string, originalValue: string | number | boolean, self: Wooboo): string {
            const locale = self.getMeta("LOCALE") as string
            return this.locales[locale].get(token) || token
    }

    public usePrefixer(str: string) {
			if (typeof this.prefix === "string") {
				return `${this.prefix}${str}`
			} else if (typeof this.prefix === "function") {
				return this.prefix(str, false)
			} else {
				return str
			}
		}

}
