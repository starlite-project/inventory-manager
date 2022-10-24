import { hasValidAuthTokens } from '../utils/token';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export default defineStore('account', () => {
	const needsLogin = ref(!hasValidAuthTokens());
	const loaded = ref(false);

	const login = (): void => {
		needsLogin.value = false;
	};

	const logout = (): void => {
		loaded.value = false;
		needsLogin.value = true;
	};

	return {
		needsLogin,
		login,
		logout,
	};
});
