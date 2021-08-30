import Wooboo, {WooboModifier} from "../wooboo";

export default function ApplyModifiers(fullstr: string, repl: string | number | boolean, token: string, self: Wooboo, modifiers: WooboModifier[] = []) {
    const origVal = repl
    modifiers.forEach(mod => {
    repl = mod.execute(`${repl}`, repl, token, fullstr, origVal, self)
    })
    return repl as string
}