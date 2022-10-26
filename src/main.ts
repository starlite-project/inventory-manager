import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { attachConsole } from './plugins';
import { initi18n } from './setup/i18n';

const main = async (): Promise<void> => {
	await Promise.all([attachConsole()]);

	const app = createApp(App);

	(await initi18n(app)).use(createPinia()).use(router).mount('#app');
};

main();
