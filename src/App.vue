<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAccountStore } from './stores/account';

const account = useAccountStore();

const router = useRouter();

onMounted((): void => {
	if (account.needsLogin) {
		router.push('/login');
	} else {
		router.push('/');
	}
});
</script>

<template>
	<RouterView />
</template>

<style scoped lang="scss">
.wrapper {
	padding: 20px;
}
</style>
