import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { visualizer } from 'rollup-plugin-visualizer';

const debug = !!(process.env.TAURI_DEBUG ?? true);

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
	plugins: [
		vue(),
		vueJsx(),
		visualizer({
			sourcemap: true,
		}),
	],
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
		minify: !debug,
		sourcemap: debug,
	},
});
