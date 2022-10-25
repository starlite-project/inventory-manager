import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import setupRouter from './router';
import en from './locale/en.json';

import { attachConsole } from './plugins';
import { defaultLanguage, setupI18n } from './utils/i18n';

const main = async (): Promise<void> => {
	await Promise.all([attachConsole()]);

	const i18n = setupI18n({
		legacy: false,
		locale: defaultLanguage(),
		fallbackLocale: 'en',
		messages: { en },
	});

	const router = setupRouter(i18n);

	const app = createApp(App);

	app.use(createPinia()).use(router).mount('#app');
};

main();
