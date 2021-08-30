import Wooboo, {WooboModifier} from "../wooboo";

export default class Localizer implements WooboModifier {
    constructor(private readonly locales: { [key: string]: Map<string, string> }) {}
    execute(val: string, rawValue: string | number | boolean, token: string, rawString: string, originalValue: string | number | boolean, self: Wooboo): string {
            const locale = self.getMeta("LOCALE") as string
            return this.locales[locale].get(token) || token
    }
}
