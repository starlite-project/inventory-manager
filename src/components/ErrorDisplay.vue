<script setup lang="ts">
const props = defineProps<{
	error: any;
}>();
</script>

<template>
	<div>{{ $t('internal.error') }}: {{ props.error }}</div>
</template>
