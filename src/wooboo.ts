import Tokenize from "./engine/tokenizer"
import ApplyModifiers from "./engine/applymodifiers";
import ApplyGlobalModifiers from "./engine/applyglobalmodifiers";
import {Modifiers} from "./modifiers"

export interface Anchor {
    value: string | number | boolean
    modifiers?: WooboModifier[]
}

export interface GlobalModifier {
	modifier: WooboModifier,
	match?: string[] | string
}

export interface WooboModifier {
	/**
	 * Modifier executor method
	 * @param val The stringified value passed to the `value` property
	 * @param rawValue The raw value passed to the `value` property
	 * @param token The token without the `{}`
	 * @param rawString The whole string inputted into the formatter
	 * @param originalValue The original value of `value` before any modifiers were applied
	 * @param self The class that the current modifier is executed in
	 */
    execute(val: string, rawValue: string | number | boolean, token: string, rawString: string, originalValue: string | number | boolean, self: Wooboo): string | Promise<string>
}


export type Anchors= {[key: string]: Anchor}


abstract class WoobooRefs {
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
 * Core Wooboo class
 */
export default class Wooboo {
    private meta = new Map<string, string>()
		public static Modifiers = Modifiers
    private readonly globalModifiers: GlobalModifier[] = []

    /**
     *
     * @param token Has to be unique around every instance
     * @param globalModifiers An array of modifiers that will be applied to every token in this class
     */
    constructor(private readonly token: string, globalModifiers?: GlobalModifier[]) {
        this.globalModifiers = globalModifiers || []
        WoobooRefs.registerRef(this.token, this)
    }

    /**
     *  Formats a string based on the passed token map
      * @param str String to format
     * @param data Token => data lookup map
     */
    public async fmt(str: string, data: Anchors) {
        const tokens = Tokenize(str)
        let final = str
				for (let tok of tokens) {
					const anchor = data[tok]
					if (anchor) {
						let value = await ApplyGlobalModifiers(str, anchor.value, tok, this, this.globalMods)
						value = await ApplyModifiers(str, value, tok, this, anchor.modifiers)
						final = final.replace(`{${tok}}`, value)
					}
				}
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
    public get globalMods() {
        return this.globalModifiers
    }

    public useGlobalModifier(mod: GlobalModifier) {
        this.globalModifiers.push(mod)
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

	/**
	 * Formats a string from an array `fmtArr("$0 is $1", ["Fileglass", "cool"])`
	 * @param str Input string
	 * @param data Array
	 */
	public fmtArr(str: string, ...data: string[]): string {
		data.forEach((word, idx) => {
			str = str.replace(`\$${idx}`, word);
		});
		return str;
	}
}
