import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { initRouter } from './setup/router';
import { attachConsole } from './plugins';
import { initi18n } from './setup/i18n';

const main = async (): Promise<void> => {
	await Promise.all([attachConsole()]);

	const app = createApp(App);

	initRouter(await initi18n(app))
		.use(createPinia())
		.mount('#app');
};

main();

declare module 'vue-router' {
	interface RouteMeta {
		requiresAuth: boolean;
	}
}
