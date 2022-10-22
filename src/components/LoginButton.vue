<script setup lang="ts">
import { setToken, type AuthTokens } from '../utils/token';
import { invoke } from '@tauri-apps/api/tauri';
import { t } from '../utils/i18n';
import { error } from '../plugins';
import { useRouter } from 'vue-router';
import { useAccountStore } from '../stores/account';

const router = useRouter();
const account = useAccountStore();

const onLoginClick = async (): Promise<void> => {
	try {
		const authTokens = (await invoke(
			'get_authorization_code'
		)) as AuthTokens;
		setToken(authTokens);
		account.login();
	} catch (e) {
		await error(e as string);
	} finally {
		router.push('/');
	}
};
</script>

<template>
	<a class="auth" rel="noopener noreferrer" @click.prevent="onLoginClick">{{
		t('Views.Login.Auth')
	}}</a>
</template>

<style scoped lang="scss">
.auth {
	font-size: 1rem;
	font-weight: bold;
	text-align: center;
}
</style>
