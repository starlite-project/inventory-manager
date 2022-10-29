import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { attachConsole } from './plugins';
import { initi18n } from './setup/i18n';
import { useAccountStore } from './stores';

const main = async (): Promise<void> => {
	await Promise.all([attachConsole()]);

	const app = createApp(App);

	(await initi18n(app)).use(createPinia());
	router.beforeEach((to) => {
		const account = useAccountStore();
		if (to.meta.requiresAuth && !account.isLoggedIn) {
			return {
				path: '/login',
			};
		}
	});
	app.use(router).mount('#app');
};

main();

declare module 'vue-router' {
	interface RouteMeta {
		requiresAuth: boolean;
	}
}
