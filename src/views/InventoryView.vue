<script setup lang="ts">
import { ref } from 'vue';
import ErrorDisplay from '../components/ErrorDisplay.vue';
import { useAccountStore } from '../stores';

const accounts = useAccountStore();

const loading = ref(true);

accounts.loadAccounts().then(() => (loading.value = false));
</script>

<template>
	<div>
		<div v-if="loading">Loading data...</div>
		<div v-else>Raw data: {{ JSON.stringify(accounts.accounts) }}</div>
	</div>
</template>
