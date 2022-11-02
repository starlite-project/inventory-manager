import { useAccountStore } from '@/stores';
import type { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import BaseView from '../views/BaseView.vue';

export const initRouter = (app: App): App => {
	const router = createRouter({
		history: createWebHistory(import.meta.env.BASE_URL),
		routes: [
			{
				path: '/inventory',
				name: 'inventory',
				component: (): Promise<
					typeof import('../views/InventoryView.vue')
				> => import('../views/InventoryView.vue'),
				meta: { requiresAuth: true },
			},
			{
				path: '/login',
				name: 'login',
				component: (): Promise<
					typeof import('../views/LoginView.vue')
				> => import('../views/LoginView.vue'),
				meta: { requiresAuth: false },
			},
			{
				path: '/',
				name: 'home',
				component: BaseView,
				meta: { requiresAuth: true },
			},
		],
	});

	router.beforeEach((to) => {
		const account = useAccountStore();
		if (to.meta.requiresAuth && !account.isLoggedIn) {
			return {
				path: '/login',
			};
		}
	});

	return app.use(router);
};
