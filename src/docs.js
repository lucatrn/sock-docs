import { createElement } from "./html.js";
import { waitForMessage } from "./messaging.js";

async function loadDocs() {
	let response = await fetch("docs.html");
	let text = await response.text();

	let tempDiv = createElement("div");
	tempDiv.innerHTML = "<template>" + text + "</template>";

	let template = /** @type {HTMLTemplateElement} */(tempDiv.firstChild);

	let html = template.content;

	sections = /** @type {HTMLElement[]} */(Array.from(html.children)).map(e => new Section(e));
	
	console.log(sections);

	return sections;
}

class Section {
	/**
	 * @param {HTMLElement} baseElement
	 */
	constructor(baseElement) {
		this.summary = baseElement.dataset.summary;

		let h2s = baseElement.querySelectorAll("h2");

		/**
		 * @type {Signature[]}
		 */
		this.signatures = Array.from(h2s).map((h2) => {
			let title = h2.textContent;
			let type = h2.dataset.type;
			h2.remove();

			if (type) {
				return new InfoSignature(title, type);
			} else {
				return compileSignature(title);
			}
		});
		

		let tag = baseElement.dataset.tag;
		if (tag) {
			/** @type {string[]} */
			this.tags = tag.split(/\s+/);
		} else {
			this.tags = [];
		}

		/** @type {VirtualNode[]} */
		this.nodes = [];

		this.fromHtml(baseElement, this.nodes);

		if (!this.summary) {
			let p = /** @type {HTMLParagraphElement} */(this.nodes.find(el => el instanceof HTMLParagraphElement));
			if (p) {
				this.summary = p.textContent;
			}
		}
	}

	/**
	 * @private
	 * @param {ParentNode} parentNode
	 * @param {VirtualNode[]} parent
	 */
	fromHtml(parentNode, parent) {
		for (let child of /** @type {HTMLElement[]} */(Array.from(parentNode.children))) {
			if (child instanceof HTMLScriptElement) {
				let example = Example.fromElement(child);

				parent.push(example);
			} else if (child instanceof HTMLDetailsElement) {
				let detailNodes = [];
				this.fromHtml(child, detailNodes);
				let details = new VirtualElement("details", {}, detailNodes);
				
				parent.push(details);
			} else {
				if (child instanceof HTMLPreElement) {
					child.textContent = normalizeCode(child.textContent);
				}

				parent.push(child);
			}
		}
	}

	/**
	 * @param {ParentNode} parent 
	 */
	toHTML(parent) {
		let section = createElement("section");

		for (let signature of this.signatures) {
			let h2 = createElement("h2");
			signature.toHTML(h2);
			section.append(h2);
		}

		instantiateVirtualNodes(section, this.nodes);

		parent.append(section);
	}

	/**
	 * @param {string} title
	 */
	matchesTitle(title) {
		return this.signatures.some((signature) => signature && signature.matchesTitle(title));
	}

	/**
	 * @param {string} search should be lowercase
	 * @returns {number}
	 */
	searchScore(search) {
		for (let signature of this.signatures) {
			if (signature.keywords.includes(search)) return 6;

			for (let keyword of signature.keywords) {
				if (keyword.includes(search)) {
					return 5;
				}
			}

			if (signature.signature.includes(search)) return 4;
		}

		for (let tag of this.tags) {
			if (tag === search) return 3;
			if (tag.includes(search)) return 2;
		}

		// for (let element of this.htmlTemplateElements) {
		// 	if (element.textContent.includes(search)) return 1;
		// }

		return 0;
	}
}

class VirtualElement {
	/**
	 * @param {keyof HTMLElementTagNameMap} tag
	 * @param {Record<string, string>} [attributes] 
	 * @param {VirtualNode[]} [nodes]
	 */
	constructor(tag, attributes, nodes) {
		this.tag = tag;
		this.attributes = attributes || {};
		this.nodes = nodes || [];
	}

	/**
	 * @param {ParentNode} parent 
	 */
	toHTML(parent) {
		let element = createElement(this.tag, this.attributes);

		instantiateVirtualNodes(element, this.nodes);

		parent.append(element);
	}
}

class Example {
	/**
	 * @param {string} code
	 * @param {string} script
	 */
	constructor(code, script) {
		this.code = code;
		this.script = script;
	}

	/**
	 * @param {ParentNode} parent 
	 */
	toHTML(parent) {
		parent.append(
			createElement("pre", {}, this.code)
		);

		let runButton = createElement("button", { class: "accent-button" });
		runButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="accent-button-icon"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>Run Example';

		parent.append(runButton);

		runButton.onclick = () => {
			let iframe = createElement("iframe", { src: "player", width: "100%", height: "100%" });
			
			let closeButton = createElement("button", { class: "player-stop hidden" });
			closeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="player-stop-icon"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

			let player = createElement("div", { class: "player"}, [
				iframe,
				closeButton,
			]);

			runButton.replaceWith(player);

			// Send script once the iframe is ready.
			waitForMessage("ready", iframe).then(() => {
				iframe.contentWindow.postMessage({ type: "script", data: this.script });

				// Handle stopping.
				closeButton.classList.remove("hidden");
				closeButton.onclick = () => {
					iframe.src = "about:blank";
					iframe = null;
					player.replaceWith(runButton);
				};
			});
		}
	}

