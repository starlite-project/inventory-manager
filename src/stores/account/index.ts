import { hasValidAuthTokens } from '../../utils/token';
import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import { type DestinyAccount, generatePlatforms } from './transformers';
import { internalFetch } from '../../models';

export default defineStore('account', () => {
	const needsLogin = ref(!hasValidAuthTokens());
	const loaded = ref(false);
	const accounts = reactive<DestinyAccount[]>([]);

	const login = (): void => {
		needsLogin.value = false;
	};

	const logout = (): void => {
		loaded.value = false;
		needsLogin.value = true;
		accounts.length = 0;
	};

	const loadAccounts = async (): Promise<void> => {
		const destinyResponse = await internalFetch('get_linked_profiles');
		if (!destinyResponse) return;
		const destinyAccounts = generatePlatforms(destinyResponse);
		accounts.length = 0;
		accounts.push(...destinyAccounts);
		loaded.value = true;
	};

	return {
		needsLogin,
		accounts,
		login,
		logout,
		loadAccounts,
	};
});
