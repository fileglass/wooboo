import Wooboo from "./wooboo"
import {CapitalizeFirst} from "./modifiers/casing";

//Create an instance
const formatter = new Wooboo("CATS");

const output = formatter.fmt("Hello, my name is {name} and I like {insert_cats}", {
	"name": {value: "wooboo", modifiers: [new CapitalizeFirst()]},
	"insert_cats": {value: "cats"}
})

console.log(output) //

