<script setup lang="ts">
import LoginButton from '../components/LoginButton.vue';
</script>

<template>
	<div class="billboard">
		<LoginButton />
	</div>
</template>

<style scoped lang="scss">
@use '../variables' as *;

.billboard {
	display: flex;
	flex-direction: column;
	align-items: stretch;
	background-color: rgba(0, 0, 0, 0.6);
	color: white;
	max-width: 800px;
	border-top: 5px solid #888;
	box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
	padding: 1rem 3rem;
	text-align: center;
	z-index: 99999;
	white-space: pre-wrap;
	box-sizing: border-box;
	margin: auto;

	h1 {
		@include destiny-header;
		margin: 0;
		text-align: center;
	}
}
</style>
