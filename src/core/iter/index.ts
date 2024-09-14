export function map<T, U>(
	iterable: Iterable<T>,
	callback: (value: T, index?: number, iterable?: Iterable<T>) => U,
	thisArg?: unknown
) {
	const
		iter = iterable[Symbol.iterator]();

	let
		i = 0;

	return {
		[Symbol.iterator]() {
			return this;
		},

		next() {
			const res = iter.next();

			if (!res.done) {
				return {
					value: callback.call(thisArg, res.value, i++, iterable),
					done: res.done,
				};
			}

			return res;
		}
	}
}

export function filter<T>(
	iterable: Iterable<T>,
	predicate: (value: T, index?: number, iterable?: Iterable<T>) => boolean,
	thisArg?: unknown
) {
	const
		iter = iterable[Symbol.iterator]();

	let
		i = 0;

	return {
		[Symbol.iterator]() {
			return this;
		},

		next() {
			let
				res = iter.next(),
				isCondition = predicate.call(thisArg, res.value, i++, iterable);

			while (!res.done && !isCondition) {
				res = iter.next();
				isCondition = predicate.call(thisArg, res.value, i++, iterable);
			}

			return res;
		}
	}
}

export function enumerate<T>(iterable: Iterable<T>) {
	const
		iter = iterable[Symbol.iterator]();

	let
		count = 1;

	return {
		[Symbol.iterator]() {
			return this;
		},

		next() {
			const res = iter.next();

			if (!res.done) {
				return {
					value: [count++, res.value],
					done: res.done
				};
			}

			return res;
		}
	};
}

// export {asyncForeach} from "~core/iter/async";
// export {iterInterval} from "~core/iter/async";
//
// export default class Iter<T> {
// 	readonly #iter: Iterable<T>
//
// 	constructor(iter: Iterable<T>) {
// 		this.#iter = iter;
// 	}
//
// 	[Symbol.iterator](): Iterator<T> {
// 		const
// 			iter = this.#iter[Symbol.iterator]();
//
// 		return {
// 			next(): IteratorResult<T> {
// 				// console.log("syncIter");
// 				return iter.next();
// 			}
// 		};
// 	}
//
// 	[Symbol.asyncIterator](): AsyncIterableIterator<T> {
// 		const
// 			iter = this.#iter[Symbol.iterator]();
//
// 		return {
// 			next() {
// 				// console.log("asyncIter");
// 				return Promise.resolve(iter.next());
// 			},
//
// 			[Symbol.asyncIterator]() {
// 				return this;
// 			}
// 		};
// 	}
//
// 	public map(fn: (v: T) => T) {
// 		const
// 			iter = this.#iter[Symbol.iterator]();
//
// 		const newIter: IterableIterator<T> = {
// 			next(): IteratorResult<T> {
// 				const res = iter.next();
//
// 				if (!res.done) {
// 					return {
// 						value: fn(res.value),
// 						done: false,
// 					};
// 				}
//
// 				return res;
// 			},
//
// 			[Symbol.iterator]() {
// 				return this;
// 			}
// 		};
//
// 		this.#iter[Symbol.iterator] = () => newIter;
// 		return this;
// 	}
//
// 	public filter(fn: (v: T) => boolean) {
// 		const
// 			iter = this.#iter[Symbol.iterator]();
//
// 		const newIter: IterableIterator<T> = {
// 			next(): IteratorResult<T> {
// 				let res = iter.next();
// 				let isConditions = fn(res.value);
//
// 				while (!res.done && !isConditions) {
// 					res = iter.next();
// 					isConditions = fn(res.value);
// 				}
//
// 				return res;
// 			},
//
// 			[Symbol.iterator]() {
// 				return this;
// 			}
// 		};
//
// 		this.#iter[Symbol.iterator] = () => newIter;
// 		return this;
// 	}
//
// 	public enumerate() {
// 		const
// 			iter = this.#iter[Symbol.iterator]();
//
// 		let
// 			countIter = 1;
//
// 		const newIter: IterableIterator<[number, T]> = {
// 			next(): IteratorResult<[number, T]> {
// 				let res = iter.next();
//
// 				if (!res.done) {
// 					return {
// 						value: [countIter++, res.value],
// 						done: false,
// 					};
// 				}
//
// 				return res;
// 			},
//
// 			[Symbol.iterator]() {
// 				return this;
// 			}
// 		};
//
// 		return new Iter([...newIter]);
// 	}
//
// 	public take(count: number) {
// 		const
// 			iter = this.#iter[Symbol.iterator]();
//
// 		let i = 0;
//
// 		const newIter: IterableIterator<T> = {
// 			next() {
// 				let res = iter.next();
//
// 				if (!res.done && i < count) {
// 					i++;
// 					return res
// 				}
//
// 				return {
// 					value: null,
// 					done: true,
// 				};
// 			},
//
// 			[Symbol.iterator]() {
// 				return this;
// 			}
// 		};
//
// 		this.#iter[Symbol.iterator] = () => newIter;
// 		return this;
// 	}
//
// 	public repeat(count: number) {
// 		const that = this;
//
// 		let
// 			iter = this.#iter[Symbol.iterator]();
//
// 		let i = 1;
//
// 		const newIter: IterableIterator<T> = {
// 			next() {
// 				let res = iter.next();
//
// 				if (res.done && i >= count) {
// 					return {
// 						value: null,
// 						done: true
// 					};
// 				}
//
// 				if (res.done) {
// 					i++;
// 					iter = that.#iter[Symbol.iterator]();
// 					res = iter.next();
// 				}
//
// 				return {
// 					value: res.value,
// 					done: false,
// 				};
// 			},
//
// 			[Symbol.iterator]() {
// 				return this;
// 			}
// 		};
//
// 		return new Iter([...newIter])
// 	}
//
// 	public zip(...iterTuples: Iterable<unknown>[]) {
// 		let
// 			cursors: Iterator<any>[] = [];
//
// 		for (const iterEl of iterTuples) {
// 			const i = iterEl[Symbol.iterator]();
// 			cursors.push(i);
// 		}
//
// 		const newIter: IterableIterator<unknown[]> = {
// 			next(): IteratorResult<unknown[]> {
// 				let
// 					val = [];
//
// 				for (let i = 0; i < cursors.length; i++) {
// 					const res = cursors[i].next();
//
// 					if (res.done) {
// 						return {
// 							value: null,
// 							done: true
// 						};
// 					}
//
// 					val.push(res.value);
// 				}
//
// 				return {
// 					value: val,
// 					done: false
// 				};
// 			},
//
// 			[Symbol.iterator]() {
// 				return this;
// 			}
// 		};
//
// 		return new Iter([...newIter]);
// 	}
// };
