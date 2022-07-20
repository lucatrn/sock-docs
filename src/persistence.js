
let LOCAL_STORAGE_KEY = "sock_docs";

/**
 * @type {Partial<Persistence>}
 */
let defaults = {
};

/** @type {Persistence} */
let curr;

let savedJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
if (savedJSON) {
	try {
		curr = JSON.parse(savedJSON);
	} catch (error) {
		console.error(error);
	}
}

curr = Object.assign({}, defaults, curr);

/**
 * @type {Readonly<Persistence>}
 */
export let persistence = curr;

/**
 * @param {Partial<Persistence>} p 
 */
export function updatePersistence(p) {
	for (let key in p) {
		curr[key] = p[key];
	}

	localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(curr));
}

/**
 * @typedef {object} Persistence
 * @property {boolean} isLight
 */