	/**
	 * @param {HTMLScriptElement} e
	 */
	static fromElement(e) {
		let code = normalizeCode(e.text);
		let tags = e.dataset.tag?.split(/\s+/) ?? [];

		let script = code;
		if (!code.includes("Game.begin") && !tags.includes("noloop")) {
			script = "Game.begin {\n";
			if (!tags.includes("noclear")) script += "Game.clear()\n";
			script += code + "\n";
			if (tags.includes("once")) script += "Game.quit()\n";
			script += "}";
		}

		return new Example(code, script);
	}
}

/**
 * @param {string} rawCode
 */
function normalizeCode(rawCode) {
	let result = /^\s+/.exec(rawCode.slice(1));
	
	let code;
	if (result) {
		code = ("\n" + rawCode).replaceAll("\n" + result[0], "\n");
	} else {
		code = rawCode;
	}

	code = code.trim();

	return code;
}


let CLS_CLASS = "sg-class";
let CLS_PROPERTY = "sg-property";
let CLS_PARAMETER = "sg-parameter";
let CLS_TYPE = "sg-type";

class Signature {
	/**
	 * @param {ParentNode} parent 
	 */
	toHTML(parent) { throw Error("not implemented") }

	/**
	 * @param {string} title
	 */
	matchesTitle(title) {
		return this.signature === title;
	}
}

Signature.prototype.signature = "";

/** @type {string[]} */
Signature.prototype.keywords = [];

/**
 * @param {string} type
 */
function compoundTypeToHTML(type) {
	let r = type.split(/([a-zA-Z]+)/);

	let parent = createElement("span", { class: CLS_TYPE });

	r.forEach((part, i) => {
		if (i % 2 === 0) {
			parent.append(part);
		} else {
			parent.append(createAPILinkText(part, part));
		}
	});

	return parent;
}

/**
 * @param {string} text
 * @param {string} title
 * @param {string} [className]
 */
function createAPILinkText(text, title, className) {
	let fullClass = "no-underline";
	if (className) {
		fullClass += " " + className;
	}

	if (title === "null") {
		title = "Null";
	}

	let a = createElement("a", { class: fullClass, href: "#" + title }, text);

	let section = sections.find(section => section.matchesTitle(title));
	if (section && section.summary) {
		a.title = section.summary;
	}

	return a;
}


class InfoSignature extends Signature {
	/**
	 * @param {string} name
	 * @param {string} type
	 */
	constructor(name, type) {
		super();

		this.name = name;
		this.type = type;
		this.signature = name;
		this.keywords = [ name.toLowerCase() ];
	}

	/**
	 * @param {ParentNode} parent 
	 */
	toHTML(parent) {
		let cls = "";
		if (this.type === "type") {
			cls = CLS_TYPE;
		}

		parent.append(
			createAPILinkText(this.name, this.name, cls)
		);
	}
}

class ClassSignature extends Signature {
	/**
	 * @param {string} className
	 */
	constructor(className) {
		super();

		this.name = className;
		this.signature = className;
		this.keywords = [ className.toLowerCase() ];
	}

	/**
	 * @param {ParentNode} parent 
	 */
	toHTML(parent) {
		parent.append(
			createAPILinkText(this.name, this.name, CLS_CLASS)
		);
	}
}

/**
 * @param {string} className
 * @param {boolean} isStatic 
 */
function correctClassCase(className, isStatic) {
	return isStatic ? className : (className[0].toLowerCase() + className.slice(1));
}

/**
 * @param {ParentNode} parent
 * @param {string} className
 * @param {boolean} isStatic
 * @param {string} methodName
 * @param {string} signature
 */
function addClassAndMethodNameSignature(parent, className, isStatic, methodName, signature) {
	parent.append(
		createAPILinkText(correctClassCase(className, isStatic), className, CLS_CLASS),
		".",
		createAPILinkText(methodName, signature, CLS_PROPERTY),
	);
}

/**
 * @param {ParentNode} parent
 * @param {string|null} type
 */
function addReturnType(parent, type) {
	if (type) {
		parent.append(
			": ",
			compoundTypeToHTML(type),
		);
	}
}

class PropertySignature extends Signature {
	/**
	 * @param {string} className
	 * @param {boolean} isStatic
	 * @param {string} propertyName
	 * @param {string|null} type
	 */
	constructor(className, isStatic, propertyName, type) {
		super();

		this.class = className;
		this.isStatic = isStatic;
		this.property = propertyName;
		this.type = type;
		this.signature = correctClassCase(className, isStatic) + "." + propertyName;
		this.keywords = [ className.toLowerCase(), propertyName.toLowerCase() ];
	}

