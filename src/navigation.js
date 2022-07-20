
/**
 * @param {string} [title]
 */
export function navigateTo(title) {
	if (title) {
		location.hash = "#" + title;
	} else {
		history.pushState(null, null, " ");

		dispatchEvent(new Event("hashchange"));
	}
}
