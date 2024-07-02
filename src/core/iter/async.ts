export function asyncForeach<T>(
	iterable: Iterable<T>,
	timePoint: number = 100,
	timeout: number = 200,
) {
	const
		iter = iterable[Symbol.iterator]();

	let
		timer: ReturnType<typeof setTimeout>,
		time = Date.now();

	return {
		[Symbol.asyncIterator]() {
			return this;
		},

		async next() {
			const res = iter.next();

			if (Date.now() - time > timePoint) {
				await new Promise((resolve, reject) => {
					timer = setTimeout(() => {
						// if (cbTimeout) {
						// 	cbTimeout(el);
						// }

						time = Date.now();
						clearTimeout(timer);
						resolve("setTimeout is done");

					}, timeout);
				}).then(v => {
					console.log(v);
				});

				return Promise.resolve(res);

			} else {
				return Promise.resolve(res);
			}
		}
	};
}

export function iterInterval<T>(iterable: AsyncIterable<T>, interval: number) {
	const
		iter = iterable[Symbol.asyncIterator]();

	return {
		[Symbol.asyncIterator]() {
			return this;
		},

		async next() {
			const res = iter.next();

			await new Promise((resolve, reject) => {
				const timer = setTimeout(() => {
					clearTimeout(timer);
					resolve(res);
				}, interval);
			})

			return Promise.resolve(res);
		}
	}
}
