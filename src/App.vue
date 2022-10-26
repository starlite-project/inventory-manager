<script setup lang="ts">
import { useAccountStore } from './stores';
import NavigateTo from './components/NavigateTo.vue';

const account = useAccountStore();

const needsLogin = account.needsLogin;
</script>

<template>
	<RouterView />
	<NavigateTo v-if="needsLogin" to="/login" />
	<NavigateTo v-else to="/inventory" />
</template>

<style lang="scss">
:root {
	--header-height: 44px;

	overflow-y: scroll;
}
</style>
