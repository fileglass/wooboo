import {WooboModifier} from "../wooboo";


export class UpperCase implements WooboModifier{
execute(val: string): string {
    return val.toUpperCase()
}
}

export class LowerCase implements WooboModifier {
    execute(val: string): string {
        return val.toLowerCase()
    }
}
