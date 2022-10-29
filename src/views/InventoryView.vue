<script setup lang="ts">
import { useAccountStore } from '@/stores';
import { useAsyncState } from '@vueuse/core';
import ErrorDisplay from '../components/ErrorDisplay.vue';

const account = useAccountStore();

const {
	state: data,
	error,
	isLoading,
} = useAsyncState(
	account.getAccounts().then(() => account.accounts),
	[]
);
</script>

<template>
	<div>
		<ErrorDisplay v-if="error" :error="error" />
		<div v-else-if="isLoading">Loading...</div>
		<div v-else>{{ JSON.stringify(data) }}</div>
	</div>
</template>
