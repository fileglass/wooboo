import Wooboo, {WooboModifier} from "../wooboo";

export default async function ApplyModifiers(fullstr: string, repl: string | number | boolean, token: string, self: Wooboo, modifiers: WooboModifier[] = []) {
    const origVal = repl
		for (const mod of modifiers) {
			repl = await mod.execute(`${repl}`, repl, token, fullstr, origVal, self)

		}
    return repl as string
}
