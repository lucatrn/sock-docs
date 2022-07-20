
/** @type {(((arg: any) => void) & { type: string, iframe: HTMLIFrameElement })[]} */
let waitingMessages  = [];

addEventListener("message", (event) => {
	let data = event.data;
	if (data && typeof data === "object") {
		let msgType = data.type;
		if (msgType) {
			let arg = data.data;

			// Pull out functions with the corresponding type.
			let stillWaiting = [];
			let callNow = [];
			for (let f of waitingMessages) {
				if (f.type === msgType && (!f.iframe || f.iframe.contentWindow === event.source)) {
					callNow.push(f);
				} else {
					stillWaiting.push(f);
				}
			}
			waitingMessages = stillWaiting;

			// Call matching functions.
			for (let f of callNow) {
				f(arg);
			}
		}
	}
});

/**
 * @param {string} type
 * @param {HTMLIFrameElement} [iframe]
 * @returns {Promise<any>}
 */
export function waitForMessage(type, iframe) {
	return new Promise(/** @param {((arg: any) => void) & { type: string, iframe: HTMLIFrameElement }} resolve */(resolve) => {
		resolve.type = type;
		resolve.iframe = iframe;
		waitingMessages.push(resolve);
	});
}
