<script setup lang="ts">
import { setToken, type AuthTokens } from '../utils/token';
import { invoke } from '@tauri-apps/api/tauri';
import { t } from '../utils/i18n';
import { error } from '../plugins';
import { useRouter } from 'vue-router';

const router = useRouter();

const onLoginClick = async (): Promise<void> => {
	try {
		const authTokens = (await invoke(
			'get_authorization_code'
		)) as AuthTokens;
		setToken(authTokens);
	} catch (e) {
		await error(e as string);
	} finally {
		router.push('/');
	}
};
</script>

<template>
	<a rel="noopener noreferrer" @click.prevent="onLoginClick">{{
		t('Views.Login.Auth')
	}}</a>
</template>

<style scoped lang="scss">
.a {
	font-size: 1rem;
	font-weight: bold;
	text-align: center;
}
</style>
