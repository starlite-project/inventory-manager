import { defineStore } from 'pinia';
import { type DestinyAccount, generateDestinyAccounts } from './types';
import { computed, ref } from 'vue';
import { hasValidAuthTokens } from '@/utils/token';
import { useStorage } from '@vueuse/core';
import { fetch } from '@/models';
import { error } from '@/plugins';

export default defineStore('account', () => {
	const isLoggedIn = ref(hasValidAuthTokens());
	const accounts = useStorage<DestinyAccount[]>(
		'account-destiny-accounts',
		[],
		localStorage
	);
	const loaded = computed((): boolean => accounts.value.length > 0);
	const loadedOnce = useStorage('account-loaded-once', false, sessionStorage);

	const login = (): void => {
		isLoggedIn.value = true;
	};

	const logout = (): void => {
		isLoggedIn.value = false;
		accounts.value.length = 0;
		loadedOnce.value = false;
	};

	const getAccounts = async (
		force: boolean = !loaded.value && loadedOnce.value
	): Promise<void> => {
		if (!force && loaded.value && loadedOnce.value) return;

		const data = await fetch('get_linked_profiles');

		if (!data) {
			await error('Failed to fetch profile');
			throw new Error('Failed to fetch profile');
		}

		accounts.value = generateDestinyAccounts(data);
		loadedOnce.value = true;
	};

	return {
		isLoggedIn,
		accounts,
		loaded,
		login,
		logout,
		getAccounts,
	};
});
