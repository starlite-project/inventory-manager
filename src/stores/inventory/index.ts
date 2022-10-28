import { defineStore } from 'pinia';
import { reactive } from 'vue';

export default defineStore('inventory', () => {
	const stores: any[] = reactive([]);

	return {
		stores,
	};
});
