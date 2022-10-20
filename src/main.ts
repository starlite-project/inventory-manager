import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import './assets/main.css';
import { attachConsole } from './plugins';

const main = async (): Promise<void> => {
	await attachConsole();

	const app = createApp(App);

	app.use(createPinia()).use(router).mount('#app');
};

main();
