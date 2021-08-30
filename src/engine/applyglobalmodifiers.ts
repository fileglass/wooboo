import Wooboo, {GlobalModifier} from "../wooboo";
import micromatch from "micromatch"

export default function ApplyGlobalModifiers(fullstr: string, repl: string | number | boolean, token: string, self: Wooboo, modifiers: GlobalModifier[] = []) {
	const origVal = repl
	modifiers.forEach(mod => {
		if (micromatch.isMatch(`${token}`, mod.match)) {
			repl = mod.modifier.execute(`${repl}`, repl, token, fullstr, origVal, self)
		}
	})
	return repl as string
}
