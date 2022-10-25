import { nextTick } from 'vue';
import {
	createI18n,
	type I18n,
	type I18nOptions,
	type Locale,
	type VueI18n,
	type Composer,
} from 'vue-i18n';

export const INVENTORY_MANAGER_LANGS = ['en'];

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

export const getLocale = (i18n: I18n): string =>
	i18n.mode === 'legacy'
		? (i18n.global as unknown as VueI18n).locale
		: (i18n as unknown as Composer).locale.value;

export const setLocale = (i18n: I18n, locale: Locale): void => {
	if (i18n.mode === 'legacy') {
		(i18n.global as unknown as VueI18n).locale = locale;
	} else {
		(i18n.global as unknown as Composer).locale.value = locale;
	}
};

export const setupI18n = (options: I18nOptions = { locale: 'en' }): I18n => {
	const i18n = createI18n(options);
	setI18nLanguage(i18n, options.locale!);
	return i18n;
};

export const setI18nLanguage = (i18n: I18n, locale: Locale): void => {
	setLocale(i18n, locale);
	document.querySelector('html')!.setAttribute('lang', locale);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-function-return-type
const getResourceMessages = (r: any) => r.default || r;

export const loadLocaleMessages = async (
	i18n: I18n,
	locale: Locale
): Promise<void> => {
	const messages = await import(
		/* @vite-ignore */ `../locale/${locale}.json`
	).then(getResourceMessages);

	i18n.global.setLocaleMessage(locale, messages);
	return nextTick();
};
