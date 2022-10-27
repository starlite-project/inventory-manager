<script setup lang="ts">
import NavigateTo from './components/NavigateTo.vue';
</script>

<template>
	<RouterView />
	<NavigateTo to="/inventory" />
</template>

<style lang="scss">
:root {
	--header-height: 44px;

	overflow-y: scroll;
}
</style>
