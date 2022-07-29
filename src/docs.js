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
			let superClass = h2.dataset.super;
			h2.remove();

			if (type) {
				return new InfoSignature(title, type);
			} else {
				return compileSignature(title, superClass);
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
	while (rawCode[0] === "\n" || rawCode[0] === "\r") {
		rawCode = rawCode.slice(1);
	}

	let result = /^\s+/.exec(rawCode);
	
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
	toHTML(parent) {
		parent.append(
			createElement("a", { href: "#" + this.signature, class: "permalink" }, "#"),
		);
	}

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
	if (title === "this") {
		return createElement("span", { class: CLS_TYPE }, text);
	}

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
	 * @param {string|null} superClass
	 */
	constructor(className, superClass) {
		super();

		this.name = className;
		this.superClass = superClass;
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

		if (this.superClass) {
			parent.append(
				createElement("span", { style: "opacity: 0.6; margin-left: 0.2em;" }, [
					" is ",
					createAPILinkText(this.superClass, this.superClass, CLS_CLASS)
				])
			);
		}
	}
}

class PrefixOperatorSignature extends Signature {
	/**
	 * @param {string} className
	 * @param {string} operator
	 * @param {string|null} type
	 */
	constructor(className, operator, type) {
		super();

		this.className = className;
		this.operator = operator;
		this.type = type;
		this.signature = operator + uncapitalize(className);
		this.keywords = [ className.toLowerCase(), operator ];
	}

	/**
	 * @param {string} title
	 */
	matchesTitle(title) {
		return this.className === title || this.operator === title || super.matchesTitle(title);
	}

	/**
	 * @param {ParentNode} parent 
	 */
	toHTML(parent) {
		parent.append(
			createAPILinkText(this.operator, this.signature, CLS_TYPE),
			createAPILinkText(uncapitalize(this.className), this.className, CLS_CLASS),
		);

		if (this.type) {
			parent.append(
				": ",
				compoundTypeToHTML(this.type),
			);
		}

		super.toHTML(parent);
	}
}

class InfixOperatorSignature extends Signature {
	/**
	 * @param {string} cls1
	 * @param {string} cls2
	 * @param {string} returnType
	 * @param {string} operator
	 */
	constructor(cls1, cls2, returnType, operator) {
		super();

		this.className1 = cls1;
		this.className2 = cls2;
		this.returnType = returnType;
		this.operator = operator;
		this.signature = uncapitalize(cls1) + operator + uncapitalize(cls2);
		this.keywords = [ cls1.toLowerCase(), cls2.toLowerCase(), operator ];
	}

	/**
	 * @param {string} title
	 */
	matchesTitle(title) {
		return this.className1 === title || this.className2 === title || this.operator === title || super.matchesTitle(title);
	}

	/**
	 * @param {ParentNode} parent 
	 */
	toHTML(parent) {
		parent.append(
			createAPILinkText(uncapitalize(this.className1), this.className1, CLS_CLASS),
			" " + this.operator + " ",
			createAPILinkText(uncapitalize(this.className2), this.className2, CLS_CLASS),
		);

		if (this.returnType) {
			parent.append(
				" ⇒ ",
				compoundTypeToHTML(this.returnType),
			);
		}

		super.toHTML(parent);
	}
}

/**
 * @param {string} className
 * @param {boolean} isStatic 
 */
function correctClassCase(className, isStatic) {
	return isStatic ? className : uncapitalize(className);
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
		methodName,
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

		super.toHTML(parent);
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
		this.signature = correctClassCase(className, isStatic) + "." + methodName + "(" + parameters.filter(p => !p.name.endsWith("...")).map(() => "_").join(",") + ")";
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
			);

			if (param.type) {
				parent.append(
					": ",
					compoundTypeToHTML(param.type),
				);
			}
		});

		parent.append(")");

		addReturnType(parent, this.returnType);

		super.toHTML(parent);
	}
}

