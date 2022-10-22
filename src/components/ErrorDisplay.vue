<script setup lang="ts">
import { t } from '../utils/i18n';

const props = defineProps<{
	error: any;
}>();
</script>

<template>
	<div>{{ t('Internal.Error') }}: {{ props.error }}</div>
</template>
