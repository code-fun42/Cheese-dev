import {defaultConfigNet} from "~core/net/config";
import Iter, {iterInterval} from "~core/iter";
import range from "~core/range";

export default async function isOnline(
	errorCallback?: Function,
	successCallback?: Function
): Promise<boolean | null> {
	if (
		(defaultConfigNet.checkUrl == null) ||
		(defaultConfigNet.checkInterval == null) ||
		(defaultConfigNet.timeout == null) ||
		(defaultConfigNet.retryCount == null)
	) {
		return null;
	}

	const
		url = defaultConfigNet.checkUrl,
		checkInterval = defaultConfigNet.checkInterval,
		timeout = defaultConfigNet.timeout;

	return new Promise((resolve, reject) => {
		let
			retryCount = 0;

		let
			timer: ReturnType<typeof setTimeout>;

		const
			controller = new AbortController(),
			{signal} = controller;

		checkOnline();

		function checkOnline() {
			const timerReq = setTimeout(() => {
				controller.abort();
				console.log("Abort")
				// if (errorCallback) {
				// 	errorCallback();
				// }

				retry();
			}, timeout);

			fetch(url, {
				mode: "no-cors",
				signal
			})
				.then((data) => {
					if (timer != null) {
						clearTimeout(timer);
					}

					clearTimeout(timerReq);

					if (successCallback) {
						successCallback();
					}

					resolve(true);

				})
				.catch((err) => {
					console.log("Catch")
					if (errorCallback) {
						errorCallback();
					}

					clearTimeout(timerReq);
					retry();
				});
		}

		function retry() {
			console.log(retryCount)
			if (
				defaultConfigNet.retryCount == null ||
				retryCount++ >= defaultConfigNet.retryCount
			) {
				reject(false);

			} else {
				timer = setTimeout(() => {
					clearTimeout(timer);
					checkOnline();
				}, checkInterval);
			}
		}
	});
};

export function threadOnline(
	errorCallback?: Function,
	successCallback?: Function
): CanNull<AsyncIterableIterator<boolean>> {
	if (
		(defaultConfigNet.checkUrl == null) ||
		(defaultConfigNet.checkInterval == null) ||
		(defaultConfigNet.timeout == null) ||
		(defaultConfigNet.retryCount == null)
	) {
		return null;
	}

	const
		url = defaultConfigNet.checkUrl,
		checkInterval = defaultConfigNet.checkInterval,
		timeout = defaultConfigNet.timeout,
		retryCount = defaultConfigNet.retryCount;

	return {
		[Symbol.asyncIterator]() {
			return this;
		},

		async next() {
			for await (const el of iterInterval(new Iter(range(1, retryCount)), checkInterval)) {

				const
					controller = new AbortController(),
					{signal} = controller;

				// let
				// 	isFinally = false;

				const timerReq = setTimeout(() => {
					controller.abort();
					// console.log("Abort");
					// if (!isFinally) {
					// 	console.log("Abort");
					// }
					// retry();
				}, timeout);

				let
					isError = false;

				try {
					const res = await fetch(url, {
						mode: "no-cors",
						signal
					});
				} catch (err) {
					isError = true;
					if (errorCallback) {
						errorCallback();
					}
				}
				clearTimeout(timerReq);

				if (!isError) {
					if (successCallback) {
						successCallback();
					}

					return Promise.resolve({
						value: true,
						done: false
					});
				}
			}

			return Promise.resolve({
				value: false,
				done: false
			});
		}
	}
}
