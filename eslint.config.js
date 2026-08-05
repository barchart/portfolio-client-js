import js from '@eslint/js';
import globals from 'globals';

export default [
	{
		ignores: [
			'**/node_modules/**',
			'packages/*/dist/**',
			'packages/*/test/SpecRunner.js',
			'packages/*/test/dist/**'
		]
	},
	js.configs.recommended,
	{
		files: ['packages/*/**/*.js'],
		ignores: ['**/test/specs/**'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'commonjs',
			globals: {
				...globals.node,
				...globals.browser
			}
		},
		rules: {
			'no-empty': 'off',
			'no-prototype-builtins': 'warn',
			'no-useless-escape': 'warn',
			'no-unused-vars': 'off'
		}
	},
	{
		files: ['packages/*/test/specs/**/*.js'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'commonjs',
			globals: {
				...globals.node,
				...globals.jasmine
			}
		},
		rules: {
			'no-empty': 'off',
			'no-prototype-builtins': 'off',
			'no-unsafe-finally': 'off',
			'no-useless-escape': 'off',
			'no-unused-vars': 'off'
		}
	}
];
