const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");
const typescript = require("@rollup/plugin-typescript");
const alias = require("@rollup/plugin-alias");
const terser = require("@rollup/plugin-terser");

const pkg = require("./package.json");

module.exports = {
	input: "src/lib.ts",
	output: [
		{
			file: pkg.main,
			name: pkg.name,
			format: "cjs",
			sourcemap: true,
		},
		{
			file: pkg.browser,
			name: pkg.name,
			format: 'umd',
			sourcemap: true,
		},
		{
			file: pkg.module,
			name: pkg.name,
			format: "esm",
			sourcemap: true,
		},
	],
	plugins: [
		resolve(),
		commonjs(),
		terser(),
		typescript({
			tsconfig: "./tsconfig.json",
		}),
		alias({
			entries: [
				{find: '~core', replacement: 'src/core'},
				{find: '~assets', replacement: 'assets'},
			]
		}),
	],
};
