<script setup lang="ts">
import { setToken, type AuthTokens } from '../utils/token';
import { invoke } from '@tauri-apps/api/tauri';
import { error } from '../plugins';
import { useRouter } from 'vue-router';
import { useAccountStore } from '../stores';

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
		router.push('/inventory');
	}
};
</script>

<template>
	<a class="auth" rel="noopener noreferrer" @click.prevent="onLoginClick">{{
		$t('views.login.auth')
	}}</a>
</template>

<style scoped lang="scss">
@use '../variables' as *;

.auth {
	@include im-button;
	font-size: 1rem;
	font-weight: bold;
	text-align: center;
}
</style>
