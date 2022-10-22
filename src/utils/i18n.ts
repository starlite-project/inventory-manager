import i18next, { type TFunctionDetailedResult } from 'i18next';
import en from '../locale/en.json';
import resourcesToBackend from 'i18next-resources-to-backend';

interface LangInfo {
	pluralOverride: boolean;
	latinBased: boolean;
}

export const INVENTORY_MANAGER_LANG_INFOS: Record<string, LangInfo> = {
	en: { pluralOverride: false, latinBased: true },
};

const INVENTORY_MANAGER_LANGS = Object.keys(INVENTORY_MANAGER_LANG_INFOS);

export const defaultLanguage = (): string => {
	const storedLanguage = localStorage.getItem('inventoryManagerLanguage');
	if (storedLanguage && INVENTORY_MANAGER_LANGS.includes(storedLanguage)) {
		return storedLanguage;
	}

	const browserLang = (window.navigator.language || 'en').toLowerCase();
	return (
		INVENTORY_MANAGER_LANGS.find((lang): boolean =>
			browserLang.startsWith(lang)
		) || 'en'
	);
};

export const initi18n = (): Promise<unknown> => {
	const lang = defaultLanguage();
	return new Promise((resolve, reject): void => {
		i18next
			.use(
				resourcesToBackend((language, _namespace, callback) => {
					import(`../locale/${language}.json`)
						.then((resources) => callback(null, resources))
						.catch((error) => callback(error, null));
				})
			)
			.init(
				{
					initImmediate: true,
					compatibilityJSON: 'v3',
					debug: __INVENTORY_MANAGER_FLAVOR__ === 'dev',
					lng: lang,
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
							if (!path) {
								throw new Error(`unsupported language ${lng}`);
							}

							return path;
						},
					},
					returnObjects: true,
				},
				(error) => {
					if (error) {
						console.error(error);
						reject(error);
					} else {
						resolve(null);
					}
				}
			);
	});
};

export const t = (key: string | string[]): TFunctionDetailedResult<object> =>
	i18next.t(key);

const humanBytes = (size: number): string => {
	if (size <= 0) {
		return '0B';
	}
	const i = Math.floor(Math.log(size) / Math.log(1024));
	return `${(size / Math.pow(1024, i)).toFixed(2)} ${
		['B', 'KB', 'MB', 'GB', 'TB'][i]
	}`;
};
