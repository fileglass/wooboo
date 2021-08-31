import Wooboo, {GlobalModifier} from "../wooboo";
import micromatch from "micromatch"

export default async function ApplyGlobalModifiers(fullstr: string, repl: string | number | boolean, token: string, self: Wooboo, modifiers: GlobalModifier[] = []) {
	const origVal = repl

	for (const mod of modifiers) {
		if (micromatch.isMatch(`${token}`, mod.match || "*") || !mod.match) {
			repl = await mod.modifier.execute(`${repl}`, repl, token, fullstr, origVal, self)
		}
	}
	return repl as string
}
