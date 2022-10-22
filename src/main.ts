import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import { attachConsole } from './plugins';
import { initi18n } from './utils/i18n';

const main = async (): Promise<void> => {
	await Promise.all([attachConsole(), initi18n()]);

	const app = createApp(App);

	app.use(createPinia()).use(router).mount('#app');
};

main();
