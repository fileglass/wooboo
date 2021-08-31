export default function Tokenize(str: string): string[] {
    const v = str.match(/(?<=\{)([^\s\{\}]*\n?)(?=\})/g)
    return v || []
}
