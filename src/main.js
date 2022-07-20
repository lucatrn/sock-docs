import "./theme.js";
import "./docs.js";
import { clearElement, createElement, getElement } from "./html.js";
import { searchSeactions, sections, sectionsPromise } from "./docs.js";
import { navigateTo } from "./navigation.js";

let searchForm = /** @type {HTMLFormElement} */(getElement("search-form"));
let searchInput = /** @type {HTMLInputElement} */(getElement("search"));
let mainContainer = document.querySelector("main");

/**
 * @param {SubmitEvent} event
 */
searchForm.onsubmit = (event) => {
	event.preventDefault();

	let searchValue = searchInput.value.trim();

	if (searchValue) {
		navigateTo("~" + searchValue);
	} else {
		navigateTo();
	}
};

sectionsPromise.then(() => {
	navigateFromURL();
});

function showHome() {
	clearElement(mainContainer);

	sections[0].toHTML(mainContainer);
}

getElement("title-link").onclick = (event) => {
	if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
		event.preventDefault();
		navigateTo();
	}
};

addEventListener("hashchange", (ev) => {
	navigateFromURL();
});

function navigateFromURL() {
	let title = location.hash.slice(1);

	if (title) {
		title = decodeURIComponent(title);

		if (title[0] === "~") {
			search(title.slice(1));
		} else {
			let matchingSections = sections.filter(section => section.matchesTitle(title));
		
			clearElement(mainContainer);
		
			if (matchingSections.length > 0) {
				for (let section of matchingSections) {
					section.toHTML(mainContainer);
				}
			} else {
				mainContainer.append(
					createElement("p", {}, `Could not find information about "${title}".`)
				);
			}
		}
	} else {
		showHome();
	}
}

/**
 * @param {string} search
 */
function search(search) {
	searchInput.value = search;

	clearElement(mainContainer);

	let matches = searchSeactions(search);

	if (matches.length === 0) {
		mainContainer.append(`No items match search "${search}".`);
	} else {
		for (let match of matches) {
			match.toHTML(mainContainer);
		}
	}
}
