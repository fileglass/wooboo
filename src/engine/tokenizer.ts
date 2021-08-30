export default function Tokenize(str: string): string[] {
    const v = str.match(/(?<=\{)([^\s\{\}]*\n?)(?=\})/g)
    if (v) {
        return v.map(tok => tok)
    } else {
        return []
    }
}