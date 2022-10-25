<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
	to: string;
}>();

onMounted((): void => {
	router.push(props.to);
});
</script>

<template>
	<template v-if="false"></template>
</template>
