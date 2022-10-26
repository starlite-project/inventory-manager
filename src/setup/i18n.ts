import i18next from 'i18next';
import en from '../locale/en.json';
import resourcesToBackend from 'i18next-resources-to-backend';
import I18NextVue from 'i18next-vue';
import LanguageDetector from 'i18next-browser-languagedetector';
import type { App } from 'vue';

interface LangInfo {
	pluralOverride: boolean;
	latinBased: boolean;
}

export const INVENTORY_MANAGER_LANG_INFOS: Record<string, LangInfo> = {
	en: { pluralOverride: false, latinBased: true },
};

const INVENTORY_MANAGER_LANGS = Object.keys(INVENTORY_MANAGER_LANG_INFOS);

export const initi18n = async (app: App): Promise<App> => {
	await i18next
		.use(
			resourcesToBackend((language, _namespace, callback) => {
				import(`../locale/${language}.json`)
					.then((resources) => callback(null, resources))
					.catch((error) => callback(error, null));
			})
		)
		.use(LanguageDetector)
		.init({
			detection: {
				order: ['localStorage', 'navigator'],
				lookupLocalStorage: 'defaultLanguage',
				caches: ['localStorage'],
			},
			initImmediate: true,
			compatibilityJSON: 'v3',
			debug: __INVENTORY_MANAGER_FLAVOR__ === 'dev',
			fallbackLng: 'en',
			supportedLngs: INVENTORY_MANAGER_LANGS,
			load: 'currentOnly',
			interpolation: {
				escapeValue: false,
				format: (val: string, format) => {
					switch (format) {
						case 'pct':
							return `${Math.min(
								100,
								Math.floor(100 * parseFloat(val))
							)}%`;
						case 'humanBytes':
							return humanBytes(parseInt(val, 10));
						case 'number':
							return parseInt(val, 10).toLocaleString();
						default:
							return val;
					}
				},
			},
			backend: {
				loadPath: ([lng]: string[]) => {
					const path = {
						en,
					}[lng] as unknown as string;
					if (!path) throw new Error(`unsupported language ${lng}`);
					return path;
				},
			},
			returnObjects: true,
		});

	return app.use(I18NextVue, { i18next });
};

const humanBytes = (size: number): string => {
	if (size <= 0) return '0B';
	const i = Math.floor(Math.log(size) / Math.log(1024));
	return `${(size / Math.pow(1024, i)).toFixed(2)} ${
		['B', 'KB', 'MB', 'GB', 'TB'][i]
	}`;
};
