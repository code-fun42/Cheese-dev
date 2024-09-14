import {filter, map} from "~core/iter";

const a = [1, 2, 3, 4, 5];
let iter = map(a, (v,i, iterable) => {
	// console.log(i);
	// console.log(iterable);
	return v * 2;
});
// console.log([...iter]);

iter = filter(iter, (v, i, iterable) => v % 2 === 0);
console.log([...iter]);
