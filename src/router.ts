import { createRouter, createWebHistory } from 'vue-router';
import BaseView from './views/BaseView.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/inventory',
			name: 'inventory',
			component: (): Promise<
				typeof import('./views/InventoryView.vue')
			> => import('./views/InventoryView.vue'),
		},
		{
			path: '/login',
			name: 'login',
			component: (): Promise<typeof import('./views/LoginView.vue')> =>
				import('./views/LoginView.vue'),
		},
		{
			path: '/',
			name: 'home',
			component: BaseView,
		},
	],
});

export default router;