	/**
	 * @param {string} title
	 */
	matchesTitle(title) {
		return this.class === title || super.matchesTitle(title);
	}

	/**
	 * @param {ParentNode} parent 
	 */
	toHTML(parent) {
		addClassAndMethodNameSignature(parent, this.class, this.isStatic, this.property, this.signature);
		addReturnType(parent, this.type);
	}
}

class MethodSignature extends Signature {
	/**
	 * @param {string} className
	 * @param {boolean} isStatic
	 * @param {string} methodName
	 * @param {Parameter[]} parameters
	 * @param {string|null} returnType
	 */
	constructor(className, isStatic, methodName, parameters, returnType) {
		super();

		this.class = className;
		this.isStatic = isStatic;
		this.method = methodName;
		this.parameters = parameters;
		this.returnType = returnType;
		this.signature = correctClassCase(className, isStatic) + "." + methodName + "(" + parameters.map(() => "_").join(",") + ")";
		this.keywords = [ className.toLowerCase(), methodName.toLowerCase() ];
		for (let param of parameters) {
			this.keywords.push(param.name.toLowerCase());
		}
	}

	/**
	 * @param {string} title
	 */
	matchesTitle(title) {
		return this.class === title || super.matchesTitle(title);
	}

	/**
	 * @param {ParentNode} parent 
	 */
	toHTML(parent) {
		addClassAndMethodNameSignature(parent, this.class, this.isStatic, this.method, this.signature);

		parent.append("(");

		this.parameters.forEach((param, i) => {
			if (i > 0) {
				parent.append(", ");
			}

			parent.append(
				createElement("span", { class: CLS_PARAMETER }, param.name),
				": ",
				compoundTypeToHTML(param.type),
			);
		});

		parent.append(")");

		addReturnType(parent, this.returnType);
	}
}

class Parameter {
	/**
	 * @param {string} name
	 * @param {string} type
	 */
	constructor(name, type) {
		this.name = name;
		this.type = type;
	}
}

/**
 * @param {string} s
 * @returns {Signature}
 */
function compileSignature(s) {
	if (/^[a-zA-Z0-9]+$/.test(s)) {
		return new ClassSignature(s);
	}

	let dot = s.indexOf(".");

	if (dot > 0) {
		let className = s.slice(0, dot);
		let isStatic = /^[A-Z]/.test(s);

		className = className[0].toUpperCase() + className.slice(1);

		let rest = s.slice(dot + 1);

		let openParen = rest.indexOf("(");
		if (openParen > 0) {
			let method = rest.slice(0, openParen);

			let closeParen = rest.lastIndexOf(")");
			if (closeParen < 0) throw Error("missing closing paren");

			let params = [];
			let paramParts = rest.slice(openParen + 1, closeParen).split(/,\s*/);
			if (paramParts.length !== 1 || paramParts[0].length > 0) {
				for (let part of paramParts) {
					let colon = part.indexOf(":");
					let name = colon < 0 ? part : part.slice(0, colon);
					let type = colon < 0 ? null : part.slice(colon + 1).trim();
					params.push(new Parameter(name, type));
				}
			}

			let colon = rest.indexOf(":", closeParen);
			let returnType = colon < 0 ? null : rest.slice(colon + 1).trim();

			return new MethodSignature(className, isStatic, method, params, returnType);
		}

		let colon = rest.indexOf(":");
		let property = colon < 0 ? rest : rest.slice(0, colon);
		let type = colon < 0 ? null : rest.slice(colon + 1).trim();

		return new PropertySignature(className, isStatic, property, type);
	}

	throw Error("invalid signature: " + s);
}


/** @type {Section[]} */
export let sections = [];

export let sectionsPromise = loadDocs();

/**
 * @param {string} search
 * @returns {Section[]}
 */
export function searchSeactions(search) {
	search = search.trim().toLowerCase();

	if (search.length <= 1) return [];

	/** @type {{ score: number, section: Section }[]} */
	let matches = [];

	for (let section of sections) {
		let score = section.searchScore(search);

		if (score > 0) {
			matches.push({ score: score, section: section });
		}
	}

	matches.sort((a, b) => b.score - a.score);

	return matches.map(match => match.section);
}

/**
 * 
 * @param {HTMLElement} parentNode
 * @param {VirtualNode[]} nodes
 */
function instantiateVirtualNodes(parentNode, nodes) {
	for (let node of nodes) {
		if (node instanceof HTMLElement) {
			parentNode.append(node);
		} else if (Array.isArray(node)) {
			instantiateVirtualNodes(parentNode, nodes);
		} else {
			node.toHTML(parentNode);
		}
	}
}

/**
 * @typedef {object} ToHTML
 * @property {(parent: HTMLElement) => void} toHTML
 */

/**
 * @typedef {HTMLElement|ToHTML|VirtualNodes} VirtualNode
 */
/**
 * @typedef {VirtualNode[]} VirtualNodes
 */
