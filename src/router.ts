import type { I18n } from 'vue-i18n';
import { createRouter, createWebHistory, type Router, type RouteRecordRaw } from 'vue-router';
import { getLocale, INVENTORY_MANAGER_LANGS, loadLocaleMessages, setI18nLanguage } from './utils/i18n';
import BaseView from './views/BaseView.vue';

// const router = createRouter({
// 	history: createWebHistory(import.meta.env.BASE_URL),
// 	routes: [
// 		{
// 			path: '/inventory',
// 			name: 'inventory',
// 			component: (): Promise<
// 				typeof import('./views/InventoryView.vue')
// 			> => import('./views/InventoryView.vue'),
// 		},
// 		{
// 			path: '/login',
// 			name: 'login',
// 			component: (): Promise<typeof import('./views/LoginView.vue')> =>
// 				import('./views/LoginView.vue'),
// 		},
// 		{
// 			path: '/',
// 			name: 'home',
// 			component: BaseView,
// 		},
// 	],
// });

// export default router;

export default (i18n: I18n): Router => {
	const locale = getLocale(i18n);

	const routes: RouteRecordRaw[] = [
		{
			path: '/inventory',
			name: 'inventory',
			component: (): Promise<typeof import('./views/InventoryView.vue')> => import('./views/InventoryView.vue')
		},
		{
			path: '/login',
			name: 'login',
			component: (): Promise<typeof import('./views/LoginView.vue')> => import('./views/LoginView.vue'),
		},
		{
			path: '/',
			name: 'home',
			component: BaseView
		}
	];

	const router = createRouter({
		history: createWebHistory(),
		routes
	});

	router.beforeEach(async (to): Promise<void | string> => {
		const paramsLocale = to.params.locale as string;

		if (!INVENTORY_MANAGER_LANGS.includes(paramsLocale)) return `/${locale}`;

		if (!i18n.global.availableLocales.includes(paramsLocale)) {
			await loadLocaleMessages(i18n, paramsLocale);
		}

		setI18nLanguage(i18n, paramsLocale);
	});

	return router;
}