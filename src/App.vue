<script setup lang="ts">
import { useAccountStore } from './stores/account';
import NavigateTo from './components/NavigateTo.vue';

const account = useAccountStore();

const needsLogin = account.needsLogin;
</script>

<template>
	<RouterView />
	<NavigateTo v-if="needsLogin" to="/login" />
	<NavigateTo v-else to="/" />
</template>

<style lang="scss">
:root {
	--arc: #85c5ec;
	--solar: #f2721b;
	--void: #814bcf;
	--stasis: #4d88ff;

	--common: #dcdcdc;
	--uncommon: #366e42;
	--rare: #5076a3;
	--legendary: #513065;
	--exotic: #c3a019;

	--xp: #5ea16a;
	--gold: #f5dc56;
	--power: var(--gold);

	--masterwork-border-color: #eade8b;
	--deepsight-border-color: #d25336;

	--primary: #da004e;
	--secondary: #843da4;

	--header-height: 44px;
}
</style>
