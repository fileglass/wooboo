import Tokenize from "./engine/tokenizer"
import ApplyModifiers from "./engine/applymodifiers";

export interface Anchor {
    value: string | number | boolean
    modifiers?: WooboModifier[]
}
export interface WooboModifier {
	/**
	 * Modifer executor method
	 * @param val The stringified value passed to the `value` property
	 * @param rawValue The raw value passed to the `value` property
	 * @param token The token without the `{}`
	 * @param rawString The whole string inputted into the formatter
	 * @param originalValue The original value of `value` before any modifiers were applied
	 * @param self The class that the current modifier is executed in
	 */
    execute(val: string, rawValue: string | number | boolean, token: string, rawString: string, originalValue: string | number | boolean, self: Wooboo): string
}


export type Anchors= {[key: string]: Anchor}


class WoobooRefs {
    private static refs = new Map<string, Wooboo>()

    public static registerRef(token: string, instance: Wooboo) {
        this.refs.set(token, instance)
    }
    public static getReference(token: string) {
        return this.refs.get(token)
    }

}
/**
 * Resolves an other formatter instance by it's token
 * @param token
 */
export function resolveRef(token: string) {
    return WoobooRefs.getReference(token)
}

/**
 * Core Woobo class
 */
export default class Wooboo {
    private meta = new Map<string, string>()
    private readonly defaultModifiers: WooboModifier[] = []

    /**
     *
     * @param token Has to be unique around every instance
     * @param defaultModifiers An array of modifiers that will applied to every token in this class
     */
    constructor(private readonly token: string, defaultModifiers?: WooboModifier[]) {
        this.defaultModifiers = defaultModifiers || []
        WoobooRefs.registerRef(this.token, this)
    }

    /**
     *  Formats a string based on the passed token map
      * @param str String to format
     * @param data Token => data lookup map
     */
    public fmt(str: string, data: Anchors) {
        const tokens = Tokenize(str)
        let final = str
        tokens.forEach(tok => {
            const anchor = data[tok]
            if (anchor) {
                const value = ApplyModifiers(str, anchor.value, tok, this, (anchor.modifiers || []).concat(this.defaultModifiers))
                final = final.replace(`{${tok}}`, value)
            }
        })
        return final
    }


    public setMeta(key: string, value: string) {
        this.meta.set(key, value)
    }

    public getMeta(key: string) {
        return this.meta.get(key)
    }

    /**
     * Returns the default modifiers for this class
     */
    public get defaultMods() {
        return this.defaultModifiers
    }

    public addDefaultModifier(mod: WooboModifier) {
        this.defaultModifiers.push(mod)
    }

    /**
     * Resolves an other formatter instance by it's token
     * @param token
     */
    public resolveFormatter(token: string) {
        return resolveRef(token)
    }

    /**
     * Gets the unique token specified in the constructor
     */
    public get lookupToken() {
        return this.token
    }
}
