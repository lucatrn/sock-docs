import { getElement, setElementClass } from "./html.js";
import { persistence, updatePersistence } from "./persistence.js";

let iconLight = getElement("theme-toggle-icon-light");
let iconDark = getElement("theme-toggle-icon-dark");
let buttonLabel = getElement("theme-toggle-state");

let isLightTheme = false;

getElement("theme-toggle").onclick = () => {
	setIsLightTheme(!isLightTheme);

	updatePersistence({ isLight: isLightTheme });
};

/**
 * @param {boolean} isLight
 */
function setIsLightTheme(isLight) {
	isLightTheme = isLight;

	setElementClass(iconLight, "hidden", !isLight);
	setElementClass(iconDark, "hidden", isLight);
	
	setElementClass(document.documentElement, "light", isLight);
	setElementClass(document.documentElement, "dark", !isLight);

	buttonLabel.textContent = isLight ? "Light" : "Dark";
}

setIsLightTheme(persistence.isLight ?? document.documentElement.classList.contains("light"));
