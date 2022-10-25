<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
	error: any;
}>();
</script>

<template>
	<div>{{ t('Internal.Error') }}: {{ props.error }}</div>
</template>
