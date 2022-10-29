<script setup lang="ts">
import { useAccountStore, useCharacterStore } from '@/stores';
import ErrorDisplay from '../components/ErrorDisplay.vue';

const { data, error } = useCharacterStore();
</script>

<template>
	<div>
		<ErrorDisplay v-if="error" :error="error" />
		<div v-else-if="!data.length">Loading...</div>
		<div v-else>{{ JSON.stringify(data) }}</div>
	</div>
</template>