class SubscriptSignature extends Signature {
	/**
	 * @param {string} className
	 * @param {boolean} isStatic
	 * @param {boolean} isSetter
	 * @param {Parameter[]} parameters
	 * @param {string|null} type
	 */
	constructor(className, isStatic, isSetter, parameters, type) {
		super();

		this.class = className;
		this.isStatic = isStatic;
		this.isSetter = isSetter;
		this.parameters = parameters;
		this.type = type;
		this.signature = correctClassCase(className, isStatic) + "[" + parameters.map(() => "_").join(",") + "]";
		if (isSetter) {
			this.signature += "=(_)";
		}
		this.keywords = [ className.toLowerCase() ];
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
		parent.append(
			createAPILinkText(correctClassCase(this.class, this.isStatic), this.class, CLS_CLASS),
		);

		parent.append("[");

		this.parameters.forEach((param, i) => {
			if (i > 0) {
				parent.append(", ");
			}

			parent.append(
				createElement("span", { class: CLS_PARAMETER }, param.name),
			);

			if (param.type) {
				parent.append(
					": ",
					compoundTypeToHTML(param.type),
				);
			}
		});

		parent.append(this.isSetter ? "] = " : "]: ");

		parent.append(compoundTypeToHTML(this.type || "any"));

		super.toHTML(parent);
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
 * @param {string|null} superClass
 * @returns {Signature}
 */
function compileSignature(s, superClass) {
	if (/^[a-zA-Z0-9]+$/.test(s)) {
		return new ClassSignature(s, superClass);
	}

	let execOperator = /^([^ a-zA-Z0-9]+) ?([a-zA-Z0-9]+)/.exec(s);
	if (execOperator) {
		let operator = execOperator[1];
		let cls = capitalize(execOperator[2]);

		s = s.slice(execOperator[0].length);
		let colon = s.indexOf(":");
		let type = colon < 0 ? null : s.slice(colon + 1).trim();

		return new PrefixOperatorSignature(cls, operator, type);
	}
	
	execOperator = /^([a-zA-Z0-9]+) (\S+) ([a-zA-Z0-9]+)/.exec(s);
	if (execOperator) {
		let cls1 = capitalize(execOperator[1]);
		let operator = execOperator[2];
		let cls2 = capitalize(execOperator[3]);

		s = s.slice(execOperator[0].length);
		let colon = s.indexOf(":");
		let type = colon < 0 ? null : s.slice(colon + 1).trim();

		return new InfixOperatorSignature(cls1, cls2, type, operator);
	}

	let b = compileMethodSignature(s, true, "(", ")");
	if (b) return b;

	b = compileMethodSignature(s, false, "[", "]");
	if (b) return b;

	throw Error("invalid signature: " + s);
}

/**
 * @param {string} s
 * @param {boolean} hasName
 * @param {string} openSymbol
 * @param {string} closeSymbol
 * @returns {Signature}
 */
function compileMethodSignature(s, hasName, openSymbol, closeSymbol) {
	let nameEnd = s.indexOf(hasName ? "." : openSymbol);
	if (nameEnd < 0) return null;

	let className = s.slice(0, nameEnd);
	s = s.slice(hasName ? nameEnd + 1 : nameEnd);

	let isStatic = /^[A-Z]/.test(className);

	className = capitalize(className);

	let open = s.indexOf(openSymbol);
	if (open >= 0) {
		let method = s.slice(0, open);

		let close = s.lastIndexOf(closeSymbol);
		if (close < 0) throw Error("missing closing " + closeSymbol);

		let params = [];
		let paramParts = s.slice(open + 1, close).split(/,\s*/);
		if (paramParts.length !== 1 || paramParts[0].length > 0) {
			for (let part of paramParts) {
				let colon = part.indexOf(":");
				let name = colon < 0 ? part : part.slice(0, colon);
				let type = colon < 0 ? null : part.slice(colon + 1).trim();
				params.push(new Parameter(name, type));
			}
		}

		if (method) {
			let colon = s.indexOf(":", close);
			let returnType = colon < 0 ? null : s.slice(colon + 1).trim();

			return new MethodSignature(className, isStatic, method, params, returnType);
		} else {
			let isSetter = false;
			let colon = s.indexOf(":", close);
			if (colon < 0) {
				colon = s.indexOf("=", close);
				if (colon >= 0) isSetter = true;
			}
			let returnType = colon < 0 ? null : s.slice(colon + 1).trim();
			
			return new SubscriptSignature(className, isStatic, isSetter, params, returnType);
		}
	}

	let colon = s.indexOf(":");
	let property = colon < 0 ? s : s.slice(0, colon);
	let type = colon < 0 ? null : s.slice(colon + 1).trim();

	return new PropertySignature(className, isStatic, property, type);
}

/**
 * @param {string} s
 */
function capitalize(s) {
	return s[0].toUpperCase() + s.slice(1);
}

/**
 * @param {string} s
 */
function uncapitalize(s) {
	return s[0].toLowerCase() + s.slice(1);
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
		if (node instanceof Element) {
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
