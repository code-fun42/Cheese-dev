// import {isOnline} from "~core/net";
//
import {iterInterval} from "~core/iter";

const successCallback = () => {
	console.log("successCallback");
};

const errorCallback = () => {
	console.log("errorCallback");
};
//
// isOnline(errorCallback, successCallback)
// 	.then((data) => {
// 		console.log("success");
//
// 	})
// 	.catch((err) => {
// 		console.log("err: ", err);
// 	});

import {threadOnline} from "~core/net/engines/browser";

const threadIter = threadOnline(errorCallback, successCallback);

(async () => {
	if (!threadIter) {
		return;
	}

	for await (const status of iterInterval(threadIter, 2000)) {
		// console.log("Итерация завершилась");
		console.log(`user in online ${status}`);
	}
})();
