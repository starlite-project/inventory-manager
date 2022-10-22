import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// const debug = !!process.env.TAURI_DEBUG;
const debug = true;

// https://vitejs.dev/config/
export default defineConfig({
	css: {
		modules: {
			generateScopedName: debug
				? '[name]__[local]__[hash:base64:5]'
				: '[hash:base64:5]',
		},
	},
	clearScreen: false,
	server: {
		strictPort: true,
	},
	plugins: [vue(), vueJsx()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	envPrefix: ['VITE_', 'TAURI_'],
	define: {
		__INVENTORY_MANAGER_FLAVOR__: JSON.stringify(debug ? 'dev' : 'prod'),
	},
	build: {
		target: ['es2021', 'chrome100', 'safari13'],
		minify: !debug ? 'esbuild' : false,
		sourcemap: debug,
	},
});
