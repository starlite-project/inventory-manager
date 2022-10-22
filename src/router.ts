import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'base',
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
	],
});

export default router;
