<script setup lang="ts">
import { useModel } from '../models';
import ErrorDisplay from './ErrorDisplay.vue';

const { data, error } = useModel('get_current_user');
</script>

<template>
	<div>
		<ErrorDisplay v-if="error" :error="error" />
		<div v-else-if="!data">Loading...</div>
		<div v-else>Hello, {{ data.displayName }}</div>
	</div>
</template>
