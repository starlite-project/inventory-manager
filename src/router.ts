import { createRouter, createWebHistory } from 'vue-router';
import BaseView from './views/BaseView.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'base',
			component: BaseView,
		},
		{
			path: '/login',
			name: 'login',
			component: (): Promise<typeof import('./views/LoginView.vue')> =>
				import('./views/LoginView.vue'),
		},
	],
});

export default router;
