<script setup lang="ts">
import { useModel } from '../models';
import ErrorDisplay from '../components/ErrorDisplay.vue';

const { data, error } = useModel('get_linked_profiles');
</script>

<template>
	<div>
		<ErrorDisplay v-if="error" :error="error" />
		<div v-else-if="!data">Loading data...</div>
		<div v-else>Raw data: {{ JSON.stringify(data.profiles) }}</div>
	</div>
</template>
