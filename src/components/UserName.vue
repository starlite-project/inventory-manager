<script setup lang="ts">
import { useModel } from '../models';

const { data, error } = useModel('get_current_user');
</script>

<template>
	<div>
		<div v-if="error">failed to load: {{ error }}</div>
		<div v-if="!data">Loading...</div>
		<div v-else>Hello, {{ data.displayName }}</div>
	</div>
</template>

<style scoped lang="scss">
.error {
	color: red;
	font-weight: bold;
}
</style>
