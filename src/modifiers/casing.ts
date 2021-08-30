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

export class CapitalizeFirst implements WooboModifier {
	execute(val: string, rawValue: string | number | boolean, token: string): string {
		return val.charAt(0).toUpperCase() + val.slice(1);
	}
}
