import { hasValidAuthTokens, removeToken } from '../utils/token';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export default defineStore('login', () => {
	const isLoggedIn = ref(hasValidAuthTokens());

	const login = (): void => {
		isLoggedIn.value = true;
	};

	const logout = (): void => {
		isLoggedIn.value = false;
		removeToken();
	};

	return {
		isLoggedIn,
		login,
		logout,
	};
});
