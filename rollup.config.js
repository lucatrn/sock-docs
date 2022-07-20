// RollupJS config file, for building JS client code.
//
// Usage:
//   rollup -c build-js.config.js
//   rollup -c build-js.config.js --watch

import { terser } from 'rollup-plugin-terser';

let watch = !!process.env.ROLLUP_WATCH;

export default {
	input: "src/main.js",
	output: {
		format: "iife",
		file: "docs/main.js",
		sourcemap: !watch,
	},
	plugins: [
		watch ? null : terser(),
	],
}
