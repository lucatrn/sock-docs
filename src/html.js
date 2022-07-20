
/**
 * @param {string} id
 * @returns {HTMLElement}
 */
export function getElement(id) {
	return document.getElementById(id);
}

/**
 * 
 * @param {Element} element
 * @param {string} className
 * @param {boolean} enabled
 */
export function setElementClass(element, className, enabled) {
	if (enabled) {
		element.classList.add(className);
	} else {
		element.classList.remove(className);
	}
}

/**
 * @param {K} tag 
 * @param {Record<string, any>} [attributes] 
 * @param {any} [nodes]
 * @returns {HTMLElementTagNameMap[K]}
 * @template {keyof HTMLElementTagNameMap} K
 */
export function createElement(tag, attributes, nodes) {
	let element = document.createElement(tag);

	if (attributes) {
		withAttributes(element, attributes);
	}

	appendNodes(element, nodes);

	return element;
}

/**
 * @param {T} element
 * @param {Record<string, any>} attributes 
 * @returns {T}
 * @template {Element} T
 */
export function withAttributes(element, attributes) {
	for (let name in attributes) {
		let value = attributes[name];

		if (name.startsWith("on")) {
			element[name] = value;
		} else {
			if (value === true) {
				element.setAttribute(name, "");
			} else if (value == null || value === false) {
				// Ignore.
			} else {
				element.setAttribute(name, value);
			}
		}
	}

	return element;
}

/**
 * @param {ParentNode} parent 
 * @param {Node|Node[]} nodes 
 */
export function appendNodes(parent, nodes) {
	if (nodes) {
		if (Array.isArray(nodes)) {
			for (let node of nodes) {
				parent.append(node);
			}
		} else {
			parent.append(nodes);
		}
	}
}

/**
 * @param {HTMLElement} el
 */
export function clearElement(el) {
	el.innerHTML = "";
}
